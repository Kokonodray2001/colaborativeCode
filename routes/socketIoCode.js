require('dotenv').config();
const mongoose = require('mongoose');
const {instrument} =  require('@socket.io/admin-ui');
var express =  require('express');
const { Socket } = require('socket.io');
const { config } = require('dotenv');
var router =  express.Router();
var userModel =  require('../model/userModel');



var io =  require('socket.io')(3000,{
    cors :{
        origin :['https://admin.socket.io' , 'http://localhost:5000'],
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Credentials"],
        credentials: true
    }   
    
});

//connect to mongo
mongoose.connect(process.env.Uri,{useNewUrlParser :  true},mongoose.set('strictQuery',true)).then(()=>console.log("Connected Mongo")).catch(err=>console.log(err));


//connection to socket
io.on('connection',(socket)=>{ //  socket is the client and io is the server
    
    console.log("connected");
    //listening to the client event

    socket.on('join-room',(roomId,userName)=>{
        socket.join(roomId); // first the user should join the room so that it also recive teh io emit
        const newRoomuser  = new userModel({name :  userName , roomId : roomId});
        newRoomuser.save().then(()=>console.log("saved")).catch(err=>console.log(err));
       
        io.to(roomId).emit('add-user',userName);
    })  

   //sending message
    socket.on('send-message',(roomId,message)=>{ //  recive from the client 
        //io.emit('recived-message',"broadcasted") // io.emit send the message to all the socket connect to the server
        // if(roomID == ''){
        //     socket.broadcast.emit('recived-message',message)
        // }
        // else
            socket.to(roomId).emit('recived-message',message); //  emiting the message to all the room members
        //socket.broadcast.emit('recived-message',"recived from socket id " + socket.id);//to broadcast message to all the connected socket from the given socket
        
    })

    //disconnect
    socket.on('userDisconnect',async (roomId,userName)=>{
        console.log('disconnecting');
        try {
            await userModel.deleteOne({ roomId :roomId ,name: userName});
            console.log('deleted '+ userName);
            const user = await userModel.find({roomId : roomId});
            socket.to(roomId).emit('remove-user',user);    
        } catch (error) {
            console.log(error);
        }
       

    })

})

instrument(io, {
    auth: false,
    mode: "development",
  });

router.post('/',async (req,res)=>{
    try {      
        var roomID = req.body.enterRoomId;
        var uName = req.body.enterUserName; 
        const currentUser = await userModel.find({roomId : roomID});
         console.log(currentUser.length)
        if(currentUser.length == 0 )
            currentUser.push({name : ''});
        res.render('editorView',{users : currentUser,roomId : roomID,userName :uName});
        
    } catch (error) {
        res.status(500).send(error);
    }
    
   
});
//instrument(io,{auth :false});

module.exports = router;

