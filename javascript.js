let gridContainer = document.querySelector("#gridContainer");
let paintStyleButtons = document.querySelectorAll("#paintStyleSelection button");
let colorStyleButtons = document.querySelectorAll("#colorStyleSelection button");
let backgroundSelectionButtons = document.querySelectorAll("#backgroundSelection button");
let colorPicker = document.querySelector("#colorPicker");
let clearGridButton = document.querySelector("#clearGridSection button");
let slider = document.querySelector("#boxCountSlider")
let boxCountText = document.querySelector(".boxCount");

let gridDimens = slider.value;
let selectedPaintStyle = getPaintStyleSelection();
let selectedColorStyle = getColorStyleSelection();

createSketchGrid();

// listener to detect when the slider is changing, and recreate
// the grid when it does
slider.addEventListener("input", (e) => {
    gridDimens = slider.value;
    createSketchGrid();
});

// sets new value for selectedPaintStyle and reapplies box listeners
paintStyleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        let currentSelected = document.querySelector("#paintStyleSelection .selected");
        currentSelected.classList.toggle("selected");

        let newSelected = e.target;
        newSelected.classList.toggle("selected");

        selectedPaintStyle = getPaintStyleSelection();
        setBoxListeners();
    });
})

// sets new value for selectedColorStyle
colorStyleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        let currentSelected = document.querySelector("#colorStyleSelection .selected");
        currentSelected.classList.toggle("selected");

        let newSelected = e.target;
        newSelected.classList.toggle("selected");

        selectedColorStyle = getColorStyleSelection();
    });
})

// take in the selected dimensions, making a dimen x dimen grid
// of boxes to be color using your mouse
function createSketchGrid() {
    // delete current rows before creating more if they exist
    if (document.querySelector(".flexRow")) {
        while (gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.firstChild);
        }
    }

    let row = document.createElement("div");
    row.className = "flexRow";

    let box = document.createElement("div");
    box.className = "flexRowItem";

    // append boxes into the rows
    for (let i = 0; i < gridDimens; i++) {
        row.appendChild(box.cloneNode(true));
    }

    // append row to gridContainer dimens amount of times
    for (let i = 0; i < gridDimens; i++) {
        gridContainer.appendChild(row.cloneNode(true));
    }

    setBoxListeners();
    setGridSizeText();

}

// set the background color of a box to the selectedColor
function setBackgroundColor(box) {
    if (selectedColorStyle === "black") {
        box.style.backgroundColor = "rgb(0, 0, 0)";
    } else if (selectedColorStyle === "rainbow") {
        box.style.backgroundColor = generateRandomColor();
    } else if (selectedColorStyle === "shader") {
        box.style.backgroundColor = darkenColor(box);
    } else if (selectedColorStyle === "pick your color") {
        box.style.backgroundColor = colorPicker.value;
    } else if (selectedColorStyle === "eraser") {
        box.style.backgroundColor = "rgb(255, 255, 255)";
    }

}

// adds listeners to each box, depending on which
// style is selected
function setBoxListeners() {
    let boxes = getBoxesVariable();

    // removes listeners in case one was already selected(for switching styles)
    removeMouseOverListener(boxes);
    removeGridMouseLeaveListener();
    removeClickHoldListener(boxes);
    removeMouseUpEvent(boxes);

    if (selectedPaintStyle === "mouse over") {
        setMouseOverListener(boxes);
    } else if (selectedPaintStyle === "click & hold") {
        setClickHoldListener(boxes);
    }

}

// set the listeners for each box for when "mouse over" is selected
function setMouseOverListener(boxes) {
    boxes.forEach((box) => {
        box.addEventListener("mouseenter", setMouseEnterEvent);
    });
}

// sets event listeners for mouse enter event
function setMouseEnterEvent(e) {
    setBackgroundColor(e.target);
}

// add event listeners for each box for when "click & hold" is selected
// will listen for a mouse down, then call to mouseDownEvents()
function setClickHoldListener(boxes) {
    boxes.forEach((box) => {
        box.addEventListener("mousedown", mouseDownEvents);
    });
}

function removeClickHoldListener(boxes) {
    boxes.forEach((box) => {
        box.removeEventListener("mousedown", mouseDownEvents);
    });
}

// triggers all of the events to occur to start click and drag
// drawing
function mouseDownEvents(e) {
    let boxes = getBoxesVariable();

    setBackgroundColor(e.target);

    setMouseOverListener(boxes);
    setMouseUpEvent(boxes);
    setGridMouseLeaveListener();
}

// listens for mouse up event on each box to know when to cancel
// click and drag drawing
function setMouseUpEvent(boxes) {
    boxes.forEach((box) => {
        box.addEventListener("mouseup", mouseUpEvent);
    });
}

function removeMouseUpEvent(boxes) {
    boxes.forEach((box) => {
        box.removeEventListener("mouseup", mouseUpEvent);
    })
}

function mouseUpEvent() {
    let boxes = getBoxesVariable();
    removeMouseOverListener(boxes);
    removeGridMouseLeaveListener();
}

// removes mouseenter event on all of the boxes, and
// calls to remove the listener on the gridContainer
function removeMouseOverListener(boxes) {
    boxes.forEach((box) => {
        box.removeEventListener("mouseenter", setMouseEnterEvent);
    });
}

// set listener on the grid for when click and drag draw is
// enabled to prevent drawing if the click is still held
// while leaving the whole container
function setGridMouseLeaveListener() {
    gridContainer.addEventListener("mouseleave", mouseLeaveGridEvent);
}

// remove grid listener after click and drag is done
function removeGridMouseLeaveListener() {
    gridContainer.removeEventListener("mouseleave", mouseLeaveGridEvent);
}

function mouseLeaveGridEvent(e) {
    let boxes = getBoxesVariable();
    removeMouseOverListener(boxes);
}

// generates a random color and returns it as a string
// to be used in setBackgroundColor()
function generateRandomColor() {
    let r = generateRandomRGBValue();
    let g = generateRandomRGBValue();
    let b = generateRandomRGBValue();
    
    let color = `rgb(${r}, ${g}, ${b})`;

    return color;
}

function generateRandomRGBValue() {
    return Math.floor(Math.random() * 256);
}

function darkenColor(box) {
    let colors = parseRGBString(getComputedStyle(box).backgroundColor);
    let R = colors[0] - 26;
    let G = colors[1] - 26;
    let B = colors [2] - 26;

    if (R < 0) R = 0;
    if (G < 0) G = 0;
    if (B < 0) B = 0;

    return `rgb(${R}, ${G}, ${B})`;
}

// parse through an rgb string using a RegExp and return an array of the values
function parseRGBString(rgbString) {
    let match = /\d+/g;
    return rgbString.match(match);
}

// sets the text to show the user the size of the grid
function setGridSizeText() {
    boxCountText.textContent = `Grid Size: ${gridDimens} x ${gridDimens}`;
}

function getBoxesVariable() {
    return document.querySelectorAll(".flexRowItem");
}

// get the value of the currently selected value in paintStyleSelection
function getPaintStyleSelection() {
    let selection = document.querySelector("#paintStyleSelection .selected");
    return selection.textContent.toLowerCase();
}

// get the value of the current selection in colorStyleSelection
function getColorStyleSelection() {
    let selection = document.querySelector("#colorStyleSelection .selected");
    return selection.textContent.toLowerCase();
}

