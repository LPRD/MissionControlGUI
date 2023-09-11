// Setup basic express server

// const express = require('express');
// const app = express();
// const path = require('path');
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const port = process.env.PORT || 3000;

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import path from "path" 

import express from "express"
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express(); 
const server = createServer(app); 
const io = new Server(server);

//The above changes are required if package.json contains: 
//"type": "module"

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

let numUsers = 0;

io.on('connection', (socket) => {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});



import net, { SocketAddress } from "net"

let cmd = "str";

const netServer = net.createServer(
{
  allowHalfOpen: true,
  pauseOnConnect: false
}, 
(socket) => {
  console.log("Connection from", socket.remoteAddress, "port", socket.remotePort)
  
  socket.on("data", (buffer) => {
    // console.log("Request from", socket.remoteAddress, "port", socket.remotePort)

    let buffStr = buffer.toString("utf-8");
    //the string format specifier can convert buffer to a string as well

    let buffLen = buffer.byteLength;
    console.log("data:", buffer)
    console.log("Length: %d Bytes", buffLen)
    let lines = buffStr.split(":");
    let numLines = lines.length;

    if(lines[0] == "cmd" && buffLen == 15)
    {
      if(lines[1] == "str"){
        cmd = 'str';
        console.log("cmd is now 'str'\n");
      }
      else if(lines[1] == "int32"){
        cmd = 'int32';
        console.log("cmd is now 'int32'\n");
      }
      else if(lines[1] == "float32"){
        cmd = 'float32';
        console.log("cmd is now 'float32'\n");
      }
      else{
        console.log("Invalid attempt to set cmd! lines[1] is ", lines[1]);
      }
      socket.write(`${buffer.toString("utf-8")}\n`);  //buffStr
    }
    else
    {
      if(cmd == "str"){
        console.log("str: '%s'", buffStr);
        socket.write(`${buffer.toString("utf-8")}\n`);
      }
      else if(cmd == "int32"){
        for (let i = 0; i < (buffLen/4); i++) {
          console.log("int %d: %d", i, buffer.readInt32LE(i*4));  //need a bye offset of 4 for ints
        }
        socket.write(buffer);
      }
      else if(cmd == "float32"){
        for (let i = 0; i < (buffLen/4); i++) {
          console.log("float %d: %f", i, buffer.readFloatLE(i*4));  //need a bye offset of 4 for floats
        }
        socket.write(buffer);
      }
      else{
        console.log("Invalid Command! cmd is ", cmd);
        socket.write(`${buffer.toString("utf-8")}\n`);
      }
    }

    // socket.write(`${buffer.toString("utf-8")}\n`);
    // socket.write(`${buffer.toString("utf-8").toUpperCase()}\n`)
  })
  socket.on("end", () => {
    console.log("Closed", socket.remoteAddress, "port", socket.remotePort)
  })
})

netServer.maxConnections = 2
netServer.listen(12819)
// netServer.close();   //closes the server and ends the script




