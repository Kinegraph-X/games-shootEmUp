

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');


/**
 * @constructor MainSpaceShip
 * 
 */
const MainSpaceShip = function(position, texture, flameTexture, lifePoints) {
	this._UID = UIDGenerator.newUID();
	this.spriteObj = this.getSprite(position, texture, flameTexture, 0, lifePoints);
	this.definePropsOnSelf();
	
	this.name = 'mainSpaceShipSprite';
	this.lifePoints = lifePoints;
}
MainSpaceShip.prototype = {};
MainSpaceShip.prototype.definePropsOnSelf = Sprite.prototype.definePropsOnSelf;

MainSpaceShip.prototype.getSprite = function(position, texture, flameTexture) {
	const mainSpaceShipContainer = new PIXI.Container();
	
	this.mainSpaceShipSprite = new TilingSprite(
		this.defaultSpaceShipDimensions,
		texture
	);
	this.mainSpaceShipSprite.spriteObj.tileTransform.scale.x = .4;
	this.mainSpaceShipSprite.spriteObj.tileTransform.scale.y = .4;
	mainSpaceShipContainer.addChild(this.mainSpaceShipSprite.spriteObj);
	
	this.flameTileSprite = new TilingSprite(
		this.defaultFlameTileDimensions,
		flameTexture
	);
	
	this.flameTileSprite.spriteObj.x = this.defaultSpaceShipDimensions.x.value / 2 - this.defaultFlameTileDimensions.x.value / 2;
	this.flameTileSprite.spriteObj.y = this.defaultSpaceShipDimensions.y.value - this.defaultFlameTileDimensions.y.value / 2;
	this.flameTileSprite.name = 'flameSprite';
	
	mainSpaceShipContainer.addChild(this.flameTileSprite.spriteObj);
	
	mainSpaceShipContainer.x = position.x.value;
	mainSpaceShipContainer.y = position.y.value;
	
	return mainSpaceShipContainer;
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