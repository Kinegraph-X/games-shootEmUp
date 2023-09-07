/**
 * @utility gridManager
 * 
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');

const windowSize = new CoreTypes.Dimension(950, 950);
 
// GRID CELLS UTILITIES FOR FOE SPACESHIPS
const gridCells = new CoreTypes.Dimension(8, 4);
const cellSize = windowSize.x.value / gridCells.x.value;
let occupiedCells = Array(gridCells.x.value);
for (let c = 0, l = gridCells.x.value; c < l; c++) {
		occupiedCells[c] = Array(gridCells.y.value);
}

/**
 * @constructor FoeCell
 * @param {Number} x
 * @param {Number} y
 */
const FoeCell = function(x, y) {
	this.x = x;
	this.y = y;
}

/**
 * @type {{x : Array<Number>, y : Array<Number>}}
 */
let gridCoords = {
	x : [],
	y : []
};

/*
 * Populate gridCoords
 */
(function getCellCoords() {
	for (let i = 0, l = gridCells.x.value; i < l; i++) {
		gridCoords.x.push(i * cellSize);
	}
	for (let i = 0, l = gridCells.y.value; i < l; i++) {
		gridCoords.y.push(i * cellSize);
	}
})();

/** 
 * @type {() => FoeCell} getRandomCell
 */
function getRandomCell() {
	const x = Math.floor(Math.random() * gridCells.x.value);
	const y = Math.floor(Math.random() * gridCells.y.value);
	return (new FoeCell(x, y));
}

/** @type {(x:Number, y:Number) => Boolean} isOccupiedCell*/
function isOccupiedCell(x, y) {
	return occupiedCells[x][y] === true;
}

/** @type {() => FoeCell} getFoeCell*/
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




/**
 * @namespace gridManager 
 */
/**
 * @typedef {FoeCell} gridManager.FoeCell
 */
const gridManager = {
	windowSize : windowSize,
	cellSize : cellSize,
	FoeCell : FoeCell,
	gridCoords : gridCoords,
	occupiedCells : occupiedCells,
	getFoeCell : getFoeCell
}



module.exports = gridManager