




/**
 * @constructor fireballCollisionTester
 */
const fireballCollisionTester = function(fireballSprite, referenceObj) {
	this.fireballSprite = fireballSprite;
	this.referenceObj = referenceObj;
}
fireballCollisionTester.prototype = {};

fireballCollisionTester.prototype.testCollision = function() {						// Fireball sprites go way beyond the visible image
//	console.log(this.referenceObj.x + this.referenceObj.width / 2, this.fireballSprite.x  + this.fireballSprite.width * 6 / 12);
//	console.log(this.referenceObj.x - this.referenceObj.width / 2, this.fireballSprite.x + this.fireballSprite.width * 6 / 12);	
	if (this.referenceObj.y + this.referenceObj.height / 2 > this.fireballSprite.y + this.fireballSprite.height * 3 / 4
		&& this.referenceObj.x + this.referenceObj.width / 2 > this.fireballSprite.x  + this.fireballSprite.width * 6 / 12
			&& this.referenceObj.x - this.referenceObj.width / 2 < this.fireballSprite.x + this.fireballSprite.width * 6 / 12
		)
		return true;
	
	return false;
}







module.exports = fireballCollisionTester;