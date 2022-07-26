let lastTime = 0;
const size = 10;
const fps = 40;

const hider = {
  x: 2,
  y: 2,
};

const seeker = {
  x: 5,
  y: 7,
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

const visited = new Set();
const queue = [[seeker.x, seeker.y]];
const pathDict = {};

let pathFinding = false;

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
  if (queue.length > 0) {
    let pos = queue.shift();
    let [row, col] = pos;

    if (visited.has(pos.join()) || row < 0 || row > size - 1 || col < 0 || col > size - 1) {
      return;
    }

    tempSeeker.x = row;
    tempSeeker.y = col;

    if (pos.join() === [er, ec].join()) {
      console.log("HRJEKHRJEKRE");
      path = getPath(pathDict, pos, [seeker.x, seeker.y]);
      queue.length = 0;
      return;
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

  if (path.length > 0) {
    pathFinding = true;
    tempSeeker.x = path[0][0];
    tempSeeker.y = path[0][1];
    path.shift();
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
