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
	this.margin = 15;
	this.textColor = 0xffd338;
	
	this.gameStatusSpriteObj = this.getGameStatusSprite(windowSize, textureLeft);
	this.textForLevelSpriteObj = this.getTextForLevelSprite(windowSize);
	this.textForScoreSpriteObj = this.getTextForScoreSprite(windowSize);
}
//StatusBarSprite.prototype = {};

/**
 * @method getGameStatusSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {PIXI.Texture} texture
 */
StatusBarSprite.prototype.getGameStatusSprite = function(windowSize, texture) {
	// @ts-ignore
	const statusBar = new TilingSprite(
		new CoreTypes.Dimension(235, 74),
		texture,
		.5
	);
	// @ts-ignore
	statusBar.x = this.margin + 10;
	// @ts-ignore
	statusBar.y = windowSize.y.value - (74 + this.margin);
	// @ts-ignore
	statusBar.tilePositionX = 942;
	// @ts-ignore
	statusBar.name = 'statusBar';
	
	return statusBar;
}

/**
 * @method getTextForLevelSprite
 * @param {CoreTypes.Dimension} windowSize
 * @return {PIXI.Text}
 */
StatusBarSprite.prototype.getTextForLevelSprite = function(windowSize) {
	// @ts-ignore
	const currentLevelText = new PIXI.Text('1', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 32,
			fill: this.textColor,
			align: 'center'
		}
	);
	currentLevelText.x = 36 + this.margin;
	currentLevelText.y = windowSize.y.value - (74 + this.margin) + 7;
	return currentLevelText;
}

/**
 * @method getTextForScoreSprite
 * @param {CoreTypes.Dimension} windowSize
 * @return {Array<PIXI.Text>}
 */
StatusBarSprite.prototype.getTextForScoreSprite = function(windowSize) {
	// @ts-ignore PIXI
	const scoreText = new PIXI.Text('Score:', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 24,
			fill: this.textColor,
			align: 'Score'
		}
	);
	scoreText.x = windowSize.x.value - (204 + this.margin);
	scoreText.y = windowSize.y.value - (44 + this.margin);
	
	// @ts-ignore PIXI
	const currentScoreText = new PIXI.Text('0000', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 32,
			fill: this.textColor,
			align: 'center'
		}
	);
	currentScoreText.x = windowSize.x.value - (112 + this.margin);
	currentScoreText.y = windowSize.y.value - (50 + this.margin);
	
	return [scoreText, currentScoreText];
}

/**
 * @method onResize
 * @param {CoreTypes.Dimension} windowSize
 */
StatusBarSprite.prototype.onResize = function(windowSize) {
	
	// @ts-ignore PIXI objects are not typed
	this.gameStatusSpriteObj.x = this.margin + 10;
	// @ts-ignore PIXI objects are not typed
	this.gameStatusSpriteObj.y = windowSize.y.value - (74 + this.margin);
	
	// @ts-ignore PIXI objects are not typed
	this.textForLevelSpriteObj.x = 36 + this.margin;
	// @ts-ignore PIXI objects are not typed
	this.textForLevelSpriteObj.y = windowSize.y.value - (74 + this.margin) + 7;
	
		// @ts-ignore PIXI objects are not typed
	this.textForScoreSpriteObj[0].x = windowSize.x.value - (204 + this.margin);
	// @ts-ignore PIXI objects are not typed
	this.textForScoreSpriteObj[0].y = windowSize.y.value - (44 + this.margin);
	
	// @ts-ignore PIXI objects are not typed
	this.textForScoreSpriteObj[1].x = windowSize.x.value - (112 + this.margin);
	// @ts-ignore PIXI objects are not typed
	this.textForScoreSpriteObj[1].y = windowSize.y.value - (50 + this.margin);
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