/**
 * @definitions
*/

/**
* @type {{[key:String] : String}}
* dictionay of event names
*/
const eventNames = {
	mainSpaceShipOutOfScreen : 'mainSpaceShipOutOfScreen',
	mainSpaceShipHit : 'mainSpaceShipHit',
	mainSpaceShipDamaged : 'mainSpaceShipDamaged',
	mainSpaceShipPowerUp : 'mainSpaceShipPowerUp',
	foeSpaceShipDamaged : 'foeSpaceShipDamaged',
	foeSpaceShipDestroyed : 'foeSpaceShipDestroyed',
	foeSpaceShipOutOfScreen : 'foeSpaceShipOutOfScreen',
	fireballOutOfScreen : 'fireballOutOfScreen',
	lootOutOfScreen : 'lootOutOfScreen',
	disposableSpriteAnimationEnded : 'disposableSpriteAnimationEnded',
	resize : 'resize'
}

/**
 * @type {{[key:String] : {
 * 		foeCount : Number,
 * 		shieldedFoeCount : Number,
 * 		requiredPointsToStepUp : Number}
 * }} levels
 * ennemies in scene per difficulty level
 */
const levels = {
	1 : {
		foeCount : 6,
		shieldedFoeCount : 0,
		requiredPointsToStepUp : 1500
	},
	2 : {
		foeCount : 8,
		shieldedFoeCount : 0,
		requiredPointsToStepUp : 4500
	},
	3 : {
		foeCount : 10,
		shieldedFoeCount : 3,
		requiredPointsToStepUp : 9000
	},
	4 : {
		foeCount : 14,
		shieldedFoeCount : 4,
		requiredPointsToStepUp : 14000
	},
	5 : {
		foeCount : 20,
		shieldedFoeCount : 7,
		requiredPointsToStepUp : 19000
	},
	6 : {
		foeCount : 28,
		shieldedFoeCount : 12,
		requiredPointsToStepUp : 25000
	}
}



/**
 * @type {{[key:String] : {
 * 		healthPoints : Number,
 * 		lootChance : Number,
 * 		pointsPrize : Number}
 * }} foeDescriptors
 * ennemies descriptors
 */
const foeDescriptors = {
	'0' : {
		healthPoints : 1,
		lootChance : 0,
		pointsPrize : 20
	},
	'1' : {
		healthPoints : 2,
		lootChance : .1,
		pointsPrize : 45
	},
	'2' : {
		healthPoints : 3,
		lootChance : .2,
		pointsPrize : 75
	},
	'3' : {
		healthPoints : 5,
		lootChance : 0,
		pointsPrize : 120
	},
	'4' : {
		healthPoints : 6,
		lootChance : 0,
		pointsPrize : 175
	},
	'5' : {
		healthPoints : 7,
		lootChance : 0,
		pointsPrize : 600
	}
}

/**
 * @type {{[key:String] : {
 * 		healthPoints : Number,
 * 		lootChance : Number,
 * 		pointsPrize : Number}
 * }} foeDescriptors
 * ennemies descriptors
 */
const bossDescriptors = {
	'0' : {
		healthPoints : 30,
		lootChance : 0,
		pointsPrize : 2000
	},
	'1' : {
		healthPoints : 45,
		lootChance : .1,
		pointsPrize : 4500
	},
	'2' : {
		healthPoints : 60,
		lootChance : .2,
		pointsPrize : 7500
	},
	'3' : {
		healthPoints : 80,
		lootChance : 0.3,
		pointsPrize : 12000
	},
	'4' : {
		healthPoints : 90,
		lootChance : 0.4,
		pointsPrize : 17500
	},
	'5' : {
		healthPoints : 120,
		lootChance : 0.5,
		pointsPrize : 30000
	}
}

/**
* @type {{[key:Number] : Number}}
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

/**
* @type {{[key:String] : String}}
* dictionay of collision types
*/
const mainSpaceShipCollisionTypes = {
	hostile : 'hostile',
	hostileHit : 'hostileHit',
	powerUp : 'powerUp'
}



/**
* @type {{[key:String] : String}}
* dictionay of loot types
*/
const lootSpritesTypes = {
	medikit : 'medikit',
	weapon : 'weapon'
}

/**
* @type {{[key:String] : String}}
* lootSprite depending on lootType
*/
const lootSpritesTextures = {
	'0' : lootSpritesTypes.medikit,
	'1' : lootSpritesTypes.weapon,
	'2' : '',
	'3' : ''
}



/**
 * maximums loots at each new level
 * @type {{[key:String] : Number}}
 */
const maxLootsByType = {
	'medikit' : 2,
	'weapon' : 1
}



