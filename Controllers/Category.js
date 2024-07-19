const Tags = require("../Models/Tags")

exports.CreateTags = async(req,res)=>{
    try {
        
        const {tagname,description} = req.body;

        if(!tagname || !description)
        {
            return res.status(401).json({
                succsess:false,
                message:"All feilds are required"
            })
        }

        const response = await Tags.create({tagname,description});
        if(!response)
        {
            return res.status(401).json({
                succsess:false,
                message:"tag not created"
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"succsessfully created tag",
            response,
        })

    } catch (error) {
        console.log("error while tag creation",error);
        return res.status(500).json({
            succsess:false,
            message:error,
        })
    }
}


exports.showalltag = async(req,res)=>{
    try {

        const response = await Tags.find({});
        if(!response)
        {
            return res.status(401).json({
                succsess:false,
                message:"Not any tag created yet"
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"succsessfully fethed all tags",
            tags:response
        })
        
    } catch (error) {
        console.log("error while fetching tag",error);
        return res.status(500).json({
            succsess:false,
            message:error
        })
    }
}