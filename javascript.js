let gridContainer = document.querySelector("#gridContainer");
let paintStyleButtons = document.querySelectorAll("#paintStyleSelection button");
let colorStyleButtons = document.querySelectorAll("#colorStyleSelection button");
let backgroundSelectionButtons = document.querySelectorAll("#backgroundSelection button");
let clearGridButton = document.querySelector("#clearGridSection button");
let slider = document.querySelector("#boxCountSlider")
let boxCountText = document.querySelector(".boxCount");

let gridDimens = slider.value;
let selectedPaintStyle = getPaintStyleSelection();
let selectedColor = getColorStyleSelection();

createSketchGrid();

// listener to detect when the slider is changing, and recreate
// the grid when it does
slider.addEventListener("input", (e) => {
    gridDimens = slider.value;
    createSketchGrid();
});

// listen for paint style buttons to be click and toggles the
// selected class if it doesn't already have it.
// sets new value for selectedPaintStyle and reapplies box listeners
paintStyleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        let currentSelected = document.querySelector(".selected");
        currentSelected.classList.toggle("selected");
        
        let newSelected = e.target;
        newSelected.classList.toggle("selected");

        selectedPaintStyle = getPaintStyleSelection();
        setBoxListeners();
    });
})

// take in the selected dimensions, making a dimen x dimen grid
// of boxes to be color using your mouse
function createSketchGrid() {
    // delete current rows before creating more if they exist
    if(document.querySelector(".flexRow")) {
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
    if (selectedColor === "black") {
        box.style.backgroundColor = "black";
    } else if (selectedColor === "rainbow") {
        box.style.backgroundColor = generateRandomColor();
    }
    
}

// adds listeners to each box, depending on which
// style is selected
function setBoxListeners() {
    let boxes = document.querySelectorAll(".flexRowItem");

    // removes listeners in case one was already selected(for switching styles)
    removeMouseOverListener(boxes);

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
// will listen for a mouse down, then mouseenter until mouse up
function setClickHoldListener(boxes) {
    boxes.forEach((box) => {
        box.addEventListener("mousedown", (e) => {
            setBackgroundColor(e.target);

            setMouseOverListener(boxes);
            setMouseUpEvent(boxes);
            setGridMouseLeaveListener(boxes);
        });
    });
}

// listens for mouse up event on each box to know when to cancel
// click and drag drawing
function setMouseUpEvent(boxes) {
    boxes.forEach((box) => {
        box.addEventListener("mouseup", () => {
            removeMouseOverListener(boxes);
        });
    });
}

// removes mouseenter event on all of the boxes, and
// calls to remove the listener on the gridContainer
function removeMouseOverListener(boxes) {
    boxes.forEach((box) => {
        box.removeEventListener("mouseenter", setMouseEnterEvent);
    });
    removeGridMouseLeaveListener(boxes);
}

// set listener on the grid for when click and drag draw is
// enabled to prevent drawing if the click is still held
// while leaving the whole container
function setGridMouseLeaveListener(boxes) {
    gridContainer.addEventListener("mouseleave", () => {
        removeMouseOverListener(boxes);
    });
}

// remove grid listener after click and drag is done
function removeGridMouseLeaveListener(boxes) {
    gridContainer.removeEventListener("mouseleave", () => {
        removeMouseOverListener(boxes);
    });
}

// generates a random color and returns it as a string
// to be used in setBackgroundColor()
function generateRandomColor() {
    // formula taken from https://css-tricks.com/snippets/javascript/random-hex-color/
    let color ="#" + (Math.floor(Math.random() * 8**8).toString(16));

    return color;
}

// sets the text to show the user the size of the grid
function setGridSizeText() {
    boxCountText.textContent = `Grid Size: ${gridDimens} x ${gridDimens}`;
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

