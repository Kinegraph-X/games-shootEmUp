/**
 * @typedef {Object} PIXI.Texture
 */

/**
 * @typedef {import('@pixi/core/lib/index')} PIXI					<= not usable
 * @typedef {import('@pixi/text/lib/index')} PIXI.Text
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');


/**
 * @constructor GameTitleSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {String} text
 */
const GameTitleSprite = function(windowSize, text) {
	this.UID = UIDGenerator.newUID();
	this.textColor = 0xffd338;

	this.spriteObj = this.getSprite(windowSize, text);
}
//GameTitleSprite.prototype = {};
/**
 * @static {String} objectType
 */
GameTitleSprite.prototype.objectType = 'GameTitleSprite';


/**
 * @method getTextForScoreSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {String} text
 * @return {PIXI.Text}
 */
GameTitleSprite.prototype.getSprite = function(windowSize, text) {
	
	// @ts-ignore PIXI
	const titleText = new PIXI.Text(text, {
			fontFamily: '"Showcard Gothic"',
			fontSize: 123,
			fill: this.textColor,
			align: 'center'
		}
	);
	titleText.anchor.set(.5);
	titleText.x = windowSize.x.value / 2;
	titleText.y = windowSize.y.value / 2 - titleText.height / 2;
	
	return titleText;
}

 
 
 
 
 module.exports = GameTitleSprite;