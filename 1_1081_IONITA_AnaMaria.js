"using strict"

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var currentTool = "brush"; 
var defaultColour = "#000000";
var backgroundColour = "#FFFFFF";
var defaultLineWidth = 5;
var strokeColour = defaultColour;
var fillColour = defaultColour;
var canvasWidth = 900;
var canvasHeight = 500;


window.addEventListener("load", () => {
    //culoare stroke
    var stroke = document.getElementById("stroke");
    stroke.value = defaultColour;
    stroke.addEventListener("change", (ev) => {
        strokeColour = stroke.value = ev.target.value; //retine culoarea din colour picker
    })

    //culoare fill
    var fill = document.getElementById("fill");
    fill.value = defaultColour;
    fill.addEventListener("change", (ev) => {
        fillColour = fill.value = ev.target.value;
    })

    //culoare background
    canvas.setAttribute("style", "background-color:#FFFFFF");

    var bkgColour = document.getElementById("background");
    bkgColour.addEventListener("change", (ev) => {
        backgroundColour = bkgColour.value = ev.target.value;
        //document.getElementById("canvas").style.backgroundColor = bkgColour.value;

        context.fillStyle = backgroundColour;
        context.fillRect(0, 0, canvas.width, canvas.height);
    })

    drawWithBrush();
});

var showCurrentTool = document.getElementById("currentTool");
    


//buton plus; mareste grosimea liniei
var newLineWidth = defaultLineWidth;
var btnPlus = document.getElementById("btnPlus");
btnPlus.addEventListener("click", () => {
    newLineWidth = newLineWidth + 5;
});

//buton minus; micsoreaza grosimea liniei
var btnMinus = document.getElementById("btnMinus");
btnMinus.addEventListener("click", () => {
    if (newLineWidth > 5)
        newLineWidth = newLineWidth - 5;
    else if (newLineWidth == 5)
        return;
    else if (newLineWidth < 5)
        newLineWidth = 5;
});

//buton de refresh care va curata ce este desenat pe canvas; pastreaza background-ul 
//si readuce line Width la valoarea default(5)
var btnRefresh = document.getElementById("refresh");
btnRefresh.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColour;
    context.fillRect(0, 0, canvas.width, canvas.height);

    newLineWidth = defaultLineWidth;
});

//-----------------------DESENARE-----------------------

var coordonate = { x: 0, y: 0 }; //pozitia initiala a cursorului
//var ultimeleCoord = { x: 0, y: 0 };
var nowPainting = false; //flag pentru a declansa desenarea


//desenare cu brush

function drawWithBrush() {

    currentTool = "brush";
    console.log("pensula");
    showCurrentTool.innerHTML = "Tool: brush";

    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mousemove", sketch);
}
//preia pozitia cursorului atunci cand un eveniment este declansat la acele coordonate
function getPosition(ev) {
    coordonate.x = ev.clientX - canvas.getBoundingClientRect().left;
    coordonate.y = ev.clientY - canvas.getBoundingClientRect().top;
}

//modifica flag-ul in true pentru a incepe desenarea
function startPainting(ev) {
    nowPainting = true;
    getPosition(ev);
}

//modifica flag-ul in false pentru a incepe desenarea
function stopPainting() {
    nowPainting = false;
}

function sketch(ev) {
    //se va executa doar daca flag-ul este true
    if (nowPainting == false)
        return;

    context.beginPath();
    context.lineWidth = newLineWidth;

    context.lineCap = "round";
    context.strokeStyle = strokeColour;

    //pentru a incepe desenarea cursorul de muta la aceste coordonate
    context.moveTo(coordonate.x, coordonate.y);

    //modifica pozitia cursorului in timp de miscam mouse-ul
    getPosition(ev);

    //traseaza o linie de la coordonatele initiale la aceste coordonate
    context.lineTo(coordonate.x, coordonate.y);

    //deseneaza linia
    context.stroke();
}

var dragging = false;
var startLoc;
var line;

function lineCoord(ev) {
    var x = ev.clientX - canvas.getBoundingClientRect().left;
    var y = ev.clientY - canvas.getBoundingClientRect().top;
    return { x: x, y: y };
}
function lineSnap() {
    line = context.getImageData(0, 0, canvas.width, canvas.height); //top left x, top left y, width, height
}
function makeTheLine() {
    context.putImageData(line, 0, 0); //obiectul ImageData, coordonata x, coordonata y
}

//desenare linie

// var btnLine = document.getElementById("line");
// btnLine.addEventListener("click", () => {
//     currentTool = "line";
// })
function drawLine() {
    console.log("linie");
    currentTool = "line";
    showCurrentTool.innerHTML = "Tool: line";

    canvas.addEventListener("mousedown", startDrawingLine);
    canvas.addEventListener("mousemove", dragLine);
    canvas.addEventListener("mouseup", stopDrawingLine);
}

