
/**
 * @typedef {Object} PIXI.Texture
 * @typedef {Object} PIXI.Container
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');


/**
 * @constructor MainSpaceShip
 * @param {CoreTypes.Point} position
 * @param {PIXI.Texture} texture
 * @param {PIXI.Texture} flameTexture
 * @param {Number} lifePoints
 */
const MainSpaceShip = function(position, texture, flameTexture, lifePoints) {
	this.UID = UIDGenerator.newUID();
	this.spriteObj = this.getSprite(position, texture, flameTexture);
	this._definePropsOnSelf();
	
	this.lifePoints = lifePoints;
}
//MainSpaceShip.prototype = {};
MainSpaceShip.prototype._definePropsOnSelf = Sprite.prototype._definePropsOnSelf;
MainSpaceShip.prototype.incrementHealth = Sprite.prototype.incrementHealth;
MainSpaceShip.prototype.decrementHealth = Sprite.prototype.decrementHealth;
MainSpaceShip.prototype.hasBeenDestroyed = Sprite.prototype.hasBeenDestroyed;

/**
 * @method getSprite
 * @param {CoreTypes.Point} position
 * @param {PIXI.Texture} texture
 * @param {PIXI.Texture} flameTexture
 */
MainSpaceShip.prototype.getSprite = function(position, texture, flameTexture) {
	// @ts-ignore
	const mainSpaceShipContainer = new PIXI.Container();
	
	// @ts-ignore
	this.mainSpaceShipSprite = new TilingSprite(
		this.defaultSpaceShipDimensions,
		texture
	);
	this.mainSpaceShipSprite.spriteObj.tileTransform.scale.x = .4;
	this.mainSpaceShipSprite.spriteObj.tileTransform.scale.y = .4;
	mainSpaceShipContainer.addChild(this.mainSpaceShipSprite.spriteObj);
	
	// @ts-ignore
	this.flameTileSprite = new TilingSprite(
		this.defaultFlameTileDimensions,
		flameTexture
	);
	
	this.flameTileSprite.spriteObj.x = this.defaultSpaceShipDimensions.x.value / 2 - this.defaultFlameTileDimensions.x.value / 2;
	this.flameTileSprite.spriteObj.y = this.defaultSpaceShipDimensions.y.value - this.defaultFlameTileDimensions.y.value / 2;
	// @ts-ignore
	this.flameTileSprite.name = 'flameSprite';
	
	mainSpaceShipContainer.addChild(this.flameTileSprite.spriteObj);
	
	mainSpaceShipContainer.x = position.x.value;
	mainSpaceShipContainer.y = position.y.value;
	
	return mainSpaceShipContainer;
}

/**
 * @method rollWingsLeft
 */
MainSpaceShip.prototype.rollWingsLeft = function() {
	// @ts-ignore
	this.mainSpaceShipSprite.tilePositionY = 200;
}

/**
 * @method rollWingsRight
 */
MainSpaceShip.prototype.rollWingsRight = function() {
	// @ts-ignore
	this.mainSpaceShipSprite.tilePositionY = 0;
}

/**
 * @method rollWingsFlat
 */
MainSpaceShip.prototype.rollWingsFlat = function() {
	// @ts-ignore
	this.mainSpaceShipSprite.tilePositionY = 400;
}



/**
 * @static {String} name
 */
MainSpaceShip.prototype.name = 'mainSpaceShipSprite';

/**
 * @static {CoreTypes.Dimension} defaultSpaceShipDimensions
 */
MainSpaceShip.prototype.defaultSpaceShipDimensions = new CoreTypes.Dimension(
	200,
	200
)

/**
 * @static {CoreTypes.Dimension} defaultFlameTileDimensions
 */
MainSpaceShip.prototype.defaultFlameTileDimensions = new CoreTypes.Dimension(
	34,
	82
)






module.exports = MainSpaceShip;