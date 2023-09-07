 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 */




/**
 * @constructor fireballCollisionTester
 * @param {Sprite} fireballSprite
 * @param {Sprite} referenceObj
 */
const fireballCollisionTester = function(fireballSprite, referenceObj) {
	this.fireballSprite = fireballSprite;
	this.referenceObj = referenceObj;
}
//fireballCollisionTester.prototype = {};
/**
 * @static name
 */
fireballCollisionTester.prototype.objectType = 'fireballCollisionTest';

/**
 * @method testCollision
 */
fireballCollisionTester.prototype.testCollision = function() {
//	console.log(this.referenceObj.x + this.referenceObj.width / 2, this.fireballSprite.x  + this.fireballSprite.width * 6 / 12);
//	console.log(this.referenceObj.x - this.referenceObj.width / 2, this.fireballSprite.x + this.fireballSprite.width * 6 / 12);
	if (this.referenceObj.y + this.referenceObj.height / 2 > this.fireballSprite.y
		&& this.referenceObj.y < this.fireballSprite.y + this.fireballSprite.height / 2 
		&& this.referenceObj.x + this.referenceObj.width / 2 > this.fireballSprite.x  - this.fireballSprite.width * 1 / 3
		&& this.referenceObj.x - this.referenceObj.width / 2 < this.fireballSprite.x + this.fireballSprite.width * 1 / 3
		)
		return true;
	
	return false;
}







module.exports = fireballCollisionTester;