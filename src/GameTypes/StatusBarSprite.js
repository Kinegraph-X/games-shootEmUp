

const CoreTypes = require('src/GameTypes/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const TilingSprite = require('src/GameTypes/TilingSprite');


/**
 * @constructor StatusBarSprite
 * 
 */
const StatusBarSprite = function(windowSize, textureLeft, textureRight) {
	this._UID = UIDGenerator.newUID();
	const margin = 15;
	this.gameStatusSpriteObj = this.getGameStatusSprite(windowSize, textureLeft, margin);
	this.textForLevelSpriteObj = this.getTextForLevelSprite(windowSize, margin);
	this.textForScoreSpriteObj = this.getTextForScoreSprite(windowSize, margin);
}
StatusBarSprite.prototype = {};
 
StatusBarSprite.prototype.getGameStatusSprite = function(windowSize, texture, margin) {
	
	const statusBar = new TilingSprite(
		this._UID,
		new CoreTypes.Point(0, 0),
		new CoreTypes.Dimension(235, 74),
		texture,
		.5
	);
	statusBar.spriteObj.x = margin + 10;
	statusBar.spriteObj.y = windowSize.y.value - (74 + margin);
	statusBar.spriteObj.tilePosition.x = 942;
	statusBar.spriteObj.name = 'statusBar';
	
	
	return statusBar.spriteObj;
}
 
StatusBarSprite.prototype.getTextForLevelSprite = function(windowSize, margin) {
	const currentLevelText = new PIXI.Text('1', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 32,
			fill: 0xffd338,
			align: 'center'
		}
	);
	currentLevelText.text = '1';		// not needed, but while debugging, we tested that...
	currentLevelText.x = 36 + margin;
	currentLevelText.y = windowSize.y.value - (74 + margin) + 7;
	return currentLevelText;
}

StatusBarSprite.prototype.getTextForScoreSprite = function(windowSize, margin) {
	const scoreText = new PIXI.Text('Score:', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 24,
			fill: 0xffd338,
			align: 'Score'
		}
	);
	scoreText.text = 'Score';			// not needed, but while debugging, we tested that...
	scoreText.x = windowSize.x.value - (204 + margin);
	scoreText.y = windowSize.y.value - (44 + margin);
	
	const currentScoreText = new PIXI.Text('0000', {
			fontFamily: '"Showcard Gothic"',
			fontSize: 32,
			fill: 0xffd338,
			align: 'center'
		}
	);
	currentScoreText.text = '0000';		// not needed, but while debugging, we tested that...
	currentScoreText.x = windowSize.x.value - (112 + margin);
	currentScoreText.y = windowSize.y.value - (50 + margin);
	
	return [scoreText, currentScoreText];
}
 
 
 
 
 module.exports = StatusBarSprite;