const { default: mongoose } = require("mongoose");
const Question = require("../Models/Question");
const Post = require("../Models/Questions");
const User = require("../Models/User");
const Mongoose = require("mongoose");

exports.Publishquestion = async(req,res)=>{
    try {

        const {question,isanonymous} = req.body;

        if( !question)
        {
            return res.status(404).json({
                succsess:false,
                message:" question id not found"
            })
        }
        const asker = req.user.id;

        
        const response = await Post.create({asker,question,isanonymous:isanonymous});

        const userres = await User.findByIdAndUpdate(asker,{
            $push:{Questions:response._id}
        },{new:true});

        console.log("userres",userres);
        return res.status(200).json({
            succsess:true,
            message:"Posted sucsessfully",
            data:response
        })
        
    } catch (error) {
        console.log("error while question posting",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
            error:error
        })
    }
}

exports.deletePost = async(req,res)=>{
    try {

        const {postid} = req.body;

        const asker = req.user.id;

        if(!postid)
        {
            return res.status(404).json({
                succsess:false,
                message:"Post id not found"
            })
        }

        // const posts = await Post.findOne({_id:postid});
        
        // console.log("post",posts);
        // const questionid = posts.question;

        // await Question.findByIdAndDelete(questionid);
        const userres = await User.findByIdAndUpdate(asker,{
            $pull:{Questions: postid }
        },{new:true});

        console.log("deleteuserres",userres);
        await Post.findByIdAndDelete(postid);

        return res.status(200).json({
            succsess:true,
            message:"Post deleted sucsessfully"
        })
        
    } catch (error) {
        console.log("error while post deletion" , error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
            error:error
        })
    }
}


exports.getallquestions = async(req,res)=>{
    try {

        const ques = await Post.find({})?.sort({createdAt:-1}).populate("asker").populate({
            path:"question",
            
            populate:{
            path:"tags"
            }
            
            
        }).populate({
            path:"answers",
            populate:{
                path:"solver"
            }
        }).exec();

        return res.status(200).json({
            succsess:true,
            message:"all questions fetched succsessfull",
            data:ques
        })
        
    } catch (error) {
        console.log("error while all ques fetching",error);
        return res.status(500).json({
            succsess:false,
            message:error
        })        
    }
}

exports.getquestionbyid = async(req,res)=>{
    try {

        const {queid} = req.body;
        console.log("queid",queid);

        const question = await Post.findById(queid).populate("asker").populate({
            path:"question",
            
            populate:{
            path:"tags"
            }
            
            
        }).populate({
            path:"answers",
            populate:{
                path:"solver"
            }
        }).exec();

        if(!question)
        {
            return res.status(404).json({
                succsess:false,
                message:"Discussion not found",
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"Disscussion Found",
            data:question
        });

        
    } catch (error) {
        console.log("error while disscussion fetching using id",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
        })
    }
}


exports.getpostbytag = async(req,res)=>{
    try {

        const {tagid} = req.body;

        const response = await Question.find({tags:tagid});

        //console.log("response",response);
        const result = [];
        for(let i = 0;i<response.length;i++)
        {
            try {
                const ques = await Post.findOne({question:response[i]._id}).sort({createdAt:-1}).populate("asker").populate({
                    path:"question",
                    
                    populate:{
                    path:"tags"
                    }
                    
                    
                }).populate({
                    path:"answers",
                    populate:{
                        path:"solver"
                    }
                }).exec();
                console.log("Posts",ques);
                result.push(ques);

            } catch (error) {
                console.log("error while post fetching",error);
                return res.status(500).json({
                    succsess:false,
                    message:"internal server error"
                })
            }
            
        }



        return res.status(200).json({
            succsess:true,
            message:"Succsessfully fetched posts",
            data:result
        })


        
    } catch (error) {
        console.log("error while tag wise fetching",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
            error:error
        })
    }
}

exports.updatevotes = async(req,res)=>{
    try {

        const {postid} = req.body;

        const updatedvote = await Post.findByIdAndUpdate(postid,{
            $push:{upvotes:req.user.id}
        },{new:true});

        if(!updatedvote)
        {
            return res.status(400).json({
                succsess:false,
                message:"Some thing went wrong"
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"Sucsessfully voted",
            data:updatedvote
        })
        
    } catch (error) {
        console.log("error while voting",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
            error:error
        })
    }
}