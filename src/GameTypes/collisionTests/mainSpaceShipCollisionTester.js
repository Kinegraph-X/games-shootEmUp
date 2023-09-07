 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 */




/**
 * @constructor mainSpaceShipCollisionTester
 * @param {Sprite} mainSpaceShipSprite
 * @param {Sprite} referenceObj
 * @param {String} type						// FIXME: this is Union type {'powerUp' | 'hostile'}
 */
const mainSpaceShipCollisionTester = function(mainSpaceShipSprite, referenceObj, type) {
	this.mainSpaceShipSprite = mainSpaceShipSprite;
	this.referenceObj = referenceObj;
	this.type = type;
}
//mainSpaceShipCollisionTester.prototype = {};
/**
 * @static objectType
 */
mainSpaceShipCollisionTester.prototype.objectType = 'mainSpaceShipCollisionTest';

/**
 * @method testCollision
 */
mainSpaceShipCollisionTester.prototype.testCollision = function() {
//	console.log(this.referenceObj.x + this.referenceObj.width / 2, this.mainSpaceShipSprite.x, this.mainSpaceShipSprite.width * 3 / 12);
//	console.log(this.referenceObj.x - this.referenceObj.width / 2, this.mainSpaceShipSprite.x, this.mainSpaceShipSprite.width * 9 / 12);	
	if (this.referenceObj.y + this.referenceObj.height / 2 > this.mainSpaceShipSprite.y + 38
		&& this.referenceObj.y - this.referenceObj.height / 2 < this.mainSpaceShipSprite.y + this.mainSpaceShipSprite.height 
		&& ((this.referenceObj.x + this.referenceObj.width / 2 > this.mainSpaceShipSprite.x  + this.mainSpaceShipSprite.width * 3 / 12
				&& this.referenceObj.x - this.referenceObj.width / 2 < this.mainSpaceShipSprite.x + this.mainSpaceShipSprite.width * 9 / 12)
			|| (this.referenceObj.x - this.referenceObj.width / 2 < this.mainSpaceShipSprite.x + this.mainSpaceShipSprite.width * 9 / 12
				&& this.referenceObj.x + this.referenceObj.width / 2 > this.mainSpaceShipSprite.x + this.mainSpaceShipSprite.width * 3 / 12)
			)
		)
		return true;
	
	return false;
}







module.exports = mainSpaceShipCollisionTester;