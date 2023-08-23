




/**
 * @constructor spaceShipCollisionTester
 */
const spaceShipCollisionTester = function(windowDimensions, target, referenceObj) {
	this.windowDimensions = windowDimensions;
	this.target = target;
	this.lowThreshold = this.windowDimension - referenceObj.height;
	this.referenceObj = referenceObj;
}
spaceShipCollisionTester.prototype = {};

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