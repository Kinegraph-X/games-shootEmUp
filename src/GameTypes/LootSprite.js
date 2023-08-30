

const CoreTypes = require('src/GameTypes/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const Sprite = require('src/GameTypes/Sprite');


/**
 * @constructor LootSprite
 * 
 */
 const LootSprite = function(position, dimensions, texture, type) {
	 this._UID = UIDGenerator.newUID();
	 this.dimensions = dimensions;
	 this.spriteObj = this.getSprite(position, texture);
	 this.spriteObj.lootType = type;
 }
 LootSprite.prototype = {};
 
 LootSprite.prototype.getSprite = function(position, texture) {
	const sprite = new Sprite(
		this._UID,
		new CoreTypes.Point(0, 0),
		this.dimensions,
		texture
	);
	sprite.spriteObj.anchor.set(0.5);
	sprite.spriteObj.name = 'lootSprite';
	sprite.spriteObj.x = position.x.value;
	sprite.spriteObj.y = position.y.value;
	
	// DEBUG
//	this.currentLevelText = new PIXI.Text('1', {
//		     fontFamily: '"Showcard Gothic"',
//		     fontSize: 14,
//		     fill: 0xffd338,
//		     align: 'center'
//		 }
//	 );
//	this.currentLevelText.x = position.x.value - 64;
//	this.currentLevelText.y = position.y.value - 64;
//	this.currentLevelText.name = 'debugText';
//	this.currentLevelText.text = this._UID;
	// DEBUG END
	
	return sprite.spriteObj;
 }

 
 
 
 
 module.exports = LootSprite;