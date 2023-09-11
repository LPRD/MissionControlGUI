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


let totalWeight = 0; 
let displayData = false;

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

let numUsers = 0;

io.on('connection', (socket) => { //only occurs once per client
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // console.log(data);
    if (data == "How you feeling?") {
      displayData = true;
    }
    if (data == "stop") {
      displayData = false;
    }

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
    socket.userNum = numUsers;
  
    if (socket.userNum == 2) {
      // let msgToSend = "initializing user 2";
      // socket.broadcast.emit('new message', {
      //   username: socket.username,
      //   message: msgToSend
      // });
      setInterval(printData, 1000, socket); //pass in client 2
      // clearInterval(printData);
    }

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


function printData(socket) {  //socket for client 2 passed in
  if(displayData){
    // let msgToSend = "Hi";
    let textStart = "I feel like someone is putting ";
    let textEnd = " g on me.";
    let msgToSend = textStart.concat(totalWeight.toString(), textEnd);
    // let msgToSend = totalWeight.toString();
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: msgToSend
    });
  }
}








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
    const buffLen = buffer.byteLength;
    console.log("data: (%d Bytes)\n", buffLen, buffer)

    const commandLen = 16;
    let command = Buffer.alloc(commandLen); //16 bytes for the command string
    buffer.copy(command, 0, 0, commandLen);
    let cmdStr = command.toString("utf-8");
    // console.log(cmdStr, "<---- cmd");
    
    let lines = cmdStr.split(":");
    let cmd1 = lines[0];
    let cmd2 = lines[1];
    console.log("cmd1 is", cmd1, ",cmd2 is", cmd2);
    let numLines = lines.length;

    if (cmd1 == "data") {
      const dataLen = buffLen - commandLen;

      let sensorData = Buffer.alloc(dataLen);
      //the sensorData could be a bunch of 8-bit ints, so this is ok
      buffer.copy(sensorData, 0, commandLen, buffLen);
      // sensorData.set(buffer.subarray(commandLen, buffLen), 0);  //equivalent initialization

      if (cmd2 == "int32") {
        if ((dataLen % 4) != 0) {
          throw new Error('data length must be 4 byte aligned!');
        }
        totalWeight = 0;  //reset totalWeight
        for (let i = 0; i < (dataLen/4); i++) {
          let weight = sensorData.readInt32LE(i*4);
          console.log("int %d: %d", i, weight);  //need a bye offset of 4 for ints
          totalWeight += weight;
        }
        socket.write(sensorData); //could write buffer back if the C++ side expects a DataPacket class object
      }
      else if (cmd2 == "float") {
        if ((dataLen % 4) != 0) {
          throw new Error('data length must be 4 byte aligned!');
        }
        for (let i = 0; i < (dataLen/4); i++) {
          console.log("float %d: %f", i, sensorData.readFloatLE(i*4));  //need a bye offset of 4 for ints
        }
        socket.write(sensorData);
      }
      else if (cmd2 == "double") {
        if ((dataLen % 8) != 0) {
          throw new Error('data length must be 8 byte aligned!');
        }
        for (let i = 0; i < (dataLen/8); i++) {
          console.log("double %d: %lf", i, sensorData.readDoubleLE(i*8));  //need a bye offset of 4 for ints
        }
        socket.write(sensorData);
      }
    }

  })
  socket.on("end", () => {
    console.log("Closed", socket.remoteAddress, "port", socket.remotePort)
  })
})

netServer.maxConnections = 2
netServer.listen(12819)
// netServer.close();   //closes the server and ends the script




