const Chat = require("../Models/Chat");
const Message = require("../Models/Message");
const User = require("../Models/User");
const Request = require("../Models/Request");
const {Emitevent} = require("../Utils/features");
const {getothermembers} = require("../Utils/features");

exports.newGroupchat = async(req,res)=>{
    try {

        const {name,members} = req.body;

        console.log("name...",name);

        if(members.length<2)
        {
            return res.status(400).json({
                succsess:false,
                message:"Members should be greater than two"
            })
        }

        const allmembers = [...members,req.user.id];
        
        const response = await Chat.create({name,groupChat:true,creater:req.user.id,members:allmembers});

        Emitevent(req,'ALERT',allmembers,`Welcome to the ${name} group`);
        Emitevent(req,'REFETCH_CHAT',allmembers);

        return res.status(200).json({
            succsess:true,
            message:"Group created succsessfully",
        })

        
    } catch (error) {
        
        console.log("error while creation of group",error);
        return res.status(500).json({
            succsess:false,
            message:"Failed to create group",
            error:error
        })
    }
}

exports.getmyChats = async(req,res)=>{
    try {

        const chats = await Chat.find({members:req.user.id}).populate("members","Name image");

       

        const transformedchats = chats.map((chat)=>{
            const othremember = getothermembers(chat.members,req.user.id);
            console.log('other members',othremember);
            return{
                _id:chat._id,
                groupChat:chat.groupChat,
                avtar:chat.groupChat?chat.avtar:othremember[0].image,
                name:chat.groupChat?chat.name:othremember[0].Name,
                members:othremember.flatMap((mem)=>(mem._id))
            }
        });

        return res.status(200).json({
            succsess:true,
            message:"chats fetched succsessfully",
            chats:transformedchats
        })

        
    } catch (error) {
        console.log("error while chats fetching",error);
        return res.status(500).json({
            succsess:false,
            message:"failed to get chats of user",
            error:error
        })
    }
}

exports.getmyGroups = async(req,res)=>{
    try {
        
        const chats = await Chat.find({members:req.user.id,groupChat:true,creater:req.user.id})
        .populate("members","name");

        return res.status(200).json({
            succsess:true,
            message:"Groups fetched succsessfully",
            groupchats:chats
        })

    } catch (error) {
        console.log("error while user groups fetching",error);
        return res.status(500).json({
            succsess:false,
            message:"failed to fetched user groups",
            error:error
        })
    }
}

exports.addMembers = async(req,res)=>{
    try {

        const {chatid,members} = req.body;

        const chat = await Chat.findById(chatid);

        if(!members || members.length<1)
        {
            return res.status(404).json({
                succsess:false,
                message:"Plz provide members",
            })
        }

        if(!chat)
        {
            return res.status(404).json({
                succsess:false,
                message:"chat not found"
            })
        }
        if(!chat.groupChat)
        {
            return res.status(403).json({
                succsess:false,
                message:"this is not a group chat"
            })
        }
        if(chat.creater.toString()!==req.user.id.toString())
        {
            return res.status(401).json({
                succsess:false,
                message:"you are not allowed to add members"
            })
        }

        //add uniqueness property........................

        const allnewmembersPromise = members.map((i)=>(
            User.findById(i)
        ))

        const allnewMembers = await Promise.all(allnewmembersPromise);

        chat.members.push(...allnewMembers.map((i)=>(i._id)));

        await chat.save();

        const allusername = allnewMembers.map((i)=>i.Name).join(",");

        Emitevent(req,'ALERT',chat.members,`${allusername} has been added to the group`);
        Emitevent(req,'REFETCH_CHAT',chat.members);

        return res.status(200).json({
            succsess:true,
            message:"Members added succsessfully",
            data:chat,
            allusername:allusername
        })

        
    } catch (error) {
        console.log("error while adding members",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
            error:error
        })
    }
}

