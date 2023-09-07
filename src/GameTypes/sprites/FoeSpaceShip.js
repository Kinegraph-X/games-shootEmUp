/**
 * @typedef {Object} PIXI.Texture
 */

/**
 * @typedef {import('src/GameTypes/grids/gridManager').FoeCell} gridManager.FoeCell
 * @typedef {import('src/GameTypes/interfaces/Damageable')} Damageable
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');

const {foeDescriptors} = require('src/GameTypes/gameSingletons/gameConstants');


/**
 * @constructor FoeSpaceShip
 * @param {CoreTypes.Point} position
 * @param {gridManager.FoeCell} foeCell
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
	this.rotation = 180;
}
FoeSpaceShip.prototype = Object.create(Sprite.prototype);

/**
 * @method getSprite
 * @param {PIXI.Texture} texture
 * //@return {PIXI.Sprite}
 */
FoeSpaceShip.prototype.getSprite = function(texture) {
	// @ts-ignore
	const sprite = PIXI.Sprite.from(texture);
	sprite.anchor.set(0.5);
	return sprite;
}

/**
 * @method handleDamage
 * @param {Damageable} sprite
 * @return {Boolean}
 */
FoeSpaceShip.prototype.handleDamage = function(sprite) {
	// @ts-ignore
	this.lifePoints -= sprite.damage;
	return this.hasBeenDestroyed();
}

/**
 * @method hasBeenDestroyed
 * @return {Boolean}
 */
FoeSpaceShip.prototype.hasBeenDestroyed = function() {
	// @ts-ignore
	return this.lifePoints <= 0;
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