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
 * @constructor StatusBarSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {PIXI.Texture} textureLeft
 * @param {PIXI.Texture} textureRight
 */
const StatusBarSprite = function(windowSize, textureLeft, textureRight) {
	this.UID = UIDGenerator.newUID();
	const margin = 15,
		textColor = 0xffd338;
	
	this.gameStatusSpriteObj = this.getGameStatusSprite(windowSize, textureLeft, margin);
	this.textForLevelSpriteObj = this.getTextForLevelSprite(windowSize, margin, textColor);
	this.textForScoreSpriteObj = this.getTextForScoreSprite(windowSize, margin, textColor);
}
//StatusBarSprite.prototype = {};

/**
 * @method getGameStatusSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {PIXI.Texture} texture
 * @param {Number} margin
 */
StatusBarSprite.prototype.getGameStatusSprite = function(windowSize, texture, margin) {
	// @ts-ignore
	const statusBar = new TilingSprite(
		new CoreTypes.Dimension(235, 74),
		texture,
		.5
	);
	// @ts-ignore
	statusBar.x = margin + 10;
	// @ts-ignore
	statusBar.y = windowSize.y.value - (74 + margin);
	// @ts-ignore
	statusBar.tilePositionX = 942;
	// @ts-ignore
	statusBar.name = 'statusBar';
	
	return statusBar;
}

/**
 * @method getTextForLevelSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {Number} margin
 * @param {Number} textColor
 * @return {PIXI.Text}
 */
StatusBarSprite.prototype.getTextForLevelSprite = function(windowSize, margin, textColor) {
	// @ts-ignore
	const currentLevelText = new PIXI.Text('1', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 32,
			fill: textColor,
			align: 'center'
		}
	);
	currentLevelText.x = 36 + margin;
	currentLevelText.y = windowSize.y.value - (74 + margin) + 7;
	return currentLevelText;
}

/**
 * @method getTextForScoreSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {Number} margin
 * @param {Number} textColor
 * @return {Array<PIXI.Text>}
 */
StatusBarSprite.prototype.getTextForScoreSprite = function(windowSize, margin, textColor) {
	// @ts-ignore PIXI
	const scoreText = new PIXI.Text('Score:', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 24,
			fill: textColor,
			align: 'Score'
		}
	);
	scoreText.x = windowSize.x.value - (204 + margin);
	scoreText.y = windowSize.y.value - (44 + margin);
	
	// @ts-ignore PIXI
	const currentScoreText = new PIXI.Text('0000', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 32,
			fill: textColor,
			align: 'center'
		}
	);
	currentScoreText.x = windowSize.x.value - (112 + margin);
	currentScoreText.y = windowSize.y.value - (50 + margin);
	
	return [scoreText, currentScoreText];
}

/**
 * @method decrementHealth
 * @return Void
 */
StatusBarSprite.prototype.decrementHealth = function() {
	// @ts-ignore tilePositionX is inherited
	this.gameStatusSpriteObj.tilePositionX = this.gameStatusSpriteObj.tilePositionX - 470; 
}

/**
 * @method incrementHealth
 * @return Void
 */
StatusBarSprite.prototype.incrementHealth = function() {
	// @ts-ignore tilePositionX is inherited
	this.gameStatusSpriteObj.tilePositionX = this.gameStatusSpriteObj.tilePositionX + 470; 
}
 
 
 
 
 module.exports = StatusBarSprite;