function startDrawingLine(ev) {
    // context.strokeStyle = strokeColour;
    // context.lineWidth = newLineWidth;
    dragging = true;
    startLoc = lineCoord(ev);
    lineSnap();
}

function dragLine(ev) {
    var pos;
    if (dragging == true) {
        makeTheLine();
        pos = lineCoord(ev);
        doLine(pos);
    }
}

function stopDrawingLine(ev) {
    dragging = false;
    makeTheLine();
    var pos;
    pos = lineCoord(ev);
    doLine(pos);
}

function doLine(position) {
    context.lineCap = "round";
    context.lineWidth = newLineWidth;
    context.strokeStyle = strokeColour;

    context.beginPath();
    context.moveTo(startLoc.x, startLoc.y);
    context.lineTo(position.x, position.y);
    context.stroke();
}

//desenare patrat
function drawSquare() {
    console.log("patrat");
    currentTool = "square";
    showCurrentTool.innerHTML = "Tool: square";

    canvas.addEventListener("mousedown", startDrawingSquare);
    canvas.addEventListener("mousemove", dragSquare);
    canvas.addEventListener("mouseup", stopDrawingSquare);
}

function startDrawingSquare(ev) {
    dragging = true;
    startLoc = lineCoord(ev);
    lineSnap();
}

function dragSquare(ev) {
    var pos;
    if (dragging == true) {
        makeTheLine();
        pos = lineCoord(ev);
        square(pos);
    }
}

function stopDrawingSquare(ev) {
    dragging = false;
    makeTheLine();
    var pos;
    pos = lineCoord(ev);
    square(pos);
}

function square(position) {
    context.strokeStyle = strokeColour;
    context.lineWidth = newLineWidth;
    context.fillStyle = fillColour;

    context.beginPath();
    context.rect(startLoc.x, startLoc.y, lineCoord(event).x, lineCoord(event).y);
    context.stroke();
    context.fill();
}

//desenare cerc
function drawCircle() {
    console.log("cerc");
    currentTool = "circle";
    showCurrentTool.innerHTML = "Tool: circle";

    canvas.addEventListener("mousedown", startDrawingCircle);
    canvas.addEventListener("mousemove", dragCircle);
    canvas.addEventListener("mouseup", stopDrawingCircle);
}

function startDrawingCircle(ev) {
    dragging = true;
    startLoc = lineCoord(ev);
    lineSnap();
}

function dragCircle(ev) {
    var pos;
    if (dragging == true) {
        makeTheLine();
        pos = lineCoord(ev);
        circle(pos);
    }
}

function stopDrawingCircle(ev) {
    dragging = false;
    makeTheLine();
    var pos;
    pos = lineCoord(ev);
    circle(pos);
}

function circle(position) {
    var radius;
    radius = Math.sqrt(Math.pow((startLoc.x - position.x), 2) + Math.pow((startLoc.y - position.y), 2)); //functia Math.pow da baza si exponentul unei puteri

    context.strokeStyle = strokeColour;
    context.lineWidth = newLineWidth;
    context.fillStyle = fillColour;
    context.beginPath();
    context.arc(startLoc.x, startLoc.y, radius, 0,2*Math.PI, false); //coord x a centrului, coord y a cercului, raza, starting angle, ending angle, counterclockwise
    context.stroke();
    context.fill();
}

//desenare triunghi
function drawTriangle() {
    console.log("triunghi");
    currentTool = "triangle";
    showCurrentTool.innerHTML = "Tool: triangle";

    canvas.addEventListener("mousedown", startDrawingTriangle);
    canvas.addEventListener("mousemove", dragTriangle);
    canvas.addEventListener("mouseup", stopDrawingTriangle);
}

function startDrawingTriangle(ev) {
    dragging = true;
    startLoc = lineCoord(ev);
    lineSnap();
}

function dragTriangle(ev){
    var pos;
    if(dragging == true){
        makeTheLine();
        pos = lineCoord(ev);
        triangle(pos);
    }
}

function stopDrawingTriangle(ev){
    dragging = false;
    makeTheLine();
    var pos = lineCoord(ev);
    triangle(pos);
}

function triangle(position){
    context.strokeStyle = strokeColour;
    context.lineWidth = newLineWidth;
    context.fillStyle = fillColour;
    context.beginPath();
    context.moveTo(startLoc.x, startLoc.y);
    context.lineTo(startLoc.x,lineCoord(event).y);
    context.lineTo(lineCoord(event).x,startLoc.y);
    context.closePath();
    context.stroke();
    context.fill();
}



