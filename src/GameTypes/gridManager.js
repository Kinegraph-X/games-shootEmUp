/**
 * @utility gridManager
 * 
 */

const CoreTypes = require('src/GameTypes/CoreTypes');

const windowSize = new CoreTypes.Dimension(950, 950);
 
// GRID CELLS UTILITIES FOR FOE SPACESHIPS
const gridCells = new CoreTypes.Dimension(8, 4);
const cellSize = windowSize.x.value / gridCells.x.value;
let occupiedCells = Array(gridCells.x.value);
for (let c = 0, l = gridCells.x.value; c < l; c++) {
		occupiedCells[c] = Array(gridCells.y.value);
}

let gridCoords = {
	x : [],
	y : []
};

(function getCellCoords() {
	for (let i = 0, l = gridCells.x.value; i < l; i++) {
		gridCoords.x.push(i * cellSize);
	}
	for (let i = 0, l = gridCells.y.value; i < l; i++) {
		gridCoords.y.push(i * cellSize);
	}
})();

function getRandomCell() {
	const x = Math.floor(Math.random() * gridCells.x.value);
	const y = Math.floor(Math.random() * gridCells.y.value);
	return {
		x : x,
		y : y
	}
}

function isOccupiedCell(x, y) {
	return occupiedCells[x][y] === true;
}

function getFoeCell() {
	let foeCell = getRandomCell();
	if (isOccupiedCell(foeCell.x, foeCell.y)) {
		while (isOccupiedCell(foeCell.x, foeCell.y)) {
			foeCell = getRandomCell();
		}
	}
	else {
		occupiedCells[foeCell.x][foeCell.y] = true;
		return foeCell;
	}
	occupiedCells[foeCell.x][foeCell.y] = true;
	return foeCell;
}

function getRandomFoe(count) {
	return Math.floor(Math.random() * count) + 1;
}








module.exports = {
	windowSize : windowSize,
	cellSize : cellSize,
	gridCoords : gridCoords,
	occupiedCells : occupiedCells,
	getFoeCell : getFoeCell,
	getRandomFoe : getRandomFoe
}