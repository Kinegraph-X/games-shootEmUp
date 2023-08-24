

const CoreTypes = require('src/GameTypes/CoreTypes');
const Sprite = require('src/GameTypes/Sprite');


/**
 * @constructor FoeSpaceShip
 * 
 */
 const FoeSpaceShip = function(position, foeCell, texture, lifePoints, lootChance) {
	 this.dimensions = new CoreTypes.Dimension(120, 120);
	 this.spriteObj = this.getSprite(position, texture, foeCell);
	 this.spriteObj.lifePoints = lifePoints;
	 this.spriteObj.lootChance = lootChance;
 }
 FoeSpaceShip.prototype = {};
 
 FoeSpaceShip.prototype.getSprite = function(position, texture, foeCell) {
	const sprite = new Sprite(
		position,
		this.dimensions,
		texture,
		180
	);
	sprite.spriteObj.anchor.set(0.5);
	sprite.spriteObj.name = 'foeSpaceShipSprite';
	sprite.spriteObj.cell = foeCell;
	
	return sprite.spriteObj;
 }
 
 
 
 
 
 
 module.exports = FoeSpaceShip;