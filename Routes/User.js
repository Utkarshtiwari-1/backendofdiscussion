
const express = require("express");
const {Signupuser,loginuser,getuserProfile,updateimage} = require("../Controllers/auth");
const { CreateTags, showalltag } = require("../Controllers/Category");
const { Createquestion,updateQuestion } = require("../Controllers/Question");
const {auth} = require("../Middleware/Auth");
const {Publishquestion,deletePost,getallquestions,getquestionbyid,getpostbytag,
    updatevotes
} = require("../Controllers/Questions");
const {Createanswer} = require("../Controllers/Answers");
const router = express.Router();

router.post("/signup",Signupuser);
router.post("/login",loginuser);
router.post("/createtag",CreateTags);
router.get("/getalltags",showalltag);
router.post("/createquestion",auth,Createquestion);
router.post("/updatequestion",auth,updateQuestion);
router.post("/postquestion",auth,Publishquestion);
router.post("/deletepost",auth,deletePost);
router.get("/getallquestions",getallquestions);
router.post("/createanswer",auth,Createanswer)
router.post("/getquestionbyid",getquestionbyid);
router.post("/gettagwisepost",getpostbytag);
router.post("/incvote",auth,updatevotes);
router.get("/get-profile",auth,getuserProfile);
router.post("/update-image",auth,updateimage);

module.exports = router