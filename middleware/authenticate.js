const jwt=require("jsonwebtoken")
const{userModel}=require("../model/user.model")
const redis=require("redis")
const  client=redis.createClient();

client.connect()

const authenticate=async(req,res,next)=>{
    try {
        const token=await client.get("token");
        const isBlacklisted=await client.get("blacklist_token")
        if(isBlacklisted){
            return res.status(401).send("token is blacklisted")
        }else{
            const decodeToken=jwt.verify(token,"masai")
            const{userID}=decodeToken;

            const user=await userModel.findById(userID);
            if(!user){
                return res.status(401).send({"msg":"pls login1","error":error.message})
            }
            req.user=user;
            next()
        }
    } catch (error) {
        return res.status(401).send({"msg":"pls login2","error":error.message})
        
    }
}

module.exports={authenticate}