

const CoreTypes = require('src/GameTypes/_game/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');

const {foeDescriptors} = require('src/GameTypes/_game/gameConstants');


/**
 * @constructor FoeSpaceShip
 * @param {CoreTypes.Point} position
 * @param {gridManager.foeCell} foeCell
 * @param {PIXI.Texture} texture
 * @param {String} foeType // Number represented as String
 */
const FoeSpaceShip = function(position, foeCell, texture, foeType) {
	
	this.foeType = foeType;
	this.cell = foeCell;
	this.lootChance = foeDescriptors[foeType].lootChance;
	this.hasShield = false;
	
	Sprite.call(this, foeDescriptors[foeType].lifePoints);
	this.spriteObj = this.getSprite(texture);
	
	this.x = position.x.value;
	this.y = position.y.value;
	this.width = this.defaultSpaceShipDimensions.x.value;
	this.height = this.defaultSpaceShipDimensions.y.value;
	this.rotation = Math.PI;
}
FoeSpaceShip.prototype = Object.create(Sprite.prototype);

/**
 * @method getSprite
 * @param {PIXI.Texture} texture
 */
FoeSpaceShip.prototype.getSprite = function(texture) {
	const sprite = PIXI.Sprite.from(texture);
	sprite.anchor.set(0.5);
	return sprite;
}

/**
 * @static {String} name
 */
FoeSpaceShip.prototype.name = 'foeSpaceShipSprite';

/**
 * @static {CoreTypes.Dimension} defaultSpaceShipDimensions
 */
FoeSpaceShip.prototype.defaultSpaceShipDimensions = new CoreTypes.Dimension(
	120,
	120
);




module.exports = FoeSpaceShip;