/**
 * @constructor WeaponDescriptor
 * Weapon type in relation to texture, count & damage
 * 
 * @param  {String} name
 * @param  {Number} damage
 * @param  {Number} projectileCount
 * @param {Array<String>} spriteTexture
 * @param {Number} tileCount
 * @param {Boolean} moveTiles
 */
const WeaponDescriptor = function(name, damage, projectileCount, spriteTexture, tileCount, moveTiles) {
	this.name = name;
	this.damage= damage;
	this.projectileCount = projectileCount;
	this.spriteTexture = spriteTexture;
	this.tileCount = tileCount;
	this.moveTiles = moveTiles
}


/**
 * @type {{[key:Number] : WeaponDescriptor}} weapons
 * weapon types in relation to damage
 */
const weapons = {
	0 : new WeaponDescriptor(
		'fireball',
		1,
		1,
		[
			'fireballsTilemap'
		],
		12,
		false
	),
	1 : new WeaponDescriptor(
		'firewave',
		2,
		1,
		[
			'redFireballsTilemap'
		],
		7,
		false
	),
	2 : new WeaponDescriptor(
		'tripleFireballInterlaced',
		1,
		3,
		[
			'fireballsTilemap',
			'redFireballsTilemap',
			'fireballsTilemap'
		],
		7,
		true
	),
	3 : new WeaponDescriptor(
		'tripleFireball',
		1,
		3,
		[
			'fireballsTilemap',
			'blueFireballSprite',
			'fireballsTilemap'
		],
		12,
		false
	),
	4 : new WeaponDescriptor(
		'laser',
		3,
		1,
		[
			'multiFireSpearsSprite'
		],
		6,
		false
	)
}


/**
 * @type {{[key:Number] : WeaponDescriptor}} foeWeapons
 * weapon types for foes in relation to damage
 */
const foeWeapons = {
	0 : new WeaponDescriptor(
		'fireball',
		1,
		1,
		[
			'foeFireballTilemap'
		],
		6,
		false
	)
}

/**
 * @type {{[key:Number] : WeaponDescriptor}} foeWeapons
 * weapon types for foes in relation to damage
 */
const bossWeapons = {
	0 : new WeaponDescriptor(
		'fireball',
		1,
		1,
		[
			'foeFireballTilemap'
		],
		6,
		false
	),
	1 : new WeaponDescriptor(
		'fireball',
		1,
		1,
		[
			'foeFireballTilemap',
			'foeFireballTilemap'
		],
		6,
		false
	),
	2 : new WeaponDescriptor(
		'fireball',
		1,
		1,
		[
			'foeFireballTilemap',
			'foeFireballTilemap'
		],
		6,
		false
	),
	3 : new WeaponDescriptor(
		'fireball',
		1,
		1,
		[
			'foeFireballTilemap',
			'foeFireballTilemap'
		],
		6,
		false
	),
	4 : new WeaponDescriptor(
		'fireball',
		1,
		1,
		[
			'foeFireballTilemap',
			'foeFireballTilemap'
		],
		6,
		false
	),
	5 : new WeaponDescriptor(
		'fireball',
		1,
		1,
		[
			'foeFireballTilemap',
			'foeFireballTilemap',
			'foeFireballTilemap'
		],
		6,
		false
	)
}


/**
 * Plasma colors
 * @type {{[key:String] : String}}
 */
const plasmaColors = {
	'0' : 'Orange',
	'1' : 'Green'
}


/**
 * PlasmaBlast Descriptors
 * @type {{[key:String] : Array<String>}}
 */
const plasmaBlastDescriptors = {
	'Orange' : [
		'plasmaOrange01',
		'plasmaOrange02',
		'plasmaOrange03'
	],
	'Green' : [
		'plasmaGreen01',
		'plasmaGreen02',
		'plasmaGreen03'
	]
}



const objectTypes = {
	background : 'background',
	title : 'title',
	statusBar : 'statusBar',
	mainSpaceShip : 'mainSpaceShip',
	foeSpaceShip : 'foeSpaceShip',
	bossSpaceShip : 'bossSpaceShip',
	projectile : 'projectile',
	projectiles : 'projectiles',
	shield : 'shield',
	bigShield : 'bigShield',
	bigExplosion : 'bigExplosion',
	smallExplosion : 'smallExplosion',
	greenExplosion : 'greenExplosion',
	yellowExplosion : 'yellowExplosion',
	loot : 'loot',
	plasmaBlast : 'plasmaBlast'
}


const gameConstants = {
	eventNames,
	levels,
	foeDescriptors,
	bossDescriptors,
	mainSpaceShipLifePoints,
	maxLootsByType,
	weapons,
	foeWeapons,
	bossWeapons,
	mainSpaceShipCollisionTypes,
	lootSpritesTypes,
	lootSpritesTextures,
	objectTypes,
	plasmaColors,
	plasmaBlastDescriptors
}

module.exports = gameConstants