/**
 * @ruleSet
 * 
 */

const CoreTypes = require('src/GameTypes/_game/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const gameConstants = require('src/GameTypes/_game/gameConstants');
const {windowSize, occupiedCells} = require('src/GameTypes/grids/gridManager');
const gameState = require('src/GameTypes/_game/GameState');

const ExplosionSprite = require('src/GameTypes/sprites/ExplosionSprite');
const LootSprite = require('src/GameTypes/sprites/LootSprite');

const Tween = require('src/GameTypes/tweens/Tween');
const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');

const mainSpaceShipCollisionTester = require('src/GameTypes/collisionTests/mainSpaceShipCollisionTester');

const Player = require('src/GameTypes/_game/Player');




const GameRule = function(targetName, action, params, type) {
	this.targetName = targetName;
	this.action = action;
	this.params = params;
	this.type = type;
}
 
const ruleSet = {
	testOutOfScreen : [
		new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipOutOfScreen', 'target']),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipOutOfScreen', 'target']),
		new GameRule('fireballSprite', 'trigger', ['fireballOutOfScreen', 'target'])
	],
	mainSpaceShipTestCollision : [
		new GameRule('lootSprite', 'trigger', ['mainSpaceShipPowerUp',  'mainSpaceShipSprite', 'referenceObj'], 'powerUp'),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipDamaged', 'mainSpaceShipSprite', 'referenceObj'], 'hostile')
		
	],
	foeSpaceShipTestCollision : [new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipDamaged', 'fireballSprite', 'referenceObj'])],
}

const handleFoeSpaceShipDamaged = function(
		gameLoop,
		damagedFoeSpaceShip,
		explodedFireball,
		mainSpaceShipSprite,
		loadedAssets,
		scoreTextSprite
	) {
		
	// Avoid potential double deletion when collided twice in the same frame
	if (damagedFoeSpaceShip.lifePoints <= 0
		&& explodedFireball.name === 'fireballSprite') {	// the mainSpaceShip may also collide a foe
		removeFireBallFromStage(							// (then the mainSpaceShipSprite is aliased as the "fireball")
			gameLoop,
			explodedFireball
		)
		return;
	}
	
	if (damagedFoeSpaceShip.hasShield) {
		activateShield(
			gameLoop,
			{
				x : damagedFoeSpaceShip.x,
				y : damagedFoeSpaceShip.y,
				width : 0,
				height : 0
			},
			loadedAssets
		);
	}

	damagedFoeSpaceShip.lifePoints -= explodedFireball.damage;
	
	createSmallExplosion(
		gameLoop,
		damagedFoeSpaceShip,
		loadedAssets
	);
	
	if (damagedFoeSpaceShip.lifePoints <= 0)
		 handleFoeSpaceShipDestroyed(
			gameLoop,
			damagedFoeSpaceShip,
			mainSpaceShipSprite,
			loadedAssets,
			scoreTextSprite
		);
	
	if (explodedFireball.name === 'fireballSprite')		// the mainSpaceShip may also collide a foe
		removeFireBallFromStage(						// (then the mainSpaceShipSprite is aliased as the "fireball")
			gameLoop,
			explodedFireball
		)
}

const handleFoeSpaceShipDestroyed = function(
		gameLoop,
		damagedFoeSpaceShip,
		mainSpaceShipSprite,
		loadedAssets,
		scoreTextSprite
	) {
	
	createGreenExplosion(
		gameLoop,
		damagedFoeSpaceShip,
		loadedAssets
	);
	
	// foeSpaceShipSprite removal from the gameLoop & scene
	Player().foeSpaceShipsRegister.deleteItem(damagedFoeSpaceShip._UID);
	gameLoop.markCollisionTestsForRemoval(Player().foeSpaceShipsTweensRegister.getItem(damagedFoeSpaceShip._UID).collisionTestsRegister);
	Player().foeSpaceShipsTweensRegister.deleteItem(damagedFoeSpaceShip._UID);
	
	gameLoop.removeSpriteFromScene(damagedFoeSpaceShip);
	
	if (Math.random() <= damagedFoeSpaceShip.lootChance) {
		handleLoot(
			gameLoop,
			damagedFoeSpaceShip,
			mainSpaceShipSprite,
			loadedAssets
		);
	}
	
	// prepare to load more foeSpaceShips
	occupiedCells[damagedFoeSpaceShip.cell.x][damagedFoeSpaceShip.cell.y] = false;
	gameState.currentScore += gameConstants.foeDescriptors[damagedFoeSpaceShip.foeType].pointsPrize;
	scoreTextSprite.text = gameState.currentScore.toString().padStart(4, '0')
	
	gameLoop.trigger('foeSpaceShipDestroyed');
}

