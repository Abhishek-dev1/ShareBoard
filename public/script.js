var toolsCont = document.querySelector(".tools");
var optionsCont = document.querySelector(".options");
var pencil = document.querySelector(".pentool");
var pe = document.querySelector(".penc");
var era = document.querySelector(".eras");
var stickcont = document.querySelector(".stickycont");
var sticky = document.querySelector(".sticky");
var eraser = document.querySelector(".erasetool");
var upload = document.querySelector(".upl");

var pencilflag = false;
var eraseflag = false;
var flag = true;
var stickflag = false;
optionsCont.addEventListener("click", () => {
  flag = !flag;
  if (flag) {
    openTool();
  } else {
    closeTool();
  }
})
function openTool() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "flex";
}
function closeTool() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  toolsCont.style.display = "none";
  pencil.style.display = "none";
  eraser.style.display = "none";
  stickcont.style.display = "none";
}
pe.addEventListener("click", () => {
  pencilflag = !pencilflag;
  if (pencilflag) {
    pencil.style.display = "block";
  } else {
    pencil.style.display = "none";
  }
})
era.addEventListener("click", () => {
  eraseflag = !eraseflag;
  if (eraseflag) {
    eraser.style.display = "flex";
  } else {
    eraser.style.display = "none";
  }
})
sticky.addEventListener("click", (e) => {
  let stickycontent = document.createElement("div");
  stickycontent.setAttribute("class", "stickycont");
  stickycontent.innerHTML = `
<div class="headercont">
    <div class="minimise"></div>
    <div class="remove"></div>
</div>
<div class="note">
    <textarea></textarea>
</div>
`;

  document.body.appendChild(stickycontent);
  let minimize = stickycontent.querySelector(".minimise");
  let rem = stickycontent.querySelector(".remove");
  notefunc(minimize, rem, stickycontent);
  stickycontent.onmousedown = function (event) {
    draganddrop(stickycontent, event);
  }

  stickycontent.ondragstart = function () {
    return false;
  }
})
function notefunc(minimize, remove, element) {
  remove.addEventListener("click", () => {
    element.remove();
  })
  minimize.addEventListener("click", () => {
    let notecont = element.querySelector(".note");
    let show = getComputedStyle(notecont).getPropertyValue("display");
    if (show === "none") {
      notecont.style.display = "block";
    } else notecont.style.display = "none";
  })
}
function draganddrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
upload.addEventListener("click", () => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();
  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);
    let stickycontent = document.createElement("div");
    stickycontent.setAttribute("class", "stickycont");
    stickycontent.innerHTML = `
    <div class="headercont">
        <div class="minimise"></div>
        <div class="remove"></div>
    </div>
    <div class="note">
        <img src="${url}"/>
    </div>
    `;

    document.body.appendChild(stickycontent);
    let minimize = stickycontent.querySelector(".minimise");
    let rem = stickycontent.querySelector(".remove");
    notefunc(minimize, rem, stickycontent);
    stickycontent.onmousedown = function (event) {
      draganddrop(stickycontent, event);
    }

    stickycontent.ondragstart = function () {
      return false;
    }
  })
})
