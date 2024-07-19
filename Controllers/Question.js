const Question = require("../Models/Question");
const {Uploadmedia} = require("../Utils/mediauploader");

exports.Createquestion = async(req,res)=>{

    try {

        const {problem,problemdescription,tags,mediaType} = req.body;
        const Media = req?.files?.problemFile;

        if(!problem || !problemdescription || !tags)
        {
            return res.status(401).json({
                succsess:false,
                message:"all feilds are required",
            })
        }

        let mediaurl = null;
        if(Media)
        {
            const filedata =await  Uploadmedia(Media,"Ut");
            console.log("media uploaded",filedata);
            if(filedata)
            {
                mediaurl = filedata.secure_url;
            }
        }

       const response = await Question.create({problem,problemdescription,tags,Media:mediaurl,mediaType:mediaType});

       return res.status(200).json({
        succsess:true,
        message:"Question created sucsessfully",
        data:response
       })

        
    } catch (error) {
        console.log("error while creating question",error);
        return res.status(500).json({
            succsess:true,
            message:"internal server error",
            errro:error
        })
    }

}


exports.updateQuestion = async(req,res)=>{
    try {

        const {questionid,problem,problemdescription,tags} = req.body;
        const Media = req?.files?.problemFile;

        if(!questionid)
        {
            return res.status(404).json({
                succsess:false,
                message:"Question id not found"
            })
        }


        const questiondata = await Question.findById(questionid);

        if(problem)
        {
            questiondata.problem = problem;
        }
        if(problemdescription)
        {
            questiondata.problemdescription = problemdescription;
        }
        if(tags)
        {
            questiondata.tags = tags;
        }
        if(Media)
        {
            const filedata =await  Uploadmedia(Media,"Ut");
            console.log("media uploaded",filedata);
            if(filedata)
            {
                questiondata.Media = filedata.secure_url;
            }
        }

        await questiondata.save();

        return res.status(200).json({
            succsess:true,
            message:"Updated succsessfully",
            data:questiondata
        })
        
    } catch (error) {
        console.log("error while question updation",error);
        return res.status(500).json({
            succsess:false,
            message:'internal server error',
            error:error
        })
    }
}