

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



/** @type {GameState} */
var gameState;

module.exports = function() {
	if (typeof gameState !== 'undefined')
		return gameState;
	else
		return (gameState = new GameState());
};