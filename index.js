
const express = require("express");
const router = require("./Routes/User");
const chatrouter = require("./Routes/Chat");
const app = express();
const cors = require("cors");
const dbconnect = require("./config/databaseconnection");
const cookieParser = require("cookie-parser");
const connectcloudinary = require("./config/Cloudinary");
const fileupload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const Message = require("./Models/Message");

const {createServer} = require("http");
const {Server} = require("socket.io");


const {usermap}  =require("./Utils/getSockets");

const {getSockets} = require("./Utils/getSockets")

const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

require("dotenv").config();
const port = process.env.PORT;

io.use((socket,next)=>{
    const token = socket.handshake.auth.token;
    try {
        
        const decode = jwt.verify(token,process.env.JWTSECRET);
        //console.log("decode",decode);
        socket.user = decode;
        next();

    } catch (error) {
        next(new Error('Authentication error'));
    }
})


io.on("connection",(socket)=>{

    const user = socket.user;
    usermap.set(user.id,socket.id);
   // console.log("usrmap in socket on",usermap);
    //console.log("user",user);
    // console.log(`connection established ${socket.id}`);

    socket.on('disconnect',()=>{
        console.log("a user disconnected");
    })

    socket.on('NEW_MESSAGE',async({chatid,members,message})=>{
        console.log("Data from new message",{chatid,members,message});
        const socketMembers = getSockets(members);
        console.log("socketmemebers",socketMembers);
        try {
            
            const messageindb = await Message.create({content:message,sender:user.id,chat:chatid,});
            console.log("message in db",messageindb);
        } catch (error) {
            console.log("error while message storing in db");
        }
        io.to(socketMembers).emit('NEW_MESSAGE',{
            chatid,
            sender:{
                _id:user.id,
                Name:user.Name
            },
            content:message
            
        });
    })

    socket.on('ALERT',(data)=>{
        console.log("data from alert",data);
    })

    
})

app.use(cors({
    origin:"*",
    credentials:true,
}));

app.get("/",(req,res)=>{
    res.send("connected");
})

app.use(express.json());
app.use(cookieParser());
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp",
}));
dbconnect();
connectcloudinary();

app.use("/api/v1",router);
app.use("/api/v1/chat",chatrouter);



httpServer.listen(port,()=>{
    console.log(`app is listining on port ${port}`);
})

module.exports = usermap;