function clickedBrush() {
    window.addEventListener("click", drawWithBrush());

    canvas.removeEventListener("mousedown", startDrawingLine);
    canvas.removeEventListener("mousemove", dragLine);
    canvas.removeEventListener("mouseup", stopDrawingLine);

    canvas.removeEventListener("mousedown", startDrawingSquare);
    canvas.removeEventListener("mousemove", dragSquare);
    canvas.removeEventListener("mouseup", stopDrawingSquare);

    canvas.removeEventListener("mousedown", startDrawingCircle);
    canvas.removeEventListener("mousemove", dragCircle);
    canvas.removeEventListener("mouseup", stopDrawingCircle);

    canvas.removeEventListener("mousedown", startDrawingTriangle);
    canvas.removeEventListener("mousemove", dragTriangle);
    canvas.removeEventListener("mouseup", stopDrawingTriangle);
}

function clickedLine() {
    window.addEventListener("click", drawLine());

    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mousemove", sketch);

    canvas.removeEventListener("mousedown", startDrawingSquare);
    canvas.removeEventListener("mousemove", dragSquare);
    canvas.removeEventListener("mouseup", stopDrawingSquare);

    canvas.removeEventListener("mousedown", startDrawingCircle);
    canvas.removeEventListener("mousemove", dragCircle);
    canvas.removeEventListener("mouseup", stopDrawingCircle);

    canvas.removeEventListener("mousedown", startDrawingTriangle);
    canvas.removeEventListener("mousemove", dragTriangle);
    canvas.removeEventListener("mouseup", stopDrawingTriangle);
}

function clickedSquare() {
    window.addEventListener("click", drawSquare());

    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mousemove", sketch);

    canvas.removeEventListener("mousedown", startDrawingLine);
    canvas.removeEventListener("mousemove", dragLine);
    canvas.removeEventListener("mouseup", stopDrawingLine);

    canvas.removeEventListener("mousedown", startDrawingCircle);
    canvas.removeEventListener("mousemove", dragCircle);
    canvas.removeEventListener("mouseup", stopDrawingCircle);

    canvas.removeEventListener("mousedown", startDrawingTriangle);
    canvas.removeEventListener("mousemove", dragTriangle);
    canvas.removeEventListener("mouseup", stopDrawingTriangle);
}

function clickedCircle() {
    window.addEventListener("click", drawCircle());

    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mousemove", sketch);

    canvas.removeEventListener("mousedown", startDrawingLine);
    canvas.removeEventListener("mousemove", dragLine);
    canvas.removeEventListener("mouseup", stopDrawingLine);

    canvas.removeEventListener("mousedown", startDrawingSquare);
    canvas.removeEventListener("mousemove", dragSquare);
    canvas.removeEventListener("mouseup", stopDrawingSquare);

    canvas.removeEventListener("mousedown", startDrawingTriangle);
    canvas.removeEventListener("mousemove", dragTriangle);
    canvas.removeEventListener("mouseup", stopDrawingTriangle);
}

function clickedTriangle() {
    window.addEventListener("click", drawTriangle());

    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mousemove", sketch);

    canvas.removeEventListener("mousedown", startDrawingLine);
    canvas.removeEventListener("mousemove", dragLine);
    canvas.removeEventListener("mouseup", stopDrawingLine);

    canvas.removeEventListener("mousedown", startDrawingSquare);
    canvas.removeEventListener("mousemove", dragSquare);
    canvas.removeEventListener("mouseup", stopDrawingSquare);

    canvas.removeEventListener("mousedown", startDrawingCircle);
    canvas.removeEventListener("mousemove", dragCircle);
    canvas.removeEventListener("mouseup", stopDrawingCircle);
}
//-----------------------DESENARE-----------------------


//Download
var btnDownload = document.getElementById("download");
var dropDownList = document.getElementById("downloading");
btnDownload.addEventListener("click", () => {
    if (dropDownList.value == "choose") {
        alert("Alegeti modalitatea de download.");
    }

    if (dropDownList.value == "jpg") {
        btnDownload.href = canvas.toDataURL();
        btnDownload.download = "myDrawing.jpeg";
    }

    if (dropDownList.value == "png") {
        var dataURL = canvas.toDataURL("image/png");
        btnDownload.href = dataURL;
    }

    if (dropDownList.value == "bmp") {
        btnDownload.href = canvas.toDataURL();
        btnDownload.download = "myDrawing.bmp";
    }

    if (dropDownList.value == "gif") {
        btnDownload.href = canvas.toDataURL();
        btnDownload.download = "myDrawing.gif";
    }

    if (dropDownList.value == "svg") {
        // var dataURL = canvas.toDataURL("image/svg+xml");
        // btnDownload.href = dataURL;
        btnDownload.href = canvas.toDataURL("image/svg+xml");
        btnDownload.download = "myDrawing.svg";
    }
});
