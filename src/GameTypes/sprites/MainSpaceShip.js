
/**
 * @typedef {Object} PIXI.Texture
 * @typedef {Object} PIXI.Container
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;

const ShieldedDamageable = require('src/GameTypes/interfaces/ShieldedDamageable');
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');


/**
 * @constructor MainSpaceShip
 * @param {CoreTypes.Point} position
 * @param {PIXI.Texture} texture
 * @param {PIXI.Texture} flameTexture
 * @param {Number} healthPoints
 */
const MainSpaceShip = function(position, texture, flameTexture, healthPoints) {
	ShieldedDamageable.call(this);
	this.UID = UIDGenerator.newUID();
	this.spriteObj = this.getSprite(position, texture, flameTexture);
	this._definePropsOnSelf();
	
	this.healthPoints = healthPoints;
	this.shieldCharge = healthPoints;
}
MainSpaceShip.prototype = Object.create(ShieldedDamageable.prototype);
/**
 * @static {String} objectType
 */
MainSpaceShip.prototype.objectType = 'MainSpaceShip';
MainSpaceShip.prototype._definePropsOnSelf = Sprite.prototype._definePropsOnSelf;

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
	// @ts-ignore
	this.mainSpaceShipSprite.tilePositionY = 400;
	mainSpaceShipContainer.addChild(this.mainSpaceShipSprite.spriteObj);
	
	// @ts-ignore
	this.flameTileSprite = new TilingSprite(
		this.defaultFlameTileDimensions,
		flameTexture
	);
	
	this.flameTileSprite.spriteObj.x = this.defaultSpaceShipDimensions.x.value / 2 - this.defaultFlameTileDimensions.x.value / 2;
	this.flameTileSprite.spriteObj.y = this.defaultSpaceShipDimensions.y.value - this.defaultFlameTileDimensions.y.value / 2;
	// @ts-ignore
	this.flameTileSprite.objectType = 'flameSprite';
	
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