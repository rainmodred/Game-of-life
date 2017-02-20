var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

class Grid {
	constructor (width, height) {
		const scale = 20;
		this.width = width/scale;
		this.height = height/scale;
		this.space = [];
		this.changed = [];
		this.generation = 0;

		for (let i = 0; i < this.height; i++) {
			this.space.push([]);
			for (let j =0; j < this.width; j++) {
				this.space[i].push(0);
			}
		}
		this.changed = this.space.slice().map(function(row) {
			return row.slice();
		});
	}

	draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height); //нужно ли?
		ctx.strokeStyle = 'black';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		var x = 0 , y = 0;
		this.space.forEach(function(row, i) {			
			row.forEach(function(item, j) {
				if (item == 0) {
					ctx.strokeStyle = 'silver';
					ctx.strokeRect(x, y, 20, 20);
				 }

				if (item == 1) {
					//инициализировать отдельно
					ctx.fillStyle = 'green';
					ctx.fillRect(x, y, 19, 19);
				}

				x +=20;
				
			},this);
			x = 0;
			y += 20;
		},this);	
		document.getElementById('gen').innerHTML = this.generation;
	}
	findNeighbors(item, rowIndex, cellIndex) {
		//возможны ошибки
		//исправить строки и столбцы
		let row = rowIndex;
		let cell = cellIndex;
		let neighbors = [];
		for (var i = row - 1; i <= row + 1; i++) {
			for (var j = cell - 1; j <= cell + 1; j++) {
				if (i !== rowIndex || j !== cellIndex){
					let x = i;
					let y = j;
					if (x < 0) x = this.space.length - 1;
					if (x > this.space.length - 1) x = 0;
					if (y < 0) y = this.space[0].length - 1;
					if (y > this.space[0].length - 1) y = 0;
					if (this.space[x][y] == 1) {
						neighbors.push(this.space[x][y]);
					}
					
				}
			}
		}
		return neighbors;
	}

	turn() {
		var neighbors = [];
		this.space.forEach(function (row, rowIndex) {

			row.forEach(function(item, cellIndex) {	
						
				neighbors = this.findNeighbors(item, rowIndex, cellIndex);

				///изменять this.changed 
				if (this.space[rowIndex][cellIndex] == 1 && neighbors.length < 2) {
					this.changed[rowIndex][cellIndex] = 0;
				} 

				if (this.space[rowIndex][cellIndex] == 1 && neighbors.length > 3) {
					this.changed[rowIndex][cellIndex] = 0;
				}

				if (this.space[rowIndex][cellIndex] == 0 && neighbors.length == 3) {
					this.changed[rowIndex][cellIndex] = 1;
				}
			},this);
		},this);

		
		this.space = this.changed.slice().map(function(row) {
			return row.slice();
		});
		this.generation++;
		this.draw();
	}

	random() {
		this.generation = 0;
		this.space.forEach(function(row, rowIndex) {
			row.forEach(function(item, cellIndex) {
				if (Math.random() > 0.7) {
					this.space[rowIndex][cellIndex] = 1;
				}
			},this);
		},this);

		this.changed = this.space.slice().map(function(row) {
			return row.slice();
		});
		this.draw();
	}


}


var grid = new Grid(canvas.width, canvas.height);
console.log(grid);
grid.space[3][5] = 1;
grid.space[3][6] = 1;
grid.space[3][7] = 1;
grid.space[2][7] = 1;
grid.space[1][6] = 1;
grid.changed = grid.space.slice().map(function(row) {return row.slice();})
grid.draw();


// requestAnimationFrame(repeat);
var timer = null;
var pause = true;
var globalId;
var cont = document.getElementById('container');
cont.onclick = function(event) {
	 
	var target = event.target;

	if (target.id == 'start' && pause == true) {
		console.log('start globalId', globalId);
		// timer = setInterval(function() {
		// 	grid.turn();
		pause = false;	
		// },1000/10);
		function repeat() {
			grid.turn();
			globalId = requestAnimationFrame(repeat);
		}
		requestAnimationFrame(repeat);
	}

	if (target.id =='stop' && pause == false) {
		cancelAnimationFrame(globalId);
		console.log(globalId);
		pause = true;
	}

	if (target.id == 'random' && pause == true) {
		grid.random();
	}
}

function createLifeCell(event) {
	console.log(event.clientX, event.clientY);
}
canvas.addEventListener('click', createLifeCell)