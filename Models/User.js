const { default: mongoose, mongo } = require("mongoose");


const userschema =  new mongoose.Schema({
    Name:{
        type:String,
        reqiured:true,
    },
    Email:{
        type:String,
        reqiured:true
    },
    image:{
        type:String,
        
    },
    password:{
        type:String,
        reqiured:true
    },
    Role:{
        type:String,
        default:"User"
    },
    Questions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    college:{
        type:String,
        reqiured:true,
    }

});

module.exports = mongoose.model("User",userschema);