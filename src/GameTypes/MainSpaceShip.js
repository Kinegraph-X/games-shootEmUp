

const CoreTypes = require('src/GameTypes/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const TilingSprite = require('src/GameTypes/TilingSprite');


/**
 * @constructor MainSpaceShip
 * 
 */
const MainSpaceShip = function(position, spaceShipDimensions,  texture, flameTexture, lifePoints) {
	this._UID = UIDGenerator.newUID();
	this.spaceShipDimensions = spaceShipDimensions;
	this.spriteObj = this.getSprite(position, texture, flameTexture);
	this.spriteObj.lifePoints = lifePoints;
}
MainSpaceShip.prototype = {};

MainSpaceShip.prototype.getSprite = function(position, texture, flameTexture) {
	const mainSpaceShipContainer = new PIXI.Container();
	mainSpaceShipContainer.name = 'mainSpaceShipSprite';
	
	this.mainSpaceShipSprite = new TilingSprite(
		this._UID,
		new CoreTypes.Point(0, 0),
		this.spaceShipDimensions,
		texture
	);
//	this.mainSpaceShipSprite.spriteObj.tilePosition.y = 500;
	this.mainSpaceShipSprite.spriteObj.tileTransform.scale.x = .4;
	this.mainSpaceShipSprite.spriteObj.tileTransform.scale.y = .4;
	mainSpaceShipContainer.addChild(this.mainSpaceShipSprite.spriteObj);
	
	const flameTileDimensions = new CoreTypes.Dimension(34, 82);
	this.flameTileSprite = new TilingSprite(
		'-1',						// the flame shouldn't need to be referenced in a register, let's give it a fake  UID 
		new CoreTypes.Point(0, 0),
		flameTileDimensions,
		flameTexture
	);
	
	this.flameTileSprite.spriteObj.x = this.spaceShipDimensions.x.value / 2 - flameTileDimensions.x.value / 2;
	this.flameTileSprite.spriteObj.y = this.spaceShipDimensions.y.value - flameTileDimensions.y.value / 2;
	this.flameTileSprite.spriteObj.name = 'flameSprite';
	
	mainSpaceShipContainer.addChild(this.flameTileSprite.spriteObj);
	
	mainSpaceShipContainer.x = position.x.value;
	mainSpaceShipContainer.y = position.y.value;
	
	return mainSpaceShipContainer;
}






module.exports = MainSpaceShip;