



/**
 * @constructor Player
 * @param {Object} referencesToGame
 */
const Player = function(referencesToGame) {
	for (let ref in referencesToGame) {
		this[ref] = referencesToGame[ref];
	}
}







var player;

module.exports = function(referencesToGame) {
	if (typeof player !== 'undefined')
		return player;
	else
		return (player = new Player(referencesToGame));
};