let gridContainer = document.querySelector("#grid-container");

let gridDimens = 12;

createSketchGrid(gridDimens);

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

function colorBackground(box) {
    box.style.backgroundColor = "black";
}

function setBoxListeners() {
    let boxes = document.querySelectorAll(".flex-row-item");

    boxes.forEach((box) => {
        box.addEventListener("mouseenter", (e) => {
            
            colorBackground(e.target);
        });
    });
}