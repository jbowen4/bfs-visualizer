let lastTime = 0;
const fps = 30;

const grid = document.querySelector("#grid");

let color = "#000";

function main(currentTime) {
  if (currentTime - lastTime > 1000) {
    update();
    render();
    lastTime = currentTime;
  }

  requestAnimationFrame(main);
}

function update() {
  color = Math.floor(Math.random() * 16777215).toString(16);
}

function render() {
  grid.style.backgroundColor = "#" + color;
}

requestAnimationFrame(main);
