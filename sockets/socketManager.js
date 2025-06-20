const { Server } = require("socket.io");


let io;
const onlineUsers = new Map();


function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // You can listen to custom events here
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = { initializeSocket, io, onlineUsers };






























 //Start recording - prepare temp file
    //  socket.on("start-recording", () => {
    //   const fileId = uuidv4();
    //   tempFilePath = path.join(__dirname, `../temp/${fileId}.wav`);
    //   writeStream = fs.createWriteStream(tempFilePath, { flags: 'a' });

    //   activeStreams.set(socket.id, { tempFilePath, writeStream });
    // });
       
      
    
    // //Stream audio chunks
    //  socket.on("audio-chunk", (chunk) => {
    //   const streamObj = activeStreams.get(socket.id);
    //   if (streamObj && streamObj.writeStream) {
    //     streamObj.writeStream.write(Buffer.from(chunk));
    //   }
    // });


    
    // // Stop recording - finalize file and send to FastAPI
    // socket.on("stop-recording", async ({ userId }) => {
    //   const streamObj = activeStreams.get(socket.id);
    //   if (streamObj && streamObj.writeStream) {
    //     streamObj.writeStream.end();
    
    //     streamObj.writeStream.on("finish", async () => {
    //       try {
    //         console.log("Sending file:", streamObj.tempFilePath);
    //         // const formData = new FormData();
    //         // formData.append("file", fs.createReadStream(streamObj.tempFilePath));

    //         formData.append("file", fs.createReadStream(streamObj.tempFilePath), {
    //           filename: path.basename(streamObj.tempFilePath),
    //           contentType: 'audio/wav' // optional but recommended
    //         });
    
    //         const response = await axios.post("http://127.0.0.1:8000/predict/", formData, {
    //           headers: formData.getHeaders()
    //         });
    
    //         const { prediction, suggestion } = response.data;
    
    //         const userSocketId = onlineUsers.get(userId);
    //         if (userSocketId) {
    //           io.to(userSocketId).emit("analysis-result", {
    //             prediction,
    //             suggestion
    //           });
    //         }
    
    //         fs.unlink(streamObj.tempFilePath, () => {});
    //       } catch (error) {
    //         console.error("Prediction error:", error.message);
    //         const userSocketId = onlineUsers.get(userId);
    //         if (userSocketId) {
    //           io.to(userSocketId).emit("error", {
    //             message: "Real-time prediction failed"
    //           });
    //         }
    //       }
    //     });
    
    //     activeStreams.delete(socket.id);
    //   }
    // });

