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
		lootChance : 1
	},
	1 : {
		lifePoints : 2,
		lootChance : 1
	},
	2 : {
		lifePoints : 3,
		lootChance : 1
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
* life points for the main speceship in relation to the currentLevel
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
	1 : 'weapon',
	2 : '',
	3 : ''
}



/*
* maximums loots at each new level
*/
const maxLootsByType = {
	'medikit' : 2,
	'weapon' : 1
}


/*
* weapon types in relation to damage
*/
const weapons = {
	0 : {
		name : 'fireball',
		damage : 1,
		projectileCount : 1,
		spriteTexture : [
			'fireballsTilemap'
		],
		moveTiles : false
	},
	1 : {
		name : 'firewave',
		damage : 2,
		projectileCount : 1,
		spriteTexture : [
			'fireballsTilemap'
		],
		moveTiles : false
	},
	2 : {
		name : 'tripleFireballInterlaced',
		damage : 1,
		projectileCount : 3,
		spriteTexture : [
			'fireballsTilemap',
			'fireballsTilemap',
			'fireballsTilemap'
		],
		moveTiles : true
	},
	3 : {
		name : 'tripleFireball',
		damage : 1,
		projectileCount : 3,
		spriteTexture : [
			'fireballsTilemap',
			'fireballsTilemap',
			'fireballsTilemap'
		],
		moveTiles : false
	},
	4 : {
		name : 'laser',
		damage : 3,
		projectileCount : 1,
		spriteTexture : [
			'fireballsTilemap'
		],
		moveTiles : false
	}
}


const gameConstants = {
	levels : levels,
	foeDescriptors : foeDescriptors,
	mainSpaceShipLifePoints : mainSpaceShipLifePoints,
	maxLootsByType : maxLootsByType,
	weapons : weapons,
	lootSpritesTextures : lootSpritesTextures
}

module.exports = gameConstants