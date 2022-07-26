let lastTime = 0;
const size = 10;
const fps = 40;

const hider = {
  x: 0,
  y: 9,
};

const seeker = {
  x: 9,
  y: 0,
};

const tempSeeker = {
  x: 5,
  y: 5,
};

const grid = document.querySelector("#grid");

let color = "#000";
let squares = [];

let path = [];

let { x: er, y: ec } = hider;

let visited = new Set();
let queue = [[seeker.x, seeker.y]];
let pathDict = {};

let pathFinding = false;

let updatedHider = false;

document.addEventListener("DOMContentLoaded", () => {
  squares = makeGrid();

  //path = bfs(seeker, hider);
});

function main(currentTime) {
  if (currentTime - lastTime > 1000 / fps) {
    update();
    render();
    lastTime = currentTime;
  }

  requestAnimationFrame(main);
}

function update() {
  if (updatedHider) {
    visited = new Set();
    queue = [[seeker.x, seeker.y]];
    pathDict = {};
    updatedHider = false;
  }

  if (queue.length > 0) {
    let pos = queue.shift();
    let [row, col] = pos;

    if (visited.has(pos.join()) || row < 0 || row > size - 1 || col < 0 || col > size - 1) {
      return;
    }

    tempSeeker.x = row;
    tempSeeker.y = col;

    if (pos.join() === [hider.x, hider.y].join()) {
      console.log("HRJEKHRJEKRE");
      path = getPath(pathDict, pos, [seeker.x, seeker.y]);
      queue.length = 0;
      return;
    }

    if (row != hider.x) {
      queue.push([row + 1, col]);
      queue.push([row - 1, col]);
    }

    if (col != hider.y) {
      queue.push([row, col + 1]);
      queue.push([row, col - 1]);
    }

    queue.slice(-4).forEach((newPos) => {
      if (!(newPos.join() in pathDict)) {
        pathDict[newPos.join()] = pos;
      }
    });

    visited.add(pos.join());
  }

  if (path.length > 0) {
    pathFinding = true;
    tempSeeker.x = path[0][0];
    tempSeeker.y = path[0][1];
    path.shift();
  } else {
    pathFinding = false;
  }
}

function render() {
  squares[hider.x][hider.y].classList.add("user-square");

  if (pathFinding) {
    squares[tempSeeker.x][tempSeeker.y].classList.add("path-square");
  } else {
    squares[tempSeeker.x][tempSeeker.y].classList.add("enemy-square");
  }
}

const makeGrid = () => {
  let squares = [];

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const square = document.createElement("div");
      square.innerHTML = 0;
      grid.appendChild(square);
      row.push(square);
    }
    squares.push(row);
  }

  return squares;
};

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "38") {
    if (hider.x > 0) {
      hider.x -= 1;
      document
        .querySelectorAll(".enemy-square")
        .forEach((square) => square.classList.remove("enemy-square"));
      updatedHider = true;
    }
  } else if (e.keyCode == "40") {
    if (hider.x < size - 1) {
      hider.x += 1;
      document
        .querySelectorAll(".enemy-square")
        .forEach((square) => square.classList.remove("enemy-square"));
      updatedHider = true;
    }
  } else if (e.keyCode == "37") {
    if (hider.y > 0) {
      hider.y -= 1;
      document
        .querySelectorAll(".enemy-square")
        .forEach((square) => square.classList.remove("enemy-square"));
      updatedHider = true;
    }
  } else if (e.keyCode == "39") {
    if (hider.y < size - 1) {
      hider.y += 1;
      document
        .querySelectorAll(".enemy-square")
        .forEach((square) => square.classList.remove("enemy-square"));
      updatedHider = true;
    }
  }

  document.querySelector(".user-square").classList.remove("user-square");
}

function getPath(pathDict, last, start) {
  let pos = last;
  const path = [pos];

  while (pos.join() != start.join()) {
    pos = pathDict[pos.join()];
    path.unshift(pos);
  }

  return path;
}

function bfs(start, end) {
  let { x: er, y: ec } = end;

  const visited = new Set();
  const queue = [[start.x, start.y]];
  const pathDict = {};

  while (queue) {
    for (let i = 0; i < queue.length; i++) {
      let pos = queue.shift();
      let [row, col] = pos;

      if (visited.has(pos.join()) || row < 0 || row > size - 1 || col < 0 || col > size - 1) {
        continue;
      }

      if (pos.join() === [er, ec].join()) {
        return getPath(pathDict, pos, [start.x, start.y]);
      }

      if (row != er) {
        queue.push([row + 1, col]);
        queue.push([row - 1, col]);
      }

      if (col != ec) {
        queue.push([row, col + 1]);
        queue.push([row, col - 1]);
      }

      queue.slice(-4).forEach((newPos) => {
        if (!(newPos.join() in pathDict)) {
          pathDict[newPos.join()] = pos;
        }
      });

      visited.add(pos.join());
    }
  }
}

requestAnimationFrame(main);
