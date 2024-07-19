const express  = require("express");

const router = express.Router();

const {auth} = require("../Middleware/Auth");
const {newGroupchat,getmyChats,getmyGroups,addMembers,removeMembers
    ,leaveChat,getChatdetails,renameGroup,deleteGroup,getMessages,
    searchUser,sendRequest,acceptRequest,getallNotifications,
    getMyfreinds,isuserrequested
} = require("../Controllers/Chat");

const {Newchatwithgemini} = require("../Controllers/Geminiapi");

router.post("/new",auth,newGroupchat);
router.get("/my-chats",auth,getmyChats);
router.get("/getmygroups",auth,getmyGroups);
router.put("/add-members",auth,addMembers);
router.put("/remove-members",auth,removeMembers)
router.delete("/leave",auth,leaveChat);
router.route("/group/:id").get(auth,getChatdetails).put(auth,renameGroup).delete(auth,deleteGroup);
router.post("/get-messages",auth,getMessages);
router.get("/search-user",auth,searchUser);
router.post("/send-request",auth,sendRequest);
router.post("/acceptRequest",auth,acceptRequest);
router.get("/getallNotifications",auth,getallNotifications);
router.get("/get-myFreinds",auth,getMyfreinds);
router.post("/isrequested",auth,isuserrequested);
router.post("/ask/google-gemini",Newchatwithgemini);
module.exports = router;