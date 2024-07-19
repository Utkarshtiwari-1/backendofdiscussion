const jwt  = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async(req,res,next)=>{
    try {
        
        //extract token
        console.log("token lene aaye hain",req.cookies.token);

        const token  = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token)
        {
            return res.status(400).json({
                succsess:false,
                message:"token not found",
            });
        }

        //verify the token
        try {

            const decode = jwt.verify(token,process.env.JWTSECRET);
            console.log("verified",decode);

            req.user = decode;
            
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                succsess:false,
                message:"jwt verification failed",
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            sucsess:false,
            message:"authentication failed",
        });

    }
}