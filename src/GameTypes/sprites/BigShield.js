

const AssetsLoader = require('src/GameTypes/gameSingletons/AssetsLoader');
/** @type {Array<Object>} */
let loadedAssets = null;
AssetsLoader.then(function(loadedBundles) {
	loadedAssets = loadedBundles;
});

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');


/**
 * @constructor BigShield
 * @param {CoreTypes.Point} position
 */
const BigShield = function(position) {
	Sprite.call(this);
	this.spriteObj = this.getSprite();
	 
	this.x = position.x.value;
	this.y = position.y.value;
}
BigShield.prototype = Object.create(Sprite.prototype);
/**
 * @static {String} objectType
 */
BigShield.prototype.objectType = 'BigShield';

/**
 * @method getSprite
 * @return {TilingSprite}
 */
BigShield.prototype.getSprite = function() {
	 // Not sure we'll keep this "TilingSprite" type.
	 // As it inherits from Sprite, it looks quite redundant, structurally talking
	const sprite = new TilingSprite(
		this.defaultShieldDimensions,
		// @ts-ignore bigShieldTilemap is unknown
		loadedAssets[3].bigShieldTilemap
	);
	sprite.spriteObj.anchor.set(0.5);
	// @ts-ignore blendMode
	sprite.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	return sprite.spriteObj;
}



/**
 * @static {CoreTypes.Dimension} objectType
 */
BigShield.prototype.defaultShieldDimensions = new CoreTypes.Dimension(560, 560)



module.exports = BigShield;