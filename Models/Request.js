const { default: mongoose } = require("mongoose");


const requestschema = new mongoose.Schema({
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"],
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

module.exports = mongoose.model("Request",requestschema);