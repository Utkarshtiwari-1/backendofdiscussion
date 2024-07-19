
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const Answers = require("../Models/Answers");
const Chat = require("../Models/Chat");
const Request = require("../Models/Request");
const { Uploadmedia } = require("../Utils/mediauploader");

exports.Signupuser = async(req,res)=>{

    try {

        const {Name,Email,password, college} = req.body;

        if(!Name || !Email ||!password || !college)
        {
            return res.status(401).json({
                succsess:false,
                message:"All feilds are required"
            })
        }

        //check user already exixst
        const existuser = await User.findOne({Email:Email});

        if(existuser)
        {
            return res.status(401).json({
                succsess:false,
                message:"user already exist"
            })
        }

        const hashedpass = await bcrypt.hash(password,10);

        const response = await User.create({Name:Name ,Email:Email, password:hashedpass,college:college,
            image:`https://api.dicebear.com/9.x/micah/svg?seed=${Name}`
        });

        if(!response)
        {
            return res.status(401).json({
                succsess:false,
                message:"user din't registerd succsessfully"
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"User registerd succsessfully",
            data:response
        })
        
    } catch (error) {
        console.log("error while registering user",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
            error:error
        })
    }

}


exports.loginuser = async(req,res)=>{
    try {
        
        const {Email,password} = req.body;

        if(!Email || !password)
        {
            return res.status(401).json({
                sucsess:false,
                message:"all feilds are required",
            });
        }
        //check user exist or not
        const  userexist = await User.findOne({Email:Email});

        if(!userexist)
        {
            return res.status(404).json({
                succsess:false,
                message:"User does not exist, Please signup first"
            })
        }

        //password match
        if(bcrypt.compare(password,userexist.password))
        {
            //create a token and send a succsess response
            const payload = {
                Email:userexist.Email,
                id:userexist._id,
                Name:userexist.Name,
            }
            const token = jwt.sign(payload,process.env.JWTSECRET,{
                expiresIn:"2h"
            })
            
            userexist.token = token;
            userexist.password = undefined;

            const options = {
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token",token,options).status(200).json({
                succsess:true,
                message:"User logged in sucseesfully",
                user:{userexist,
                    token}
            })
        }
        else
        {
            return res.status(402).json({
                succsess:false,
                message:"incorrect password"
            })
        }

    } catch (error) {
        console.log("error while login",error);
        return res.status(500).json({
            succsess:false,
            message:error
        })
    }
}


exports.getuserProfile = async(req,res)=>{
    try {

        const userid = req.user.id.toString();
       
        const user = await User.findById(userid).populate("Questions");

        if(!user)
        {
            return res.status(404).json({
                succsess:false,
                message:"User Not found"
            })
        }

        const Answersbyuser = await Answers.countDocuments({solver:userid});

        if(!Answersbyuser)
        {
            Answersbyuser = 0;
        }

        const groupadminUser = await Chat.find({creater:userid,groupChat:true});
        
        const Totalchats = await Chat.find({members:userid});

        const Notifications = await Request.countDocuments({receiver:userid});

        return res.status(200).json({
            succsess:true,
            message:"User Profile Data fetched succsessfully",
            data:{
                user,
                Answersbyuser,
                groupadminUser,
                Totalchats,
                Notifications
            }
        })




        
    } catch (error) {
        console.log("error while user profile fetching",error);
        return res.status(500).json({
            succsess:false,
            message:"Internal server error",
            error:error
        })
    }
}

exports.updateimage  = async(req,res)=>{
    try {
        
        const image = req.files.imagefile;
        const userid = req.user.id;

        if(!image)
        {
            return res.status(404).json({
                succsess:false,
                message:"Image not found"
            })
        }

        const imageupload = await Uploadmedia(image,"Ut");
        const imageurl = imageupload.secure_url;

        const updateduser = await User.findByIdAndUpdate(userid,{image:imageurl});

        return res.status(200).json({
            succsess:true,
            message:"image updated succsessfully"
        });


    } catch (error) {
        console.log("error while uploading image",error);
        return res.status(500).json({
            succsess:false,
            message:"Internal server error"
        })
    }
}
