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


// function draw() {
//     switch (currentTool) {

//         case "brush":
//             const vContext = app.visibleCanvas.getContext("2d");
//             vContext.drawImage(app.offscreenCanvas, 0, 0);
//             break;
//         case "line":
//             app.grayscale();
//             break;
//         case "square":
//             app.threshold();
//             break;
//         case "circle":
//             app.sephia();
//             break;
//         case "triangle":
//             app.sephia();
//             break;

//     }

// }


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

});

//buton de refresh care va curata ce este desenat pe canvas
var btnRefresh = document.getElementById("refresh");
btnRefresh.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColour;
    context.fillRect(0, 0, canvas.width, canvas.height);
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

//desenare cu brush
var btnBrush = document.getElementById("brush");
btnBrush.addEventListener("click", () => {

    document.addEventListener('mousedown', startPainting);
    document.addEventListener('mouseup', stopPainting);
    document.addEventListener('mousemove', sketch);

    var coordonate = { x: 0, y: 0 }; //pozitia initiala a cursorului
    var nowPainting = false; //flag pentru a declansa desenarea

    //preia pozitia cursorului atunci cand un eveniment este declansat la acele coordonate
    function getPosition(ev) {
        coordonate.x = ev.clientX - canvas.offsetLeft;
        coordonate.y = ev.clientY - canvas.offsetTop;
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

})


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
