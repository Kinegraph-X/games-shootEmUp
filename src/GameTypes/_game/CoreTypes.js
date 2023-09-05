/**
 * CoreTypes
 */
//var PropertyCache = require('src/core/PropertyCache').ObjectCache;

/**
 * @constructor Coord 
 */
const Coord = function(value) {
	this.value = value;
}



const Operations = {
	add : function(val) {
		return this.value + val;
	},
	mult : function(val) {
		return this.value * val;
	},
	div : function(val) {
		return this.value / val;
	}
}

for (var op in Operations) {
	Coord.prototype[op] = Operations[op];
}




/**
 * @constructor Point 
 */
const Point = function(x, y) {
	this.x = new Coord(x || 0);
	this.y = new Coord(y || 0);
}

/**
 * @constructor Dimension 
 */
const Dimension = function(x, y) {
	this.x = new Coord(x || 0);
	this.y = new Coord(y || 0);
}


/**
 * @constructor Transform 
 */
const Transform = function(x, y) {
	Point.call(this, x, y);
}

/**
 * @constructor StepDuration 
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







const Types = {
	Coord : Coord,
	Point : Point,
	Dimension : Dimension,
	Transform : Transform,
	StepDuration : StepDuration,
	TweenTypes : TweenTypes,
//	foeSpaceShipsRegister : foeSpaceShipsRegister,
//	foeSpaceShipsTweensRegister : foeSpaceShipsTweensRegister,
	fireballsRegister : [],
	fireballsTweensRegister : [],
	disposableSpritesRegister : [],
	disposableTweensRegister : [],
	tempAsyncCollisionsTests : [],
	clearedCollisionTests : new Set()
};




module.exports = Types;