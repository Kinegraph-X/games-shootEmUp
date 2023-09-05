

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');


/**
 * @constructor StatusBarSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {PIXI.texture} textureLeft
 * @param {PIXI.texture} textureRight
 */
const StatusBarSprite = function(windowSize, textureLeft, textureRight) {
	this._UID = UIDGenerator.newUID();
	const margin = 15,
		textColor = 0xffd338;
		
	this.definePropsOnSelf();
	
	this.gameStatusSpriteObj = this.getGameStatusSprite(windowSize, textureLeft, margin);
	this.textForLevelSpriteObj = this.getTextForLevelSprite(windowSize, margin, textColor);
	this.textForScoreSpriteObj = this.getTextForScoreSprite(windowSize, margin, textColor);
}
StatusBarSprite.prototype = {};
StatusBarSprite.prototype.definePropsOnSelf = Sprite.prototype.definePropsOnSelf;

/**
 * @method getGameStatusSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {PIXI.texture} texture
 * @param {Number} margin
 */
StatusBarSprite.prototype.getGameStatusSprite = function(windowSize, texture, margin) {
	
	const statusBar = new TilingSprite(
		new CoreTypes.Dimension(235, 74),
		texture,
		.5
	);
	statusBar.x = margin + 10;
	statusBar.y = windowSize.y.value - (74 + margin);
	statusBar.tilePositionX = 942;
	statusBar.name = 'statusBar';
	
	
	return statusBar.spriteObj;
}

/**
 * @method getTextForLevelSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {Number} margin
 * @param {Number} textColor
 */
StatusBarSprite.prototype.getTextForLevelSprite = function(windowSize, margin, textColor) {
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
 */
StatusBarSprite.prototype.getTextForScoreSprite = function(windowSize, margin, textColor) {
	const scoreText = new PIXI.Text('Score:', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 24,
			fill: textColor,
			align: 'Score'
		}
	);
	scoreText.x = windowSize.x.value - (204 + margin);
	scoreText.y = windowSize.y.value - (44 + margin);
	
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
 
 
 
 
 module.exports = StatusBarSprite;