const { default: mongoose } = require("mongoose");

require("dotenv").config();
const dbconnect = async()=>{
   await mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("database connected succsessfully");
}).catch((error)=>{
    console.log("error in deb connection",error);
})}

module.exports = dbconnect;