/**
 * @typedef {Object} PIXI.Texture
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');

const {weapons} = require('src/GameTypes/gameSingletons/gameConstants');

/**
 * @constructor Projectile
 * @param {CoreTypes.Point} position
 * @param {CoreTypes.Dimension} dimensions
 * @param {PIXI.Texture} texture
 * @param {Number} projectileType
 */
const Projectile = function(position, dimensions, texture, projectileType) {
	
	Sprite.call(this);
	
	this.damage = weapons[projectileType].damage;
	this.spriteObj = this.getSprite(dimensions, texture);
	this.x = position.x.value;
	this.y = position.y.value;
}
Projectile.prototype = Object.create(Sprite.prototype);

/**
 * @static {String} objectType
 */
Projectile.prototype.objectType = 'Projectile';

/**
 * @method getSprite
 * @param {CoreTypes.Dimension} dimensions
 * @param {PIXI.Texture} texture
 * //@return {PIXI.Sprite}
 */
Projectile.prototype.getSprite = function(dimensions, texture) {
	// @ts-ignore
	const sprite = new TilingSprite(
		dimensions,
		texture
	);
	sprite.spriteObj.anchor.set(0.5);
	
	return sprite.spriteObj;
}










module.exports = Projectile;