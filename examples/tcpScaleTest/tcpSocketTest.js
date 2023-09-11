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
        for (let i = 0; i < (dataLen/4); i++) {
          console.log("int %d: %d", i, sensorData.readInt32LE(i*4));  //need a bye offset of 4 for ints
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