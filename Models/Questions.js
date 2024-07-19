const { default: mongoose, mongo } = require("mongoose");


const questionschems = new mongoose.Schema({
    asker:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       
        default:"Anonymous User"
    },
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question"
    },
    answers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Answers",
        }
    ],
    upvotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    isanonymous:{
        type:Boolean,
        default:false
    }
    

},{timestamps:true});

module.exports = mongoose.model("Post",questionschems);