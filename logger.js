const winston=require("winston")
require("winston-mongodb")
require("dotenv").config()

const logger=winston.createLogger({
    transports:[
        new winston.transports.Console(),
        new winston.transports.MongoDB({db:process.env.mongoURL,options:{useUnifieldTopology:true}})
    ]
})

module.exports={logger}