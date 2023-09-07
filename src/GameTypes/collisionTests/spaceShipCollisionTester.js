 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 * @typedef {import('src/GameTypes/gameSingletons/CoreTypes').Dimension} CoreTypes.Dimension
 */


/*
 * /!\ WARNING : this type seems to be unused in the game... and we don't know what it was supposed to do...
 */

/**
 * @constructor spaceShipCollisionTester
 * @param {CoreTypes.Dimension} windowDimensions
 * @param {Sprite} target
 * @param {Sprite} referenceObj
 */
const spaceShipCollisionTester = function(windowDimensions, target, referenceObj) {
	this.windowDimensions = windowDimensions;
	this.target = target;
	this.lowThreshold = this.windowDimensions.y.value - referenceObj.height;
	this.referenceObj = referenceObj;
}
//spaceShipCollisionTester.prototype = {};

/**
 * @method testCollision
 * @return Void
 */
spaceShipCollisionTester.prototype.testCollision = function() {
	if (this.target.y + this.target.height < this.lowThreshold)
		return false;
	else if (this.referenceObj.x > this.target.x && this.referenceObj.x < this.target.x + this.target.width
		|| (this.referenceObj.x + this.referenceObj.width > this.target.x
			&& this.referenceObj.x + this.referenceObj.width < this.target.x + this.target.width))
		return true;
	
	return false;
}







module.exports = spaceShipCollisionTester;