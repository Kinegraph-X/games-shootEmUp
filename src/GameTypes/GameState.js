

/**
 * @constructor GameState
 */


const GameState = function() {
	this.currentLevel = 1;
	this.currentScore = 0;
	this.currentWeapon = 0;
	this.currentLootCount = {
		'medikit' : 0,
		'weapon' : 0
	};
}






module.exports = new GameState();