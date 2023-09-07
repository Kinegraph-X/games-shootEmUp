/**
 * CoreTypes
 */
//var PropertyCache = require('src/core/PropertyCache').ObjectCache;

/**
 * @constructor Coord
 * @param {Number} value
 */
const Coord = function(value) {
	this.value = value;
}

/**
 * @type {{
 * [key:String] : (val:Number) => Number
 * }} Operations
 */
const Operations = {
	add : function(val) {
		// @ts-ignore
		return this.value + val;
	},
	mult : function(val) {
		// @ts-ignore
		return this.value * val;
	},
	div : function(val) {
		// @ts-ignore
		return this.value / val;
	}
}

for (var op in Operations) {
	Coord.prototype[op] = Operations[op];
}




/**
 * @constructor Point
 * @param {Number} x
 * @param {Number} y
 */
const Point = function(x, y) {
	this.x = new Coord(x || 0);
	this.y = new Coord(y || 0);
}

/**
 * @constructor Dimension
 * @param {Number} x
 * @param {Number} y
 */
const Dimension = function(x, y) {
	this.x = new Coord(x || 0);
	this.y = new Coord(y || 0);
}


/**
 * @constructor Transform
 * @param {Number} x
 * @param {Number} y
 */
const Transform = function(x, y) {
	Point.call(this, x, y);
}

/**
 * @constructor StepDuration
 * @param {Number} x
 * @param {Number} y
 */
const StepDuration = function(x, y) {
	this.x = x || 1;						// ms
	this.y = y || 1;						// ms
}





const TweenTypes = {
	add : 'add',
	mult : 'mult',
	div : 'div'
}



//let foeSpaceShipsRegister = new PropertyCache('foeSpaceShipsRegister');
//let foeSpaceShipsTweensRegister = new PropertyCache('foeSpaceShipsTweensRegister');





/**
 * @namespace CoreTypes
 */
/**
 * @typedef {Object} Sprite
 * @typedef {Object} Tween
 * @typedef {Object} CollisionTest
 * 
 * @typedef {Array<Sprite>} CoreTypes.fireballsRegister
 * @typedef {Array<Tween>} CoreTypes.fireballsTweensRegister
 * @typedef {Array<Sprite>} CoreTypes.disposableSpritesRegister
 * @typedef {Array<Tween>} CoreTypes.disposableTweensRegister
 * @typedef {Array<CollisionTest>} CoreTypes.tempAsyncCollisionsTests
 * 
 * @typedef {Coord} CoreTypes.Coord
 * @typedef {Point} CoreTypes.Point
 * @typedef {Dimension} CoreTypes.Dimension
 * @typedef {Transform} CoreTypes.Transform
 * @typedef {StepDuration} CoreTypes.StepDuration
 * @typedef {Object} CoreTypes.TweenTypes
 * @typedef {Set<Number>} CoreTypes.clearedCollisionTests 
 */
const CoreTypes = {
	Coord : Coord,
	Point : Point,
	Dimension : Dimension,
	Transform : Transform,
	StepDuration : StepDuration,
	TweenTypes : TweenTypes,
	fireballsRegister : new Array(),
	fireballsTweensRegister : new Array(),
	disposableSpritesRegister : new Array(),
	disposableTweensRegister : new Array(),
	tempAsyncCollisionsTests : new Array(),
	clearedCollisionTests : new Set()				
};




module.exports = CoreTypes;