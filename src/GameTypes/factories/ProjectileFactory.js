 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 * @typedef {import('src/GameTypes/tweens/Tween')} Tween
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
let GameState = require('src/GameTypes/gameSingletons/GameState');

const Projectile = require('src/GameTypes/sprites/Projectile');
const TileToggleMovingTween = require('src/GameTypes/tweens/TileToggleMovingTween');
const RecurringCallbackTween = require('src/GameTypes/tweens/RecurringCallbackTween');
const fireBallCollisionTester = require('src/GameTypes/collisionTests/fireBallCollisionTester');
const mainSpaceShipCollisionTester = require('src/GameTypes/collisionTests/mainSpaceShipCollisionTester');
const {weapons, foeWeapons, bossWeapons} = require('src/GameTypes/gameSingletons/gameConstants');

const GameLoop = require('src/GameTypes/gameSingletons/GameLoop');
const Player = require('src/GameTypes/gameSingletons/Player');


/**
 * @constructor ProjectileFactory
 * @param {CoreTypes.Dimension} windowSize
 * @param {Array<Object>} loadedAssets
 * @param {CoreTypes.Point} startPosition
 * @param {Number} projectileType
 * @param {Boolean} [fromFoe = false] fromFoe
 * @param {String} [foeUID = ''] foeUID
 * @param {Boolean} [isBoss = false] isBoss
 */
const ProjectileFactory = function(windowSize, loadedAssets, startPosition, projectileType, fromFoe, foeUID, isBoss) {
	this.weaponDescriptors = fromFoe 
		? isBoss
			? bossWeapons
			: foeWeapons
		: weapons;
	
	this.projectileType = fromFoe && !isBoss ? 0 : projectileType;
	this.moveTiles = this.weaponDescriptors[this.projectileType].moveTiles;
	this.fromFoe = fromFoe;
	this.foeUID = foeUID;
	this.isBoss = isBoss;
	/** @type {Array<Number>} */
	this.horizontalTweenValues = [];
	const projectileCount = this.weaponDescriptors[this.projectileType].spriteTexture.length;
	this.setHorizontalValues(projectileCount);
	
	this.weaponDescriptors[this.projectileType].spriteTexture.forEach(function(textureName, key) {
		if (!this.fromFoe) {
			this.createSprite(
				key,
				projectileCount,
				windowSize,
				loadedAssets,
				startPosition,
				textureName,
				this.projectileType
			);
		}
		else {
			// @ts-ignore
			const recurringTween = new RecurringCallbackTween(
				this.createSprite.bind(
					this,
					key,
					projectileCount,
					windowSize,
					loadedAssets,
					startPosition,
					textureName,
					this.projectileType
				),
				this.isBoss ? 100 - GameState().currentLevel * 10 : 200
			);
			
			if (!CoreTypes.fromFoesFireballRecurringTweensRegister.hasItem(this.foeUID))
				CoreTypes.fromFoesFireballRecurringTweensRegister.setItem(this.foeUID, []);
				
			CoreTypes.fromFoesFireballRecurringTweensRegister.getItem(this.foeUID).push(recurringTween);
			GameLoop().pushTween(recurringTween);
		}
	}, this)
}
//ProjectileFactory.prototype = {}

/**
 * @method setHorizontalValues
 * @param {Number} len
 */
ProjectileFactory.prototype.setHorizontalValues = function(len) {
	const offset = 7;
	// Fire in a brush shape if more than one projectile
	if (len === 2) {
		this.horizontalTweenValues[0] = -offset;
		this.horizontalTweenValues[1] = offset
	}
	else {
		const middle = Math.floor(len / 2);
		let horizontalTweenValue = 0;
		
		for (let i = middle - 1; i >=0; i--) {
			horizontalTweenValue -= offset;
			this.horizontalTweenValues[i] = horizontalTweenValue;
		}
		horizontalTweenValue = 0;
		this.horizontalTweenValues[middle] = horizontalTweenValue;
		for (let i = middle + 1; i < len; i++) {
			horizontalTweenValue += offset;
			this.horizontalTweenValues[i] = horizontalTweenValue;
		}
	}
}

/**
 * @method createSprite
 * @param {Number} idx
 * @param {Number} len
 * @param {CoreTypes.Dimension} windowSize
 * @param {Array<Object>} loadedAssets
 * @param {CoreTypes.Point} startPosition
 * @param {String} textureName
 * @param {Number} projectileType
 */
