

/**
 * @constructor GameState
 */
const GameState = function() {
	this.currentLevel = 3;
	this.currentScore = 0;
	this.currentWeapon = 4;
	/** @type {{[key:String] : Number}} */
	this.currentLootCount = {
		'medikit' : 0,
		'weapon' : 0
	};
}
//GameState.prototype = {};

/**
 * @method getCurrentScore
 * @return {Number}
 */
GameState.prototype.getCurrentScore = function() {
	return this.currentScore;
}

/**
 * @method getCurrentScoreAsFormattedString
 * @return {String}
 */
GameState.prototype.getCurrentScoreAsFormattedString = function() {
	return this.currentScore.toString().padStart(4, '0');
}

/**
 * @method incrementScore
 * @param {Number} amount
 */
GameState.prototype.incrementScore = function(amount) {
	this.currentScore += amount;
}

/**
 * @method incrementLevel
 * @return {Number}
 */
GameState.prototype.getCurrentLevel = function() {
	return this.currentLevel;
}

/**
 * @method getCurrentLevelAsString
 * @return {String}
 */
GameState.prototype.getCurrentLevelAsString = function() {
	return this.currentLevel.toString();
}

/**
 * @method incrementLevel
 */
GameState.prototype.incrementLevel = function() {
	this.currentLevel++;
}





/** @type {GameState} */
var gameState;

module.exports = function() {
	if (typeof gameState !== 'undefined')
		return gameState;
	else
		return (gameState = new GameState());
};