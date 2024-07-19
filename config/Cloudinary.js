
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const connectcloudinary = ()=>{
    try {
        
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET
        })
        console.log("Cloudinary connexted");

    } catch (error) {
        console.log("error while cloudinary connection",error);
    }
}

module.exports = connectcloudinary;