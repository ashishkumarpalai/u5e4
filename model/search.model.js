const mongoose=require("mongoose")

const searchSchema=mongoose.Schema({
   city:{type:String,required:true},
   date:{type:Date,default:Date.now()}
})

const searchModel=mongoose.model("search",searchSchema)

module.exports={searchModel}