exports.removeMembers = async(req,res)=>{
    try {

        const {chatid,userid} = req.body;

        const chat = await Chat.findById(chatid);
        const user = await User.findById(userid);

        if(!chat)
        {
            return res.status(404).json({
                succsess:false,
                message:"Chat not found",
            })

        }
        if(!user)
        {
            return res.status(404).json({
                succsess:false,
                message:"User not found"
            })
        }
        if(!chat.members.includes(userid))
        {
            return res.status(404).json({
                succsess:false,
                message:"Userid  not found in members"
            })
        }

        if(!chat.groupChat)
        {
            return res.status(401).json({
                succsess:false,
                message:"Not a group chat"
            })
        }

        if(chat.creater.toString()!==req.user.id.toString())
        {
            return res.status(401).json({
                succsess:false,
                message:"you are not allowed to remove members"
            })
        }

        chat.members = chat.members.filter((i)=>i.toString()!==userid.toString())

        await chat.save();
        Emitevent(req,'ALERT',chat.members,`${user.Name} has been removed from the group`);

        return res.status(200).json({
            succsess:true,
            message:"Succsessfully removed members",
        })
        
    } catch (error) {
        console.log("error while removing members",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
            error:error
        })
    }
}

exports.leaveChat = async(req,res)=>{
    try {

        const {chatid} = req.body;
        const chat = await Chat.findById(chatid);

        if(!chat)
        {
            return res.status(400).json({
                succsess:false,
                message:"Chat not found"
            })
        }

        if(!chat.groupChat)
        {
            await Message.deleteMany({chat:chatid});
            await Chat.findByIdAndDelete(chatid);
        }
        else
        {
            chat.members = chat.members.filter((member)=>member.toString()!==req.user.id.toString());
            await chat.save();

            Emitevent(req,'ALERT',chat.members,`User left the chat`);
        }
        

        

        return res.status(200).json({
            succsess:true,
            message:'User left succsessfully',
        })
        
    } catch (error) {
        console.log("error while leaving group",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error",
            error:error
        })
    }
}

exports.getChatdetails = async(req,res)=>{
    try {

        const chatid = req.params.id;

        const chat = await Chat.findById(chatid).populate("members","Name image").exec();
        if(!chat)
        {
            return res.status(400).json({
                succsess:false,
                message:"chat not found"
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"Chat details fetched succsessfully",
            chat:chat
        })
        
    } catch (error) {
        console.log("error while chat fetching",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error"
        })
    }
}

exports.renameGroup = async(req,res)=>{
    try {

        const chatid = req.params.id;
        const {name} = req.body;

        const oldchat = await Chat.findById(chatid);

        if(oldchat.creater.toString()!==req.user.id.toString())
        {
            return res.status(401).json({
                succsess:false,
                message:"Not allowed to rename chat"
            })
        }

        const chat = await Chat.findByIdAndUpdate(chatid,{name:name},{new:true});

        if(!chat)
        {
            return res.status(404).json({
                succsess:false,
                message:"CHat not found.."
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"chat name renamed succsessfully",
            chat:chat
        })
        
    } catch (error) {
        console.log("error while rename chat",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error"
        })
    }
}

exports.deleteGroup = async(req,res)=>{
    try {
        
        const chatid = req.params.id;
        const chat = await Chat.findById(chatid);

        //const request = await Request.findOneAndDelete({sender:req.user.id});

        if(!chat)
        {
            return res.status(400).json({
                succsess:false,
                message:"Chat not found"
            })
        }

        if(!chat.groupChat && !chat.members.includes(req.user.id))
        {
            return res.status(403).json({
                succsess:false,
                message:"Not a member"
            })
        }

        if(chat.creater.toString()!==req.user.id)
        {
            return res.status(401).json({
                succsess:false,
                message:"Not allowed to delete chat"
            })
        }

        Emitevent(req,'REFETCH_CHATS',chat.members);


        await chat.deleteOne();

        return res.status(200).json({
            succsess:true,
            message:"Chat deleted succsessfully"
        })

    } catch (error) {
        console.log("error while deleting chat",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error"
        })
    }
}

