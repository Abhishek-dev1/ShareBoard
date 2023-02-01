//accessing libraries
const express = require("express");
const socket = require("socket.io");

//intialised and server ready
const app = express();

app.use(express.static("public")); //to get html path

let port=process.env.PORT || 5000;
let server=app.listen(port,() => {
    console.log("Listening " + port);
})
//connecting to server
let io =socket(server);

io.on("connection", (socket) => {
    console.log("socket connection has made");

    socket.on("beginPath",(data) => {         //get triggered with beginPath as in canvas file data from frontend
        //transfering to all othe clients
        io.sockets.emit("beginPath",data);
    })
    socket.on("drawStroke",(data) => {
        io.sockets.emit("drawStroke", data);
    })
    socket.on("redoundo",(data) =>{
        io.sockets.emit("redoundo",data);
    })
}) //on is same as addEventlistner



