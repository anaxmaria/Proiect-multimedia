"using strict"

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var currentTool = "brush"; //brush va fi selectat by default la inceput
var defaultColour = "#000000";
var backgroundColour = "#FFFFFF";
var defaultLineWidth = 5;
var strokeColour = defaultColour;
var fillColour = defaultColour;
var canvasWidth = 900;
var canvasHeight = 500;

// function changeTool(tool) {
//     if (currentTool !== tool) {
//         currentTool = tool;
//         draw();
//     }
// }

// function draw() {
//     console.log(currentTool);
//     switch (currentTool) {
//         case "brush":
//             console.log("yo");
//             drawWithBrush();
//             break;
//         case "line":
//             drawLine();
//             console.log("pspsps");
//             break;
//         // case "square":
//         //     drawSquare();
//         //     break;
//         // case "circle":
//         //     drawCircle();
//         //     break;
//         // case "triangle":
//         //     drawTriangle();
//         //     break;

//     }

// }
var switchingTools =

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

        //drawWithBrush();
    });



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

// var btnBrush = document.getElementById("brush");
// btnBrush.addEventListener("click", () => {
//     currentTool = "brush";
// })
function drawWithBrush() {

    currentTool = "brush";
    console.log("pensula");

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



//desenare linie
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

// var btnLine = document.getElementById("line");
// btnLine.addEventListener("click", () => {
//     currentTool = "line";
// })
function drawLine() {
    console.log("linie");
    currentTool = "line";

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
}

//desenare cerc
function drawCircle() {
    console.log("cerc");

}

//desenare triunghi
function drawTriangle() {
    console.log("triunghi");

}



function clickedBrush() {
    window.addEventListener("click", drawWithBrush());

    canvas.removeEventListener("mousedown", startDrawingLine);
    canvas.removeEventListener("mousemove", dragLine);
    canvas.removeEventListener("mouseup", stopDrawingLine);
}

function clickedLine() {
    window.addEventListener("click", drawLine());

    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mousemove", sketch);
}

function clickedSquare() {
    window.addEventListener("click", drawSquare());

}

function clickedCircle() {
    window.addEventListener("click", drawCircle());

}

function clickedTriangle() {
    window.addEventListener("click", drawTriangle());

}
//-----------------------DESENARE-----------------------


//Download
var btnDownload = document.getElementById("download");
var dropDownList = document.getElementById("downloading");
btnDownload.addEventListener("click", () => {
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