exports.getMessages = async(req,res)=>{
    try {

        const {chatid} = req.body;
        const {page = 1} = req.query;

        const limit = 20;

        const skip = (page-1)*limit;

        const messages = await Message.find({chat:chatid})
        .sort({createdAt:-1}).skip(skip).limit(limit)
        .populate("sender").lean().exec();

        const totalmessagescount = await Message.countDocuments({chat:chatid});

        const totalpages = Math.ceil(totalmessagescount/limit)|| 0;

        if(!messages)
        {
            return res.status(404).json({
                succsess:false,
                message:"No messages found"
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"Messages fetched sucsessfully",
            data:messages,
            totalpages
        })

        
    } catch (error) {
        console.log("error while messages fetching",error);
        return res.status(500).json({
            succsess:true,
            message:"internal server error"
        })
    }
}

exports.searchUser = async(req,res)=>{
    try {
        
        const {name} = req.query;

        

        const users = await User.find({_id:{$nin:req.user.id},Name:{$regex:name,$options:"i"}});
        
        const request =await Promise.all(users.map(async(user)=>{
            
            const requestuser = await Request.find({$and:[{sender:req.user.id.toString()},{receiver:user._id.toString()}]});
            console.log("requse",requestuser);
            return requestuser[0]?.receiver
            
        }))

        if(!users)
        {
            return res.status(403).json({
                succsess:false,
                message:"user Not found",
            })
        }

        return res.status(200).json({
            succsess:true,
            message:"users found succsessfully",
            users:users,
            request:request
        })

    } catch (error) {
        console.log("error while searching user",error);
        return res.status(500).json({
            succsess:false,
            message:"Internal server errror",
        })
    }
}

exports.sendRequest = async(req,res)=>{
    try {
        
        const {userid} = req.body;

        const request = await Request.findOne({sender:req.user.id});

        if(request)
        {
            return res.status(400).json({
                succsess:false,
                message:"already requested"
            })
        }

        const newreq = await Request.create({sender:req.user.id,receiver:userid});

        Emitevent(req,'NEW_REQUEST',[userid]);

        return res.status(200).json({
            succsess:true,
            message:"Request sent sucsessfully",
        })


    } catch (error) {
        console.log("error while request sending",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error"
        })
    }
}

exports.acceptRequest = async(req,res)=>{
    try {
        
        const {requestid,accept} = req.body;

        const request = await Request.findById(requestid).populate("sender","Name email").populate("receiver","Name email");

        if(request.receiver._id.toString()!==req.user.id.toString())
        {
            return res.status(401).json({
                succsess:false,
                message:"Not allowed to receive the request"
            })
        }

        if(!accept)
        {
            await request.deleteOne();
            return res.status(200).json({
                succsess:true,
                message:"Request rejected succsessfully",
            })
        }
        else
        {
            const members = [request.sender._id,request.receiver._id];
            await Chat.create({name:`${request.sender.Name}-${request.receiver.Name}`,members:members})
            //const updatedreq = await Request.findByIdAndUpdate(requestid,{status:"accepeted"});
            request.deleteOne();
            Emitevent(req,'REFETCH_CHAT',members);

            return res.status(200).json({
                succsess:"true",
                message:"Request acceptrd succsesfully"
            })
        }

    } catch (error) {
        console.log("error while request accept",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error"
        })
    }
}

exports.getallNotifications = async(req,res)=>{
    try {

        const request = await Request.find({receiver:req.user.id}).populate("sender","Name image");

        return res.status(200).json({
            succsess:true,
            message:"Notifications fetched succsesfully",
            data:request
        })

        
    } catch (error) {
        console.log("error while fetching notification",error);
        return res.status(500).json({
            succsess:false,
            message:"Internal server error"
        })
    }
}

exports.getMyfreinds = async(req,res)=>{
    try {
        
        const chats = await Chat.find({members:req.user.id,groupChat:false}).populate("members");

        const freinds = chats.map(({members})=>{
            const othremember = getothermembers(members,req.user.id);
            console.log("other members",othremember);
            return {
                _id:othremember._id,
                image:othremember.image,
                Name:othremember.Name
            }
     })

     return res.status(200).json({
        succsess:true,
        message:"Freinds fetched succsessfully",
        freinds:freinds
     })
    } catch (error) {
        console.log("error while freinds fetching",error);
        return res.status(500).json({
            succsess:false,
            message:"Internal server error"
        })
    }
}


exports.isuserrequested = async(req,res)=>{
    try {

        const {userid} = req.body;

        const result = await Request.find({sender:req.user.id,receiver:userid});

        if(!result)
        {
            return res.status(200).json({
                succsess:true,
                requested:false
            })
        }

        return res.status(200).json({
            succsess:true,
            requested:true
        })
        
    } catch (error) {
        console.log("error while checking request",error);
        return res.status(500).json({
            succsess:false,
            message:"internal server error"
        })
    }
}
