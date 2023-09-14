



/**
 * @constructor Player
 * @param {{[key:String] : Object}} referencesToGame
 */
const Player = function(referencesToGame) {
	for (let ref in referencesToGame) {
		// @ts-ignore no prop found for the variable ref (using a not OOP-friendly pattern here)
		this[ref] = referencesToGame[ref];
	}
}






// @ts-ignore type cannot be determined (still the same a not OOP-friendly pattern)
var player;

/**
 * @param {{[key:String] : Object}} [referencesToGame = null] referencesToGame
 */
module.exports = function(referencesToGame) {
	// @ts-ignore implicit type is "Any" (still the same a not OOP-friendly pattern)
	if (typeof player !== 'undefined')
		// @ts-ignore implicit type is "Any" (still the same a not OOP-friendly pattern)
		return player;
	else
		return (player = new Player(referencesToGame));
};