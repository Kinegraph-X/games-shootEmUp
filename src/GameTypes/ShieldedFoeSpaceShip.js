

const CoreTypes = require('src/GameTypes/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const Sprite = require('src/GameTypes/Sprite');


/**
 * @constructor ShieldedFoeSpaceShip
 * 
 */
 const ShieldedFoeSpaceShip = function(position, foeCell, type, texture, lifePoints, lootChance) {
	 this._UID = UIDGenerator.newUID();
	 this.dimensions = new CoreTypes.Dimension(120, 120);
	 this.spriteObj = this.getSprite(position, texture, foeCell);
	 this.spriteObj.lifePoints = lifePoints;
	 this.spriteObj.lootChance = lootChance;
	 this.spriteObj.hasShield = true;
	 this.spriteObj.foeType = type;
 }
 ShieldedFoeSpaceShip.prototype = {};
 
 ShieldedFoeSpaceShip.prototype.getSprite = function(position, texture, foeCell) {
	const sprite = new Sprite(
		this._UID,
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
 
 
 
 
 
 
 module.exports = ShieldedFoeSpaceShip;