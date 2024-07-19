const { default: mongoose } = require("mongoose");

const questionschema = new mongoose.Schema({
    problem:{
        type:String,
        required:true,
        trim:true,
    },
    problemdescription:{
        type:String,
        required:true,
        trim:true,
    },
    tags:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tags",
        required:true
    },
    Media:{
        type:String
    },
    mediaType:{
        type:String,
        default:"image"
    },
    date:{
        type:Date,
        default:Date.now()
    }


})

module.exports = mongoose.model("Question",questionschema);