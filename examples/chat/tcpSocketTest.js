import net, { SocketAddress } from "net"

let cmd = "str";

const server = net.createServer(
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

server.maxConnections = 2
server.listen(12819)
// server.close();   //closes the server and ends the script






