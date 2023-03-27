const express=require("express")
const{userModel}=require("../model/user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const redis=require("redis")
const  client=redis.createClient();

client.connect()

const userRouter=express.Router()

//......... signup..........
userRouter.post("/signup",async(req,res)=>{
    const{name,email,pass}=req.body;
    try {
        bcrypt.hash(pass,5,async function(err,hash){
            if(err){
                res.send({"msg":"something went wrong","error":err.message})
            }else{
                const user=new userModel({name,email,pass:hash})
                await user.save()
                res.send({"msg":"New user has been signup"})
            }
        })
    } catch (error) {
        res.send({"msg":"something went wrong in signup","error":error.message})
    }
})

//.........login.............
userRouter.post("/login",async(req,res)=>{
    const{email,pass}=req.body
    try {
        const user=await userModel.find({email})
        if(user.length>0){
            bcrypt.compare(pass,user[0].pass,async function(err,result){
                if(result){
                    var token=jwt.sign({userID:user[0]._id},'masai',{expiresIn:'30m'})
                    await client.SETEX("token",6000,token);

                   res.send({"msg":"login successfull","token":token})

                }else{
                    res.send("wrong credential")
                }
            });
        }else{
            res.send("wrong credential") 
        }
    } catch (error) {
        res.send({"msg":"something went wrong in login","error":error.message})
    }
})

//............logout...............
userRouter.post("/logout",async(req,res)=>{
    try {
        const token=req.headers.authorization
        await client.set("blacklist_token",token)
        res.send("logged out successful")
    } catch (error) {
        res.send({"msg":"something went wrong in logout","error":error.message})
    }
})
module.exports={userRouter}