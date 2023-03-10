const {instrument} =  require('@socket.io/admin-ui');
var express =  require('express');
const { Socket } = require('socket.io');
var router =  express.Router();
var io =  require('socket.io')(3000,{
    cors :{
        origin :['https://admin.socket.io' , 'http://localhost:5000'],
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Credentials"],
        credentials: true
    }   
    
});
//connection to socket
io.on('connection',(socket)=>{ //  socket is the client and io is the server
    
    console.log("connected");
    //listening to the client event
    socket.on('send-message',(message,room)=>{ //  recive from the client 
        //io.emit('recived-message',"broadcasted") // io.emit send the message to all the socket connect to the server
        if(room == ''){
            socket.broadcast.emit('recived-message',message)
        }
        else
            socket.to(room).emit('recived-message',message); //  emiting the message to all the room members
        //socket.broadcast.emit('recived-message',"recived from socket id " + socket.id);//to broadcast message to all the connected socket from the given socket
        
    })
    socket.on('join-room',(room,userName)=>{
        socket.join(room); // first the user should join the room so that it also recive teh io emit
        io.to(room).emit('add-user',userName);
    })  
   

})

instrument(io, {
    auth: false,
    mode: "development",
  });

router.get('/',(req,res)=>{
    res.render('editorView');
   
});
//instrument(io,{auth :false});

module.exports = router;