const removeFireBallFromStage = function(
		gameLoop,
		explodedFireball
	) {
	let spritePos = CoreTypes.fireballsRegister.indexOf(explodedFireball);
	CoreTypes.fireballsRegister.splice(spritePos, 1);
	gameLoop.removeTween(CoreTypes.fireballsTweensRegister[spritePos]);
	CoreTypes.fireballsTweensRegister.splice(spritePos, 1);
	
	gameLoop.removeSpriteFromScene(explodedFireball, true);		// might fail if already collided => noError
}

const handleLoot = function(
		gameLoop,
		damagedFoeSpaceShip,
		mainSpaceShipSprite,
		loadedAssets
	) {
	
	const lootSprite = createLoot(
		gameLoop,
		damagedFoeSpaceShip,
		loadedAssets
	);
	
	// There has already been enough loots of a certain type
	if (typeof lootSprite === 'undefined')
		return;
	else
		gameState.currentLootCount[lootSprite.lootType]++;
	
	const mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(mainSpaceShipSprite, lootSprite, 'powerUp');
	// we chose not to append the new collisionTest synchronously,
	// but raher to wait for the next frame : appending it synchronlously 
	// has caused us a lot of false tracks when debugging
	CoreTypes.tempAsyncCollisionsTests.push(mainSpaceShipCollisionTest);
}



const handleMainSpaceShipDamaged = function(
		gameLoop,
		damagedMainSpaceShip,
		damagedFoeSpaceShip,
		loadedAssets,
		statusBarSprite,
		currentLevelText,
		scoreTextSprite
	) {
		
	damagedMainSpaceShip.lifePoints--;
	statusBarSprite.tilePositionX -= 470;
	
	handleFoeSpaceShipDamaged(
		gameLoop,
		damagedFoeSpaceShip,
		{
			damage : 1
		},
		damagedMainSpaceShip,
		loadedAssets,
		scoreTextSprite
	);

	activateShield(
		gameLoop,
		damagedMainSpaceShip,
		loadedAssets
	);

	createSmallExplosion(
		gameLoop,
		{
			x : damagedMainSpaceShip.x + damagedMainSpaceShip.width / 2,
			y : damagedMainSpaceShip.y + damagedMainSpaceShip.height / 1.8,
			width : damagedMainSpaceShip.width / 2,
			height : 0
		},
		loadedAssets
	);
	
	
	
	if (damagedMainSpaceShip.lifePoints === 0)
		 handleMainSpaceShipDestroyed(
			gameLoop,
			damagedMainSpaceShip,
			loadedAssets,
			statusBarSprite,
			currentLevelText
		);
}



const handleMainSpaceShipDestroyed = function(
		gameLoop,
		damagedMainSpaceShip,
		loadedAssets,
		statusBarSprite,
		currentLevelText
	) {
	// damagedMainSpaceShip removal from the gameLoop & scene
	gameLoop.removeSpriteFromScene(damagedMainSpaceShip);
	gameLoop.removeSpriteFromScene(statusBarSprite);
	gameLoop.removeSpriteFromScene(currentLevelText);
	
	// can't remove collision test while looping
//	gameLoop.removeAllCollisionTests();
	
	createYellowExplosion(
		gameLoop,
		damagedMainSpaceShip,
		loadedAssets
	);
}

const handlePowerUp = function(
		gameLoop,
		lootSprite,
		mainSpaceShipSprite,
		statusBarSprite
	) {
	
	const tween = CoreTypes.disposableTweensRegister.findObjectByValue('lootSprite', lootSprite).lootTween;
	if (tween)		// let's assume it can fail...  for now...
		gameLoop.removeTween(tween);
		
	gameLoop.removeSpriteFromScene(lootSprite);
	
	switch(lootSprite.lootType) {
		case 'medikit':
			if (mainSpaceShipSprite.lifePoints < gameConstants.mainSpaceShipLifePoints[gameState.currentLevel]) {
				mainSpaceShipSprite.lifePoints++;
				statusBarSprite.tilePositionX += 470;
			}
			break;
		case 'weapon':
			if (typeof gameConstants.weapons[(++gameState.currentWeapon).toString()] === 'undefined')
				gameState.currentWeapon--;
		default:
			break;
	}
}


