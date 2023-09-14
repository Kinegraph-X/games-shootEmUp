/**
 * @typedef {Object} PIXI.Texture
 */

/**
 * @typedef {import('@pixi/core/lib/index')} PIXI					<= not usable
 * @typedef {import('@pixi/text/lib/index')} PIXI.Text
 * @typedef {import('src/GameTypes/sprites/MainSpaceShip')} MainSpaceShip
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');


/**
 * @constructor StatusBarSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {PIXI.Texture} textureHealth
 * @param {PIXI.Texture} textureShield
 */
const StatusBarSprite = function(windowSize, textureHealth, textureShield) {
	this.UID = UIDGenerator.newUID();
	this.margin = 15;
	this.textColor = 0xffd338;
	
	this.gameStatusHealthSpriteObj = this.getGameStatusHealthSprite(windowSize, textureHealth);
	this.gameStatusShieldSpriteObj = this.getGameStatusShieldSprite(windowSize, textureShield);
	this.textForLevelSpriteObj = this.getTextForLevelSprite(windowSize);
	this.textForScoreSpriteObj = this.getTextForScoreSprite(windowSize);
}
//StatusBarSprite.prototype = {};
/**
 * @static {String} objectType
 */
StatusBarSprite.prototype.objectType = 'StatusBarSprite';

/**
 * @method getGameStatusHealthSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {PIXI.Texture} texture
 */
StatusBarSprite.prototype.getGameStatusHealthSprite = function(windowSize, texture) {
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
	statusBar.tilePositionX = -705;
	// @ts-ignore
	statusBar.objectType = 'statusBar';
	
	return statusBar;
}

/**
 * @method getGameStatusShieldSprite
 * @param {CoreTypes.Dimension} windowSize
 * @param {PIXI.Texture} texture
 */
StatusBarSprite.prototype.getGameStatusShieldSprite = function(windowSize, texture) {
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
	statusBar.tilePositionX = -705;
	// @ts-ignore
	statusBar.objectType = 'statusBar';
	
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
	this.gameStatusHealthSpriteObj.x = this.margin + 10;
	// @ts-ignore PIXI objects are not typed
	this.gameStatusHealthSpriteObj.y = windowSize.y.value - (74 + this.margin);
	
	// @ts-ignore PIXI objects are not typed
	this.gameStatusShieldSpriteObj.x = this.margin + 10;
	// @ts-ignore PIXI objects are not typed
	this.gameStatusShieldSpriteObj.y = windowSize.y.value - (74 + this.margin);
	
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
 * @param {MainSpaceShip} sprite
 * @return Void
 */
StatusBarSprite.prototype.updateHealth = function(sprite) {
	// @ts-ignore tilePositionX is inherited
	this.gameStatusHealthSpriteObj.tilePositionX = -705 + 235 * (3 - sprite.healthPoints);
	// @ts-ignore tilePositionX is inherited
	this.gameStatusShieldSpriteObj.tilePositionX = -705 + 235* (3 - sprite.shieldCharge); 
}
 
 
 
 
 module.exports = StatusBarSprite;