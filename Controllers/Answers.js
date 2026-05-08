const Answers  = require("../Models/Answers");
const Post = require("../Models/Questions");
const { uploadToR2 } = require("../Utils/r2Uploader");

exports.Createanswer = async(req,res)=>{
    try {

        const {question,answer} = req.body;
        const Media = req?.files?.ansFile;

        if(!question || !answer)
        {
            return res.status(402).json({
                succsess:false,
                message:"All feilds are required"
            })
        }

        let mediaurl = null;
        if(Media)
        {
            
            const uploadedFile = await uploadToR2(Media, "images/");
            
            console.log("media uploaded to r2",uploadedFile);
           
            if(uploadedFile.success)
            {
                mediaurl = uploadedFile.url;
            }
            console.log("mediaurl",mediaurl);
        }

        const answerres = await Answers.create({question,solver:req.user.id,answer,Media:mediaurl});

        const questionres = await Post.findByIdAndUpdate(question,{
            $push:{answers:answerres._id}
        },{new:true});

        console.log("quesres",questionres);

        return res.status(200).json({
            succsess:true,
            message:'succsessflly answer created',
            data:answerres
        })
        
    } catch (error) {
        console.log("error while answer creation",error);
        return res.status(500).json({
            succsess:false,
            message:error
        })
    }
}