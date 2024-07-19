const { default: mongoose, mongo } = require("mongoose");

const chatschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    groupChat:{
        type:Boolean,
        default:false
    },
    avtar:{
        type:String,
        default:"https://api.dicebear.com/9.x/bottts/svg?seed=Princess"
    },
    creater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

   
} ,{timestamps:true});


module.exports = mongoose.model("Chat",chatschema);

