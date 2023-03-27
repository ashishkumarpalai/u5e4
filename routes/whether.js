const express = require("express");
const axios = require("axios");
const { searchModel } = require("../model/search.model")
const{validation}=require("../middleware/validate")
const weatherRouter = express.Router();
require("dotenv").config()
const redis = require("redis")
const client = redis.createClient();

client.connect()

weatherRouter.get("/",validation, async (req, res) => {
    const city = req.query.city;
    client.get(city, async (err, data) => {
        if (err) {
            console.log(err)
        }
        if (data !== null) {
            res.status(200).json(JSON.parse(data))
        } else {
            try {
                const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.api_key}`)

                client.SETEX(city, 1800, JSON.stringify(response.data))

                const search = new searchModel({ city })
                await search.save()

                res.status(200).json(response.data)
            } catch (error) {
                loggers.error(error)
                res.send({ "msg": "city not found" })
            }
        }


    })


})

module.exports = { weatherRouter }