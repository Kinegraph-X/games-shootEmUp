/**
 * @definitions
*/

/*
* ennemies in scene per difficulty level
*/
const levels = {
	1 : 6,
	2 : 8,
	3 : 10,
	4 : 14,
	5 : 20,
	6 : 28
}



/*
* ennemies in scene per difficulty level
*/
const lifePoints = {
	0 : 1,
	1 : 2,
	2 : 3,
	3 : 5,
	4 : 6,
	5 : 7
}



/*
* weapon types in relation to damage
*/
const weapons = {
	fireball : 1,
	firewave : 2,
	triplebomb : 2,
	laser : 3
}


const gameNumbers = {
	levels : levels,
	lifePoints : lifePoints,
	weapons : weapons
}

module.exports = gameNumbers