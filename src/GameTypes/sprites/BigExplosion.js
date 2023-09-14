

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
 * @constructor BigExplosion
 * @param {CoreTypes.Point} position
 */
const BigExplosion = function(position) {
	Sprite.call(this);
	this.spriteObj = this.getSprite();
	 
	this.x = position.x.value;
	this.y = position.y.value;
}
BigExplosion.prototype = Object.create(Sprite.prototype);
/**
 * @static {String} objectType
 */
BigExplosion.prototype.objectType = 'BigExplosion';

/**
 * @method getSprite
 * @return {TilingSprite}
 */
BigExplosion.prototype.getSprite = function() {
	 // Not sure we'll keep this "TilingSprite" type.
	 // As it inherits from Sprite, it looks quite redundant, structurally talking
	const sprite = new TilingSprite(
		this.defaultShieldDimensions,
		// @ts-ignore bigShieldTilemap is unknown
		loadedAssets[3].bigExplosionTilemap
	);
	sprite.spriteObj.anchor.set(0.5);
	// @ts-ignore blendMode
	sprite.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	return sprite.spriteObj;
}



/**
 * @static {CoreTypes.Dimension} objectType
 */
BigExplosion.prototype.defaultShieldDimensions = new CoreTypes.Dimension(640, 640)



module.exports = BigExplosion;