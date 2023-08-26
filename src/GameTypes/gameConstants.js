/**
 * @definitions
*/

/*
* ennemies in scene per difficulty level
*/
const levels = {
	1 : {
		foeCount : 6,
		shieldedFoeCount : 0
	},
	2 : {
		foeCount : 8,
		shieldedFoeCount : 0
	},
	3 : {
		foeCount : 10,
		shieldedFoeCount : 3
	},
	4 : {
		foeCount : 14,
		shieldedFoeCount : 4
	},
	5 : {
		foeCount : 20,
		shieldedFoeCount : 7
	},
	6 : {
		foeCount : 28,
		shieldedFoeCount : 12
	}
}



/*
* ennemies descriptors
*/
const foeDescriptors = {
	0 : {
		lifePoints : 1,
		lootChance : 0
	},
	1 : {
		lifePoints : 2,
		lootChance : .1
	},
	2 : {
		lifePoints : 3,
		lootChance : .2
	},
	3 : {
		lifePoints : 5,
		lootChance : 0
	},
	4 : {
		lifePoints : 6,
		lootChance : 0
	},
	5 : {
		lifePoints : 7,
		lootChance : 0
	}
}

/*
* life points for the main speceship
*/
const mainSpaceShipLifePoints = {
	1 : 3,
	2 : 3, //5,
	3 : 3, //5,
	4 : 3, //6,
	5 : 3, //6,
	6 : 3, //7
}

/*
* lootSprite depending on lootType
*/
const lootSpritesTextures = {
	0 : 'medikit',
	1 : '',
	2 : '',
	3 : ''
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


const gameConstants = {
	levels : levels,
	foeDescriptors : foeDescriptors,
	mainSpaceShipLifePoints : mainSpaceShipLifePoints,
	weapons : weapons,
	lootSpritesTextures : lootSpritesTextures
}

module.exports = gameConstants