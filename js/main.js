const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Grid {
  constructor(width, height) {
    this.scale = 5;
    this.cellWidth = width / this.scale;
    this.cellHeight = height / this.scale;
    this.space = [];
    this.changed = [];
    this.generation = 0;
    this.init();
  }
  init() {
    for (let i = 0; i < this.cellHeight; i++) {
      this.space.push([]);
      for (let j = 0; j < this.cellWidth; j++) {
        this.space[i].push(0);
      }
    }
    this.updateChanged();
  }
  changeScale(newScale) {
    console.log(newScale);
    
    this.scale = +newScale;
    this.cellWidth = canvas.width / this.scale;
    this.cellHeight = canvas.height / this.scale;
    this.init();
    this.clear();

  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    let x = 0, y = 0;
    this.space.forEach((row, i) => {
      row.forEach((item, j) => {
        if (item === 0) {
          ctx.strokeStyle = 'silver';
          ctx.strokeRect(x, y, this.scale, this.scale);
        }
        if (item === 1) {
          ctx.fillStyle = 'green';
          ctx.fillRect(x, y, this.scale - 1, this.scale - 1);
        }
        x += this.scale;
      });
      x = 0;
      y += this.scale;
    });
    document.getElementById('gen').innerHTML = this.generation;
  }

  findNeighbors(item, rowIndex, cellIndex) {
    let row = rowIndex;
    let cell = cellIndex;
    let neighbors = [];
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = cell - 1; j <= cell + 1; j++) {
        if (i !== rowIndex || j !== cellIndex) {
          let x = i;
          let y = j;
          if (x < 0) x = this.space.length - 1;
          if (x > this.space.length - 1) x = 0;
          if (y < 0) y = this.space[0].length - 1;
          if (y > this.space[0].length - 1) y = 0;
          if (this.space[x][y] === 1) {
            neighbors.push(this.space[x][y]);
          }
        }
      }
    }
    return neighbors;
  }

  turn() {
    let neighbors = [];
    this.space.forEach((row, rowIndex) => {
      row.forEach((item, cellIndex) => {
        neighbors = this.findNeighbors(item, rowIndex, cellIndex);
        if (this.space[rowIndex][cellIndex] === 1 && neighbors.length < 2) {
          this.changed[rowIndex][cellIndex] = 0;
        }
        if (this.space[rowIndex][cellIndex] === 1 && neighbors.length > 3) {
          this.changed[rowIndex][cellIndex] = 0;
        }
        if (this.space[rowIndex][cellIndex] === 0 && neighbors.length == 3) {
          this.changed[rowIndex][cellIndex] = 1;
        }
      });
    });
    this.space = this.changed.slice().map(function (row) {
      return row.slice();
    });
    this.generation++;
    this.draw();
  }

  random() {
    this.clear();
    this.generation = 0;
    this.space.forEach((row, rowIndex) => {
      row.forEach((item, cellIndex) => {
        if (Math.random() > 0.7) {
          this.space[rowIndex][cellIndex] = 1;
        }
      });
    });
    this.updateChanged();
    this.draw();
  }

  createLifeCell(rowIndex, cellIndex) {
    if (this.space[rowIndex][cellIndex] == 0) {
      this.space[rowIndex][cellIndex] = 1;
    } else
      this.space[rowIndex][cellIndex] = 0;
    this.updateChanged();
    this.draw();
  }

  clear() {
    this.space.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        this.space[rowIndex][cellIndex] = 0;
      });
    });
    this.changed = this.space.slice().map(function (row) {
      return row.slice();
    });
    this.generation = 0;
    this.draw();
  }

  createFigure(str) {
    switch (str) {
      case 'glider':
        this.clear();
        this.space[10][10] = 1;
        this.space[10][11] = 1;
        this.space[10][12] = 1;
        this.space[9][12] = 1;
        this.space[8][11] = 1;
        break
      case 'small exploder':
        this.clear();
        this.space[15][27] = 1;
        this.space[15][28] = 1;
        this.space[15][29] = 1;
        this.space[14][28] = 1;
        this.space[16][27] = 1;
        this.space[16][29] = 1;
        this.space[17][28] = 1;
        break
      case 'exploder':
        this.clear();
        this.space[15][27] = 1;
        this.space[16][27] = 1;
        this.space[17][27] = 1;
        this.space[18][27] = 1;
        this.space[19][27] = 1;
        this.space[15][31] = 1;
        this.space[16][31] = 1;
        this.space[17][31] = 1;
        this.space[18][31] = 1;
        this.space[19][31] = 1;
        this.space[15][29] = 1;
        this.space[19][29] = 1;
        break
      case 'cellrow':
        this.clear();
        this.space[18][28] = 1;
        this.space[18][29] = 1;
        this.space[18][30] = 1;
        this.space[18][31] = 1;
        this.space[18][32] = 1;
        this.space[18][33] = 1;
        this.space[18][34] = 1;
        this.space[18][35] = 1;
        this.space[18][36] = 1;
        this.space[18][37] = 1;
        break
      case 'spaceship':
        this.clear();
        this.space[18][30] = 1;
        this.space[18][31] = 1;
        this.space[18][32] = 1;
        this.space[18][33] = 1;
        this.space[19][29] = 1;
        this.space[21][29] = 1;
        this.space[21][32] = 1;
        this.space[19][33] = 1;
        this.space[20][33] = 1;
        break
      default:
        break
    }
    this.updateChanged();
    this.draw();
  }

  updateChanged() {
    this.changed = this.space.map((row)=> {
      return row.slice();
    });
  }
}


let grid = new Grid(canvas.width, canvas.height);

grid.draw();

let pause = true;
let globalId;
const cont = document.getElementById('container');
cont.onclick = function (event) {
  let target = event.target;
  if (target.id === 'start' && pause === true) {
    pause = false;
    function repeat() {
      grid.turn();
      globalId = requestAnimationFrame(repeat);
    }
    requestAnimationFrame(repeat);
  }
  if (target.id === 'stop' && pause === false) {
    cancelAnimationFrame(globalId);
    pause = true;
  }
  if (target.id === 'random' && pause === true) {
    grid.random();
  }
  if (target.id === 'clear' && pause === true) {
    grid.clear();
  }
}


function clickOnCell(event) {
  console.log(event.clientX, event.clientY);
  if (event.clientX !== undefined || event.clientY !== undefined) {
    let x = Math.floor((event.clientY - 10) / grid.scale);
    let y = Math.floor((event.clientX - 10) / grid.scale);
    grid.createLifeCell(x, y);
  }
}
canvas.addEventListener('click', clickOnCell);


const sel = document.getElementById('sel');
sel.addEventListener('change', clickOnSel);
function clickOnSel(event) {
  let target = event.target;
  console.log(target.options[target.selectedIndex].value);
  grid.createFigure(target.options[target.selectedIndex].value);
}

const size = document.getElementById('size');
size.addEventListener('change', (e)=> {
  grid.changeScale(e.target.options[e.target.selectedIndex].value);
})

