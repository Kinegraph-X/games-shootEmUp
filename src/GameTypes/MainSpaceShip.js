

const CoreTypes = require('src/GameTypes/CoreTypes');
const Sprite = require('src/GameTypes/Sprite');
const TilingSprite = require('src/GameTypes/TilingSprite');


/**
 * @constructor MainSpaceShip
 * 
 */
const MainSpaceShip = function(position, spaceShipDimensions,  texture, flameTexture, lifePoints) {
	this.spaceShipDimensions = spaceShipDimensions;
	this.spriteObj = this.getSprite(position, texture, flameTexture);
	this.lifePoints = lifePoints;
}
MainSpaceShip.prototype = {};

MainSpaceShip.prototype.getSprite = function(position, texture, flameTexture) {
	const mainSpaceShipContainer = new PIXI.Container();
	mainSpaceShipContainer.name = 'mainSpaceShipSprite';
	
	this.mainSpaceShipSprite = new Sprite(
		new CoreTypes.Point(0, 0),
		this.spaceShipDimensions,
		texture
	);
	
	mainSpaceShipContainer.addChild(this.mainSpaceShipSprite.spriteObj);
	
	const flameTileDimensions = new CoreTypes.Dimension(34, 83);
	this.flameTileSprite = new TilingSprite(
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