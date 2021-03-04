let gridContainer = document.querySelector("#grid-container");
let slider = document.querySelector("#boxCountSlider")

let gridDimens = slider.value;
let selectedColor = "black";

createSketchGrid(gridDimens);

// take in the selected dimensions, making a dimen x dimen grid
// of boxes to be color using your mouse
function createSketchGrid(dimens) {
    let row = document.createElement("div");
    row.className = "flex-row";

    let box = document.createElement("div");
    box.className = "flex-row-item";

    // append boxes into the rows
    for (let i = 0; i < dimens; i++) {
        row.appendChild(box.cloneNode(true));
    }

    // append row to gridContainer dimens amount of times
    for (let i = 0; i < dimens; i++) {
        gridContainer.appendChild(row.cloneNode(true));
    }

    setBoxListeners();

}

// set the background color of a box to the selectedColor
function setBackgroundColor(box) {
    box.style.backgroundColor = generateRandomColor();
}

// adds listeners to each box, applying colorBackground()
// when the event happens
function setBoxListeners() {
    let boxes = document.querySelectorAll(".flex-row-item");

    boxes.forEach((box) => {
        box.addEventListener("mouseenter", (e) => {   
            setBackgroundColor(e.target);
        });
    });

}

// generates a random color and returns it as a string
// to be used in setBackgroundColor()
function generateRandomColor() {
    // formula taken from https://css-tricks.com/snippets/javascript/random-hex-color/
    let color ="#" + (Math.floor(Math.random() * 8**8).toString(16));

    return color;
}