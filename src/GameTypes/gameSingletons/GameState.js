

/**
 * @constructor GameState
 */
const GameState = function() {
	this.currentLevel = 1;
	this.currentScore = 0;
	this.currentWeapon = 0;
	/** @type {{[key:String] : Number}} */
	this.currentLootCount = {
		'medikit' : 0,
		'weapon' : 0
	};
}
//GameState.prototype = {};

/**
 * @method getCurrentScore
 */
GameState.prototype.getCurrentScore = function() {
	return this.currentScore;
}

/**
 * @method getCurrentScore
 */
GameState.prototype.getCurrentScoreAsString = function() {
	return this.currentScore.toString().padStart(4, '0');
}

/**
 * @method incrementScore
 * @param {Number} amount
 */
GameState.prototype.incrementScore = function(amount) {
	this.currentScore += amount;
}





/** @type {GameState} */
var gameState;

module.exports = function() {
	if (typeof gameState !== 'undefined')
		return gameState;
	else
		return (gameState = new GameState());
};