const handleFoeSpaceShipOutOfScreen = function(
		gameLoop,
		spaceShipSprite
	) {
	
	Player().foeSpaceShipsRegister.deleteItem(spaceShipSprite._UID);
	Player().foeSpaceShipsTweensRegister.deleteItem(spaceShipSprite._UID);
	gameLoop.removeTween(Player().foeSpaceShipsTweensRegister.getItem(spaceShipSprite._UID));
	
	gameLoop.removeSpriteFromScene(spaceShipSprite, true);		// might fail if already destroyed => noError
}



const handleFireballOutOfScreen = function(
		gameLoop,
		fireballSprite
	) {
	removeFireBallFromStage(
		gameLoop,
		fireballSprite
	);
}



const handleMainSpaceShipOutOfScreen = function(
		windowSize,
		gameLoop,
		mainSpaceShipSprite
	) {
	
	if (mainSpaceShipSprite.x > windowSize.x.value)
		mainSpaceShipSprite.x -= mainSpaceShipSprite.width * 2;
	else if (mainSpaceShipSprite.x + mainSpaceShipSprite.width < 0)
		mainSpaceShipSprite.x += mainSpaceShipSprite.width * 2;
	else if (mainSpaceShipSprite.y > windowSize.y.value)
		mainSpaceShipSprite.y -= mainSpaceShipSprite.height * 2;
}



const handleDisposableSpriteAnimationEnded = function(gameLoop, sprite) {
	let spritePos = CoreTypes.disposableSpritesRegister.indexOf(sprite);
	
	if (spritePos === -1) {
		console.warn('a disposable FX wasn\'t found in the register for deletion', spritePos, sprite);
		return;
	}
	CoreTypes.disposableSpritesRegister.splice(spritePos, 1);
	
	gameLoop.removeSpriteFromScene(sprite);
}



