/**
 * @ruleSet
 * 
 */

const CoreTypes = require('src/GameTypes/CoreTypes');
const {windowSize, cellSize, gridCoords, occupiedCells, getFoeCell, getRandomFoe} = require('src/GameTypes/gridManager');

const ExplosionSprite = require('src/GameTypes/ExplosionSprite');

const TileToggleTween = require('src/GameTypes/TileToggleTween');







const GameRule = function(targetName, action, params) {
	this.targetName = targetName;
	this.action = action;
	this.params = params;
}
 
const ruleSet = {
	testOutOfScreen : [
		new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipOutOfScreen', 'target']),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipOutOfScreen', 'target']),
		new GameRule('fireballSprite', 'trigger', ['fireballOutOfScreen', 'target'])
	],
	mainSpaceShipTestCollision : [new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipDestroyed', 'target'])],
	foeSpaceShipTestCollision : [new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipDamaged', 'fireballSprite', 'referenceObj'])],
}

const handleFoeSpaceShipDamaged = function(
		gameLoop,
		foeSpaceShipsRegister,
		foeSpaceShipsTweensRegister,
		fireballsRegister,
		fireballsTweensRegister,
		damagedFoeSpaceShip,
		explodedFireball,
		loadedAssets
	) {
		
	damagedFoeSpaceShip.lifePoints -= explodedFireball.damage;
	
	createSmallExplosion(
		gameLoop,
		damagedFoeSpaceShip,
		loadedAssets
	);
	
	if (damagedFoeSpaceShip.lifePoints === 0)
		 handleFoeSpaceShipDestroyed(
			 gameLoop,
			foeSpaceShipsRegister,
			foeSpaceShipsTweensRegister,
			fireballsRegister,
			fireballsTweensRegister,
			damagedFoeSpaceShip,
			explodedFireball
		);
	else
		removeFireBallFromStage(
			gameLoop,
			fireballsRegister,
			fireballsTweensRegister,
			explodedFireball
		)
}

const handleFoeSpaceShipDestroyed = function(
		gameLoop,
		foeSpaceShipsRegister,
		foeSpaceShipsTweensRegister,
		fireballsRegister,
		fireballsTweensRegister,
		damagedFoeSpaceShip,
		explodedFireball
	) {
	// foeSpaceShipSprite removal from the gameLoop & scene
	let spritePos = foeSpaceShipsRegister.indexOf(damagedFoeSpaceShip);
	foeSpaceShipsRegister.splice(spritePos, 1);
	gameLoop.removeTween(foeSpaceShipsTweensRegister[spritePos]);
	foeSpaceShipsTweensRegister.splice(spritePos, 1);
	
	spritePos = gameLoop.stage.children.indexOf(damagedFoeSpaceShip);
	gameLoop.stage.children.splice(spritePos, 1);
	
	removeFireBallFromStage(
		gameLoop,
		fireballsRegister,
		fireballsTweensRegister,
		explodedFireball
	);
	
	// prepare to load more foeSpaceShips
	occupiedCells[damagedFoeSpaceShip.cell.x][damagedFoeSpaceShip.cell.y] = false;
	
	gameLoop.trigger('foeSpaceShipDestroyed');
}

const removeFireBallFromStage = function(
		gameLoop,
		fireballsRegister,
		fireballsTweensRegister,
		explodedFireball
	) {
	let spritePos = fireballsRegister.indexOf(explodedFireball);
	fireballsRegister.splice(spritePos, 1);
	gameLoop.removeTween(fireballsTweensRegister[spritePos]);
	fireballsTweensRegister.splice(spritePos, 1);
	
	spritePos = gameLoop.stage.children.indexOf(explodedFireball);
	gameLoop.stage.children.splice(spritePos, 1);
}


const handleFoeSpaceShipOutOfScreen = function(
		gameLoop,
		spaceShipSprite,
		foeSpaceShipsRegister,
		foeSpaceShipsTweensRegister
	) {
	let spritePos = foeSpaceShipsRegister.indexOf(spaceShipSprite);
	foeSpaceShipsRegister.splice(spritePos, 1);
	gameLoop.removeTween(foeSpaceShipsTweensRegister[spritePos]);
	foeSpaceShipsTweensRegister.splice(spritePos, 1);
	
	spritePos = gameLoop.stage.children.indexOf(spaceShipSprite);
	gameLoop.stage.children.splice(spritePos, 1);
}



const handleFireballOutOfScreen = function(
		gameLoop,
		fireballSprite,
		fireballsRegister,
		fireballsTweensRegister
	) {
	let spritePos = fireballsRegister.indexOf(fireballSprite);
	fireballsRegister.splice(spritePos, 1);
	gameLoop.removeTween(fireballsTweensRegister[spritePos]);
	fireballsTweensRegister.splice(spritePos, 1);
	
	spritePos = gameLoop.stage.children.indexOf(fireballSprite);
	gameLoop.stage.children.splice(spritePos, 1);
}



const handleDisposableSpriteAnimationEnded = function(gameLoop, sprite) {
	let spritePos = CoreTypes.disposableSpritesRegister.indexOf(sprite);
	CoreTypes.disposableSpritesRegister.splice(spritePos, 1);
	
	spritePos = gameLoop.stage.children.indexOf(sprite);
	gameLoop.stage.children.splice(spritePos, 1);
}



const createSmallExplosion = function(
		gameLoop,
		damagedFoeSpaceShip,
		loadedAssets
	) {
	const explosionDimensions = new CoreTypes.Dimension(32, 32);
	const startPosition = new CoreTypes.Point(
		damagedFoeSpaceShip.x + getRandomExplosionOffset(damagedFoeSpaceShip.width),		// ExplosionSprite ans a 0.5 anchor
		damagedFoeSpaceShip.y + damagedFoeSpaceShip.height - getRandomExplosionOffset(damagedFoeSpaceShip.height) - 84								// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
	);
	const explosion = new ExplosionSprite(
		startPosition,
		explosionDimensions,
		loadedAssets[2].impactTilemap,
	);
	const explosionTween = new TileToggleTween(
		windowSize,
		explosion.spriteObj,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(0, 32),
		1,
		false,
		4,
		30,
		'invert',
		true
	);
	gameLoop.pushTween(explosionTween);
	gameLoop.stage.addChild(explosion.spriteObj);
	CoreTypes.disposableSpritesRegister.push(explosion.spriteObj);
}





const shouldChangeLevel = function (gameState, foeSpaceShipsRegister, addFoeSpaceShips) {
	if (foeSpaceShipsRegister.length === 1 && gameState.currentLevel < 6) {
		gameState.currentLevel++
		addFoeSpaceShips();
	}
}




function getRandomExplosionOffset(shipDimension) {
	return Math.round((Math.random() - .5) * shipDimension / 2);
}





module.exports = {
	ruleSet,
	handleFoeSpaceShipDamaged,
	handleFoeSpaceShipOutOfScreen,
	handleFireballOutOfScreen,
	handleDisposableSpriteAnimationEnded,
	shouldChangeLevel
};