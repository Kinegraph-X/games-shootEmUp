 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 * @typedef {import('src/GameTypes/tweens/Tween')} Tween
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Projectile = require('src/GameTypes/sprites/Projectile');
const TileToggleMovingTween = require('src/GameTypes/tweens/TileToggleMovingTween');
const fireBallCollisionTester = require('src/GameTypes/collisionTests/fireBallCollisionTester');
const {weapons} = require('src/GameTypes/gameSingletons/gameConstants');

const GameLoop = require('src/GameTypes/gameSingletons/GameLoop');
const Player = require('src/GameTypes/gameSingletons/Player');


/**
 * @constructor ProjectileFactory
 * @param {CoreTypes.Dimension} windowSize
 * @param {Array<Object>} loadedAssets
 * @param {CoreTypes.Point} startPosition
 * @param {Number} projectileType
 */
const ProjectileFactory = function(windowSize, loadedAssets, startPosition, projectileType) {
	this.moveTiles = weapons[projectileType].moveTiles;
	/** @type {Array<Number>} */
	this.horizontalTweenValues = [];
	const projectileCount = weapons[projectileType].spriteTexture.length;
	this.setHorizontalValues(projectileCount);
	
	weapons[projectileType].spriteTexture.forEach(function(textureName, key) {
		this.createSprite(
			key,
			projectileCount,
			windowSize,
			loadedAssets,
			startPosition,
			textureName,
			projectileType
		);
	}, this)
}
//ProjectileFactory.prototype = {}

/**
 * @method setHorizontalValues
 * @param {Number} len
 */
ProjectileFactory.prototype.setHorizontalValues = function(len) {
	// Fire in a brush shape if more than one projectile
	const middle = Math.floor(len / 2),
		offset = 7;
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
	/** @type {Sprite} */ // @ts-ignore
	const fireball = new Projectile(
		startPosition,
		this.projectileDimensions,
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[2][textureName],
		projectileType
	)
	CoreTypes.fireballsRegister.push(fireball.spriteObj);
	
	/** @type {Tween} */ // @ts-ignore
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
 * @param {Sprite}spriteObj 
 */
ProjectileFactory.prototype.addToScene = function(idx, len, windowSize, startPosition, spriteObj) {
	
	
	const fireballTween = new TileToggleMovingTween(
		windowSize,
		spriteObj,
		CoreTypes.TweenTypes.add,
		startPosition,
		new CoreTypes.Point(!this.moveTiles ? this.horizontalTweenValues[idx] : 0, -25),
		.4,
		false,
		12,
		new CoreTypes.Point(this.moveTiles ? this.horizontalTweenValues[idx] / 2 : 0, 70),
		11,
		'invert',
		false
		);
	CoreTypes.fireballsTweensRegister.push(fireballTween);
	
	GameLoop().addAnimatedSpriteToScene(spriteObj, fireballTween);
	
	return fireballTween;
}

/**
 * @method prepareCollisions
 * @param {Sprite}spriteObj
 * @param {Tween} fireballTween 
 */
ProjectileFactory.prototype.prepareCollisions = function(spriteObj, fireballTween) {
	let fireBallCollisionTest;
	Object.values(Player().foeSpaceShipsRegister.cache).forEach(function(foeSpaceShipSpriteObj) {
		fireBallCollisionTest = new fireBallCollisionTester(spriteObj, foeSpaceShipSpriteObj);
		GameLoop().pushCollisionTest(fireBallCollisionTest);
		// collisionTestsRegister is a partial copy of the global collisionTest list
		// it's used to clean the collision tests when a foeSpaceShip goes out of the screen
		fireballTween.collisionTestsRegister.push(fireBallCollisionTest);
	});
}

ProjectileFactory.prototype.projectileDimensions = new CoreTypes.Dimension(70, 70);










module.exports = ProjectileFactory;