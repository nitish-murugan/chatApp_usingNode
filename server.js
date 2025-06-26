const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const PORT = 3000;

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
app.use(express.static('public'));

const Users = new Set();

io.on('connection', (socket)=>{
    console.log("An user is connected");
    socket.on('userName', (userName)=>{
        console.log(`${userName} has connected to the server`);
        Users.add(userName);
        socket.userName = userName;
        io.emit('addedUser', userName);
        io.emit('userList', Array.from(Users));
    });

    socket.on('userMessage', (message)=>{
        io.emit('userMessage', {
            userName: socket.userName,
            message: message
        });
    });

    socket.on('disconnect', ()=>{
        console.log('An user has been disconnected to the server');
        Users.forEach(user=>{
            if(user===socket.userName){
                Users.delete(user);
                io.emit('userList', Array.from(Users));
            }
        })
    })
});

httpServer.listen(PORT, ()=>{
    console.log(`Server is listening on the port ${PORT}`);
});