ProjectileFactory.prototype.createSprite = function(idx, len, windowSize, loadedAssets, startPosition, textureName, projectileType) {
	// HACK to be able to launch projectiles automatically from the foe ships
	//=> we get their position when creating the sprite, instead of getting it upfront,
	// as we do usually, when we press the trigger on the mainSpaceShip
	if (this.fromFoe && !Player().foeSpaceShipsRegister.hasItem(this.foeUID))
		console.log(this.foeUID, Player().foeSpaceShipsRegister.cache);
	let realStartPosition = this.fromFoe
		? new CoreTypes.Point(
			// @ts-ignore x is inherited
			Player().foeSpaceShipsRegister.getItem(this.foeUID).x,
			// @ts-ignore y is inherited
			Player().foeSpaceShipsRegister.getItem(this.foeUID).y + Player().foeSpaceShipsRegister.getItem(this.foeUID).width / 2 - ProjectileFactory.prototype.projectileDimensions.y.value / 2
		)
		: startPosition;
	
	const fireball = new Projectile(
		realStartPosition,
		this.projectileDimensions,
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[3][textureName],
		projectileType
	)
	if (this.fromFoe)
		// @ts-ignore rotation is inherited
		fireball.rotation = 180;
		
	CoreTypes.fireballsRegister.push(fireball);
	
	this.prepareAddToScene(
		idx,
		len,
		windowSize,
		realStartPosition,
		fireball
	);
}

/**
 * @method addToScene
 * @param {Number} idx
 * @param {Number} len
 * @param {CoreTypes.Dimension} windowSize
 * @param {CoreTypes.Point} startPosition
 * @param {Projectile} fireball 
 */
ProjectileFactory.prototype.prepareAddToScene = function(idx, len, windowSize, startPosition, fireball) {
	/** @type {Tween} */ // @ts-ignore TileToggleMovingTween IS a Tween
	const fireballTween = this.addToScene(
		idx,
		len,
		windowSize,
		startPosition,
		fireball
	);
	
	this.prepareCollisions(
		fireball,
		fireballTween
	);
}

/**
 * @method addToScene
 * @param {Number} idx
 * @param {Number} len
 * @param {CoreTypes.Dimension} windowSize
 * @param {CoreTypes.Point} startPosition
 * @param {Projectile} spriteObj 
 */
ProjectileFactory.prototype.addToScene = function(idx, len, windowSize, startPosition, spriteObj) {
	
	const fireballTween = new TileToggleMovingTween(
		windowSize,
		// @ts-ignore TS doesn't know a thing about prototypal inheritance: Projectile IS a Sprite
		spriteObj,
		CoreTypes.TweenTypes.add,
		startPosition,
		new CoreTypes.Point(!this.moveTiles ? this.horizontalTweenValues[idx] : 0, this.fromFoe ? 25 : -25),
		.4,
		false,
		this.weaponDescriptors[this.projectileType].tileCount,
		new CoreTypes.Point(this.moveTiles ? this.horizontalTweenValues[idx] / 2 : 0, 70),
		14,
		'invert',
		false
		);
	CoreTypes.fireballsTweensRegister.push(fireballTween);
	
	GameLoop().addAnimatedSpriteToScene(spriteObj, fireballTween);
	
	return fireballTween;
}

/**
 * @method prepareCollisions
 * @param {Projectile} spriteObj
 * @param {Tween} fireballTween 
 */
ProjectileFactory.prototype.prepareCollisions = function(spriteObj, fireballTween) {
	let fireBallCollisionTest;
	if (!this.fromFoe) {
		Object.values(Player().foeSpaceShipsRegister.cache).forEach(function(foeSpaceShipSpriteObj) {
			// @ts-ignore TS doesn't know a thing about prototypal inheritance: Projectile IS a Sprite
			fireBallCollisionTest = new fireBallCollisionTester(spriteObj, foeSpaceShipSpriteObj);
			GameLoop().pushCollisionTest(fireBallCollisionTest);
			// collisionTestsRegister is a partial copy of the global collisionTest list
			// it's used to clean the collision tests when a foeSpaceShip goes out of the screen
			fireballTween.collisionTestsRegister.push(fireBallCollisionTest);
		});
	}
	else {
		// @ts-ignore TS doesn't know a thing about prototypal inheritance: Projectile IS a Sprite
		fireBallCollisionTest = new mainSpaceShipCollisionTester(Player().mainSpaceShip, spriteObj, 'hostileHit');
		GameLoop().pushCollisionTest(fireBallCollisionTest);
		
		fireballTween.collisionTestsRegister.push(fireBallCollisionTest);
		// @ts-ignore UID is inherited
		CoreTypes.fromFoesFireballsCollisionTestsRegister.setItem(spriteObj.UID, fireBallCollisionTest);
	}
}

ProjectileFactory.prototype.projectileDimensions = new CoreTypes.Dimension(70, 70);










module.exports = ProjectileFactory;