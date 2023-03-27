const{logger}=require("../logger")

const validation=(req,res,next)=>{
    const city=req.query.city;
    if(!/^[a-zA-z]+$/.test(city)){
        loggers.error(`invalid city : ${city}`)
        return res.status(400).json({"msg":"invalid city"})
    }
    next()
}

module.exports={validation}