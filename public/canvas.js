let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseDown = false;

let pencilColor = document.querySelectorAll(".pen-col");
let pencilWidthElem = document.querySelector(".pen-width");
let eraserWidthElem = document.querySelector(".erase-width");
let download = document.querySelector(".downl");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");
let penColor = "black";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoredotracker = [];
let track = 0;

//api
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

//mousedown
canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  let data= {
    x: e.clientX,
    y: e.clientY
  }
  //send data to server
  socket.emit("beginPath",data);
})
canvas.addEventListener("mousemove", (e) => {
  if (mouseDown){
    let data={
      x: e.clientX,
      y: e.clientY,
    color: eraseflag ? eraserColor : penColor,
    width: eraseflag ? eraserWidth : penWidth
    }
    socket.emit("drawStroke",data)
  }
})
canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;

  let url = canvas.toDataURL();
  undoredotracker.push(url);
  track = undoredotracker.length - 1;
})

undo.addEventListener("click", (e) => {
  if (track > 0) track--;
  let data = {
    trackValue: track,
    undoredotracker,
  }
  socket.emit("redoundo",data);
})
redo.addEventListener("click", (e) => {
  if (track < undoredotracker.length - 1) track++;
  let data = {
    trackValue: track,
    undoredotracker,
  }
  socket.emit("redoundo",data);
})

function undoredocanvas(trackObj) {
  track = trackObj.trackValue;
  undoredotracker = trackObj.undoredotracker;

  let url = undoredotracker[track];
  let img = new Image(); //refer. of new image
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}
function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilColor.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];
    penColor = color;
    tool.strokeStyle = penColor;
  })
})
pencilWidthElem.addEventListener("change", (e) => {
  penWidth = pencilWidthElem.value;
  tool.lineWidth = penWidth;
})
eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
})
eraser.addEventListener("click", (e) => {
  if (eraseflag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
})
download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "openBoard.jpg";
  a.click();
})
socket.on("beginPath",(data) => {
  //data from server
  beginPath(data);
})
socket.on("drawStroke",(data) => {  //for draw stroke
  drawStroke(data);
})
socket.on("redoundo", (data) =>{
  undoredocanvas(data);
})