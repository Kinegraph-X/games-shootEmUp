/**
 * @typedef {Object} PIXI.Texture
 */

/**
 * @typedef {import('src/GameTypes/grids/gridManager').FoeCell} gridManager.FoeCell
 * @typedef {import('src/GameTypes/interfaces/Wounder')} Wounder
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');

const {bossDescriptors} = require('src/GameTypes/gameSingletons/gameConstants');


/**
 * @constructor BossSpaceShip
 * @param {CoreTypes.Point} position
 * @param {gridManager.FoeCell} foeCell
 * @param {PIXI.Texture} texture
 * @param {String} foeType // Number represented as String
 */
const BossSpaceShip = function(position, foeCell, texture, foeType) {
	
	this.foeType = foeType;
	this.cell = foeCell;
	this.lootChance = bossDescriptors[foeType].lootChance;
	this.hasShield = true;
	
	Sprite.call(this, bossDescriptors[foeType].healthPoints);
	this.spriteObj = this.getSprite(texture);
	
	this.x = position.x.value;
	this.y = position.y.value;
	this.width = this.defaultSpaceShipDimensions.x.value;
	this.height = this.defaultSpaceShipDimensions.y.value;
	this.rotation = 180;
}
BossSpaceShip.prototype = Object.create(Sprite.prototype);
/**
 * @static {String} objectType
 */
BossSpaceShip.prototype.objectType = 'BossSpaceShip'; 

/**
 * @method getSprite
 * @param {PIXI.Texture} texture
 * //@return {PIXI.Sprite}
 */
BossSpaceShip.prototype.getSprite = function(texture) {
	// @ts-ignore
	const sprite = PIXI.Sprite.from(texture);
	sprite.anchor.set(0.5);
	return sprite;
}

/**
 * @method handleDamage
 * @param {Wounder} sprite
 * @return Void
 */
BossSpaceShip.prototype.handleDamage = function(sprite) {
	// @ts-ignore
	this.healthPoints -= sprite.damage;
}

/**
 * @method hasBeenDestroyed
 * @return {Boolean}
 */
BossSpaceShip.prototype.hasBeenDestroyed = function() {
	// @ts-ignore
	return this.healthPoints <= 0;
}

/**
 * @static {CoreTypes.Dimension} defaultSpaceShipDimensions
 */
BossSpaceShip.prototype.defaultSpaceShipDimensions = new CoreTypes.Dimension(
	400,
	400
);




module.exports = BossSpaceShip;