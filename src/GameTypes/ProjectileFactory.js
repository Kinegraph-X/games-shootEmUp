const CoreTypes = require('src/GameTypes/CoreTypes');
const Projectile = require('src/GameTypes/Projectile');

const TileToggleMovingTween = require('src/GameTypes/TileToggleMovingTween');

const fireBallCollisionTester = require('src/GameTypes/fireBallCollisionTester');



/**
 * @constructor ProjectileFactory
 */
const ProjectileFactory = function(windowSize, loadedAssets, gameLoop, startPosition, tileSetNameArray, damage, moveTiles) {
	this.moveTiles = moveTiles || false;
	this.horizontalTweenValues = [];
	this.setHorizontalValues(tileSetNameArray.length);
	tileSetNameArray.forEach(function(tileSetName, key) {
		this.createSprite(
			key,
			tileSetNameArray.length,
			windowSize,
			loadedAssets,
			gameLoop,
			startPosition,
			tileSetName,
			damage
		);
	}, this)
}
ProjectileFactory.prototype = {}

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
	for (let i = middle; i < len; i++) {
		if (i !== middle)
			horizontalTweenValue += offset;
		this.horizontalTweenValues[i] = horizontalTweenValue;
	}
}

ProjectileFactory.prototype.createSprite = function(idx, len, windowSize, loadedAssets, gameLoop, startPosition, tileSetName, damage) {
	const fireball = new Projectile(
		startPosition,
		this.projectileDimensions,
		loadedAssets[2][tileSetName],
		damage
	)
	CoreTypes.fireballsRegister.push(fireball.spriteObj);
	
	const fireballTween = this.addToScene(
		idx,
		len,
		windowSize,
		startPosition,
		gameLoop,
		fireball.spriteObj
	);
	this.prepareCollisions(
		gameLoop,
		fireball.spriteObj,
		fireballTween
	);
}

ProjectileFactory.prototype.addToScene = function(idx, len, windowSize, startPosition, gameLoop, spriteObj) {
	
	
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
		'invert');
	CoreTypes.fireballsTweensRegister.push(fireballTween);
	
	gameLoop.pushTween(fireballTween);
	gameLoop.stage.addChild(spriteObj);
	
	return fireballTween;
}

ProjectileFactory.prototype.prepareCollisions = function(gameLoop, spriteObj, fireballTween) {
	let fireBallCollisionTest;
	Object.values(CoreTypes.foeSpaceShipsRegister.cache).forEach(function(foeSpaceShipSpriteObj) {
		fireBallCollisionTest = new fireBallCollisionTester(spriteObj, foeSpaceShipSpriteObj);
		gameLoop.pushCollisionTest(fireBallCollisionTest);
		// collisionTestsRegister is a partial copy of the global collisionTest list
		// it's used to clean the collision tests when a foeSpaceShip goes out of the screen
		fireballTween.collisionTestsRegister.push(fireBallCollisionTest);
	});
}

ProjectileFactory.prototype.projectileDimensions = new CoreTypes.Dimension(70, 70);










module.exports = ProjectileFactory;