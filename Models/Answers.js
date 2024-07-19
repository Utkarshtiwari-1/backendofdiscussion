const { default: mongoose, mongo } = require("mongoose");

const answerschema = new mongoose.Schema({
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    solver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    answer:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("Answers",answerschema);