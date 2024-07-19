const { default: mongoose } = require("mongoose");

const tagschema = new mongoose.Schema({
    tagname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    }
})

module.exports = mongoose.model("Tags",tagschema);