const createSmallExplosion = function(
		gameLoop,
		damagedFoeSpaceShip,
		loadedAssets
	) {
	const explosionDimensions = new CoreTypes.Dimension(32, 32);
	const startPosition = new CoreTypes.Point(
		damagedFoeSpaceShip.x + getRandomExplosionOffset(damagedFoeSpaceShip.width),		// ExplosionSprite has a 0.5 anchor
		damagedFoeSpaceShip.y + damagedFoeSpaceShip.height - getRandomExplosionOffset(damagedFoeSpaceShip.height) - 84								// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
	);
	const explosion = new ExplosionSprite(
		startPosition,
		explosionDimensions,
		loadedAssets[2].impactTilemap,
	);
	const explosionTween = new TileToggleTween(
		windowSize,
		explosion,
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
	gameLoop.addSpriteToScene(explosion);
	CoreTypes.disposableSpritesRegister.push(explosion);
}

const createGreenExplosion = function(
		gameLoop,
		damagedFoeSpaceShip,
		loadedAssets
	) {
	const explosionDimensions = new CoreTypes.Dimension(64, 64);
	const startPosition = new CoreTypes.Point(
		damagedFoeSpaceShip.x + getRandomExplosionOffset(damagedFoeSpaceShip.width / 4),		// ExplosionSprite has a 0.5 anchor
		damagedFoeSpaceShip.y - getRandomExplosionOffset(damagedFoeSpaceShip.height / 8)
	);
	
	const explosion = new ExplosionSprite(
		startPosition,
		explosionDimensions,
		loadedAssets[2].greenExplosionTilemap,
	);
	explosion.scaleX = 1.5;
	explosion.scaleY = 1.5;
	
	const explosionTween = new TileToggleTween(
		windowSize,
		explosion,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(64, 0),
		1,
		false,
		12,
		7,
		'invert',
		true
	);
	gameLoop.pushTween(explosionTween);
	gameLoop.addSpriteToScene(explosion);
	CoreTypes.disposableSpritesRegister.push(explosion);
}

const createYellowExplosion = function(
		gameLoop,
		damagedFoeSpaceShip,
		loadedAssets
	) {
	const explosionDimensions = new CoreTypes.Dimension(64, 64);
	const startPosition = new CoreTypes.Point(
		damagedFoeSpaceShip.x + damagedFoeSpaceShip.width / 2 + getRandomExplosionOffset(damagedFoeSpaceShip.width / 4),		// ExplosionSprite has a 0.5 anchor
		damagedFoeSpaceShip.y + damagedFoeSpaceShip.height / 2 - getRandomExplosionOffset(damagedFoeSpaceShip.height / 8)
	);
	
	const explosion = new ExplosionSprite(
		startPosition,
		explosionDimensions,
		loadedAssets[2].yellowExplosionTilemap,
	);
	explosion.scaleX = 2;
	explosion.scaleY = 2;
	
	const explosionTween = new TileToggleTween(
		windowSize,
		explosion,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(64, 0),
		1,
		false,
		12,
		7,
		'invert',
		true
	);
	gameLoop.pushTween(explosionTween);
	gameLoop.addSpriteToScene(explosion);
	CoreTypes.disposableSpritesRegister.push(explosion);
}


const activateShield = function(
		gameLoop,
		spaceShip,
		loadedAssets
	) {
	
	let shieldDimensions, zoom = 1;
	shieldDimensions = new CoreTypes.Dimension(200, 200);

	const startPosition = new CoreTypes.Point(
		spaceShip.x + spaceShip.width / 2,
		spaceShip.y + spaceShip.height / 2
	);
	const shield = new ExplosionSprite(
		startPosition,
		shieldDimensions,
		loadedAssets[2].shieldTilemap,
	);
	shield.name = 'shieldSprite';
	shield.zoom = zoom;
	
	const shieldTween = new TileToggleTween(
		windowSize,
		shield,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(0, 200),
		1,
		false,
		6,
		15,
		'invert',
		true
	);
	gameLoop.pushTween(shieldTween);
	gameLoop.addSpriteToScene(shield);
	CoreTypes.disposableSpritesRegister.push(shield);
}

const createLoot = function(
		gameLoop,
		foeSpaceShip,
		loadedAssets
	) {
	
	const lootType = gameConstants.lootSpritesTextures[getRandomLootType()];
	
	if (gameState.currentLootCount[lootType] === gameConstants.maxLootsByType[lootType])
		return;
	
	let lootDimensions = new CoreTypes.Dimension(64, 64);
	const startPosition = new CoreTypes.Point(
		foeSpaceShip.x,
		foeSpaceShip.y
	);
	
	const loot = new LootSprite(
		startPosition,
		lootDimensions,
		loadedAssets[2][lootType + 'Tilemap'],
		lootType
	);
	
	const lootTween = new Tween(
		windowSize,
		loot,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(0, 7),
		.1
	);
	gameLoop.pushTween(lootTween);
	gameLoop.addSpriteToScene(loot);
	
	CoreTypes.disposableTweensRegister.push({
		lootSprite : loot,
		lootTween : lootTween
	});
	
	return loot;
}





const shouldChangeLevel = function (currentLevelText, addFoeSpaceShips) {
	if (Object.keys(Player().foeSpaceShipsRegister.cache).length === 1
		&& gameState.currentLevel < 6) {
		
		if (gameState.currentScore >= gameConstants.levels[gameState.currentLevel.toString()].requiredPointsToStepUp) {
			gameState.currentLevel++;
			gameState.currentLootCount.medikit = 0;
			gameState.currentLootCount.weapon = 0;
			currentLevelText.text = gameState.currentLevel;
			addFoeSpaceShips();
		}
		else
			addFoeSpaceShips();
	}
}

function getRandomFoe(count) {
	return Math.floor(Math.random() * count).toString();
}

function getRandomLootType() {
	return (Math.floor(Math.random() * 1.9)).toString(); // shall be Math.floor(Math.random() * lootTypesCount)
}

function getRandomExplosionOffset(shipDimension) {
	return Math.round((Math.random() - .5) * shipDimension / 2);
}


let counter = 0;

/**
 * Helper method for debug
 */
function addUIDMarkerToEntity(
		gameLoop,
		sprite,
		loadedAssets,
		offset,
		text
	) {
	
	offset = offset || 0;
	text = text || '';
	const currentLevelText = new PIXI.Text('1', {
		     fontFamily: '"Helvetica Neue"',
		     fontSize: 16,
		     fill: 0xffd338,
		     align: 'center'
		 }
	 );
	currentLevelText.x = sprite.x - 49 + offset;
	currentLevelText.y = sprite.y - 49;
	currentLevelText.name = 'debugText';
	currentLevelText.text = counter++ + ' ' + sprite._UID + ' ' + (gameLoop.currentTime / 1000).toString().slice(0, 4) + ' ' + text;
	
	
	const textTween = new Tween(
		windowSize,
		currentLevelText,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(0, 7),
		.1
	);
	
	gameLoop.pushTween(textTween);
	gameLoop.addSpriteToScene(currentLevelText);
}





module.exports = {
	ruleSet,
	handleFoeSpaceShipDamaged,
	handleFoeSpaceShipOutOfScreen,
	handleMainSpaceShipDamaged,
	handleFireballOutOfScreen,
	handleMainSpaceShipOutOfScreen,
	handleDisposableSpriteAnimationEnded,
	shouldChangeLevel,
	handlePowerUp,
	createLoot,
	getRandomFoe
};