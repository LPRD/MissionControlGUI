
# Socket.IO Chat

A simple chat demo for Socket.IO

## Enviornment Setup Instructions
Go to https://github.com/nvm-sh/nvm for the latest 
Node Version Manager (NVM) installation instructions 
Install the latest version of nvm:
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

Install the latest version of nodejs:
nvm install node
(DO NOT USE apt install nodejs!!!)
("node" is an alias for the latest version)
A specific version can be installed as follows:
nvm install 20.0.0
(or 16.3.0, 12.22.1, etc. Use ls-remote to see available versions)
Verify node works by running
node --version
A recent version of npm (9.6.4) is included with node 20.0.0
The latest version can be installed with:
npm install latest-version

### If the following error occurs:
node: /lib/arm-linux-gnueabihf/libstdc++.so.6: version `GLIBCXX_3.4.26' not found (required by node)
The following file: (on Raspbian)
/usr/lib/arm-linux-gnueabihf/libstdc++.so.6
is missing GLIBCXX_3.4.26
You can verify using the following command:
strings /usr/lib/arm-linux-gnueabihf/libstdc++.so.6 | grep -i glib

To resolve the error, install gcc-9 or later:
Try updating the system to Raspbian 11 (bullseye)
This version uses GCC 10.2 by default
buster with bullseye in your /etc/apt/sources.list file and run:
apt-get update
apt-get upgrade
apt-get dist-upgrade

## How to use

socketio tutorial:
https://github.com/socketio/socket.io/tree/main/examples/chat
https://tsh.io/blog/socket-io-tutorial-real-time-communication/ 
(outdated/webpage doesn't show up correctly?)

```
$ npm i
$ npm start
```

And point your browser to `http://localhost:3000`. Optionally, specify
a port by supplying the `PORT` env variable. If trying to connect using a 
different device than the server, use `http://<ip address>:3000/`,
where "ip address" refers to the ip address of the server device. This 
ip can be obtained from the command "ip -c a"

To run just the TCP Socket Server (not the Socket.io server),
run the command:
```
$ node tcpSocketTest.js
``` 

## Features

- Multiple users can join a chat room by each entering a unique username
on website load.
- Users can type chat messages to the chat room.
- A notification is sent to all users when a user joins or leaves
the chatroom.

DEBUG=socket* node index.js