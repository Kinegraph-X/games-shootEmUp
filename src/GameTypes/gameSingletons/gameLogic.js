 
 /**
 * @typedef {Object} PIXI.Text
 * @typedef {import('src/GameTypes/interfaces/Damageable')} Damageable
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 * @typedef {import('src/GameTypes/sprites/TilingSprite')} TilingSprite
 * @typedef {import('src/GameTypes/sprites/FoeSpaceShip')} FoeSpaceShip
 * @typedef {import('src/GameTypes/sprites/Projectile')} Projectile
 */

/**
 * @singleton
 * Rules for the actual game
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const gameConstants = require('src/GameTypes/gameSingletons/gameConstants');
const {windowSize, occupiedCells} = require('src/GameTypes/grids/gridManager');
const ruleSet = require('src/GameTypes/gameSingletons/gameRules');
const GameState = require('src/GameTypes/gameSingletons/GameState');
const GameLoop = require('src/GameTypes/gameSingletons/GameLoop');

const ExplosionSprite = require('src/GameTypes/sprites/ExplosionSprite');
const LootSprite = require('src/GameTypes/sprites/LootSprite');

const Tween = require('src/GameTypes/tweens/Tween');
const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');

const mainSpaceShipCollisionTester = require('src/GameTypes/collisionTests/mainSpaceShipCollisionTester');

const Player = require('src/GameTypes/gameSingletons/Player');





/**
 * @method handleFoeSpaceShipDamaged
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {Projectile} explodedFireball
 * @param {Array<Object>} loadedAssets
 * @param {PIXI.Text} scoreTextSprite
 * @return Void
 */
const handleFoeSpaceShipDamaged = function(
		damagedFoeSpaceShip,
		explodedFireball,
		loadedAssets,
		scoreTextSprite
	) {
		
	// Avoid potential double deletion when collided twice in the same frame
	// @ts-ignore lifePoints is inherited
	if (damagedFoeSpaceShip.lifePoints <= 0
		&& explodedFireball.name === 'fireballSprite') {	// Test the "name" prop : the mainSpaceShip may also collide a foe
		removeFireBallFromStage(							// (then the mainSpaceShipSprite is positionned
			explodedFireball								// at the same propName as the "fireball")
		)
		return;
	}
	
	if (damagedFoeSpaceShip.hasShield) {
		activateShield(
			// @ts-ignore :expected {Sprite}, given {FoeSpaceShip} => TS doesn't understand anything to prototype inheritance...
			damagedFoeSpaceShip,
			loadedAssets
		);
	}

	damagedFoeSpaceShip.handleDamage(explodedFireball);
	
	createSmallExplosion(
		damagedFoeSpaceShip,
		loadedAssets
	);
	
	// @ts-ignore lifePoints is inherited
	if (damagedFoeSpaceShip.lifePoints <= 0)
		 handleFoeSpaceShipDestroyed(
			damagedFoeSpaceShip,
			loadedAssets,
			scoreTextSprite
		);
	
	if (explodedFireball.name === 'fireballSprite')		// the mainSpaceShip may also collide a foe
		removeFireBallFromStage(						// (then the mainSpaceShipSprite is aliased as the "fireball")
			explodedFireball
		)
}

/**
 * @method handleFoeSpaceShipDestroyed
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {Array<Object>} loadedAssets
 * @param {PIXI.Text} scoreTextSprite
 * @return Void
 */
const handleFoeSpaceShipDestroyed = function(
		damagedFoeSpaceShip,
		loadedAssets,
		scoreTextSprite
	) {
	
	createGreenExplosion(
		damagedFoeSpaceShip,
		loadedAssets
	);
	
	// foeSpaceShipSprite removal from the gameLoop & scene
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsRegister.deleteItem(damagedFoeSpaceShip.UID);
	// @ts-ignore UID is inherited
	GameLoop().markCollisionTestsForRemoval(Player().foeSpaceShipsTweensRegister.getItem(damagedFoeSpaceShip.UID).collisionTestsRegister);
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsTweensRegister.deleteItem(damagedFoeSpaceShip.UID);
	
	GameLoop().removeSpriteFromScene(damagedFoeSpaceShip);
	
	if (Math.random() <= damagedFoeSpaceShip.lootChance) {
		handleLoot(
			damagedFoeSpaceShip,
			loadedAssets
		);
	}
	
	// prepare to load more foeSpaceShips
	occupiedCells[damagedFoeSpaceShip.cell.x][damagedFoeSpaceShip.cell.y] = false;
	GameState().currentScore += gameConstants.foeDescriptors[damagedFoeSpaceShip.foeType].pointsPrize;
	// @ts-ignore PIXI.Text is a mocked type
	scoreTextSprite.text = GameState().currentScore.toString().padStart(4, '0')
	
	GameLoop().trigger('foeSpaceShipDestroyed');
}

/**
 * @method handleFoeSpaceShipDestroyed
 * @param {Projectile} explodedFireball
 * @return Void
 */
const removeFireBallFromStage = function(
		explodedFireball
	) {
	let spritePos = CoreTypes.fireballsRegister.indexOf(explodedFireball);
	CoreTypes.fireballsRegister.splice(spritePos, 1);
	GameLoop().removeTween(CoreTypes.fireballsTweensRegister[spritePos]);
	CoreTypes.fireballsTweensRegister.splice(spritePos, 1);
	
	GameLoop().removeSpriteFromScene(explodedFireball, true);		// might fail if already collided => noError
}

/**
 * @method handleFoeSpaceShipDestroyed
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {Array<Object>} loadedAssets
 * @return Void
 */
const handleLoot = function(
		damagedFoeSpaceShip,
		loadedAssets
	) {
	
	const lootSprite = createLoot(
		damagedFoeSpaceShip,
		loadedAssets
	);
	
	// There has already been enough loots of a certain type
	if (typeof lootSprite === 'undefined')
		return;
	else
		// @ts-ignore FIXME: lootType should be Union {'madikit' | 'powerUp'}
		GameState().currentLootCount[lootSprite.lootType]++;
	
	// @ts-ignore :expected {Sprite}, given {LootSprite} => TS doesn't understand anything to prototype inheritance...
	const mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(Player().mainSpaceShip, lootSprite, 'powerUp');
	// we chose not to append the new collisionTest synchronously,
	// but raher to wait for the next frame : appending it synchronlously 
	// has caused us a lot of false tracks when debugging
	CoreTypes.tempAsyncCollisionsTests.push(mainSpaceShipCollisionTest);
}


/**
 * @method handleMainSpaceShipDamaged
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {Array<Object>} loadedAssets
 * @param {TilingSprite} statusBarSprite
 * @param {PIXI.Text} currentLevelText
 * @param {PIXI.Text} scoreTextSprite
 * @return Void
 */
const handleMainSpaceShipDamaged = function(
		damagedFoeSpaceShip,
		loadedAssets,
		statusBarSprite,
		currentLevelText,
		scoreTextSprite
	) {
	
	Player().mainSpaceShip.lifePoints--;

	activateShield(
		Player().mainSpaceShip,
		loadedAssets
	);

	createSmallExplosion(
		// @ts-ignore FIXME: HACK
		{
			x : Player().mainSpaceShip.x + Player().mainSpaceShip.width / 2,
			y : Player().mainSpaceShip.y + Player().mainSpaceShip.height / 1.8,
			width : Player().mainSpaceShip.width / 2,
			height : 0
		},
		loadedAssets
	);
	
	
	
	if (Player().mainSpaceShip.lifePoints === 0)
		 handleMainSpaceShipDestroyed(
			loadedAssets,
			statusBarSprite,
			currentLevelText
		);
	else {
		// only if we're not dead, visually decrement the life-bar
		// @ts-ignore tilePositionX is inherited
		statusBarSprite.tilePositionX = statusBarSprite.tilePositionX - 470;
		
		handleFoeSpaceShipDamaged(
			damagedFoeSpaceShip,
			// @ts-ignore FIXME: HACK
			{
				damage : 1
			},
			loadedAssets,
			scoreTextSprite
		);
	}
}


/**
 * @method handleMainSpaceShipDestroyed
 * @param {Array<Object>} loadedAssets
 * @param {TilingSprite} statusBarSprite
 * @param {PIXI.Text} currentLevelText
 * @return Void
 */
const handleMainSpaceShipDestroyed = function(
		loadedAssets,
		statusBarSprite,
		currentLevelText
	) {
	
	GameLoop().removeSpriteFromScene(Player().mainSpaceShip);
	GameLoop().removeSpriteFromScene(statusBarSprite);
	GameLoop().stage.removeChild(currentLevelText);
		// noError: hard to say why the level-text isn't anymore in the scene sometimes...
	
	// Temporary hack to shw the animation before stopping
	setTimeout(function() {
		GameLoop().stop();
	},1024)
	
	
	// can't remove collision test while looping
//	GameLoop().removeAllCollisionTests();
	
	createYellowExplosion(
		Player().mainSpaceShip,
		loadedAssets
	);
}

/**
 * @method handlePowerUp
 * @param {LootSprite} lootSprite
 * @param {TilingSprite} statusBarSprite
 * @return Void
 */
const handlePowerUp = function(
		lootSprite,
		statusBarSprite
	) {
	
	// @ts-ignore
	const tween = CoreTypes.disposableTweensRegister.findObjectByValue('lootSprite', lootSprite).lootTween;
	if (tween)		// let's assume that can fail...  for now...
		GameLoop().removeTween(tween);
		
	GameLoop().removeSpriteFromScene(lootSprite);
	
	switch(lootSprite.lootType) {
		case 'medikit':
			if (Player().mainSpaceShip.lifePoints < gameConstants.mainSpaceShipLifePoints[GameState().currentLevel]) {
				Player().mainSpaceShip.lifePoints++;
				// @ts-ignore tilePositionX is inherited
				statusBarSprite.tilePositionX += 470;
			}
			break;
		case 'weapon':
			// FIXME: don't like declaring Object props as {Number}
			if (typeof gameConstants.weapons[++GameState().currentWeapon] === 'undefined')
				GameState().currentWeapon--;
		default:
			break;
	}
}

/**
 * @method handleFoeSpaceShipOutOfScreen
 * @param {FoeSpaceShip} spaceShipSprite
 * @return Void
 */
const handleFoeSpaceShipOutOfScreen = function(
		spaceShipSprite
	) {
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsRegister.deleteItem(spaceShipSprite.UID);
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsTweensRegister.deleteItem(spaceShipSprite.UID);
	// @ts-ignore UID is inherited
	GameLoop().removeTween(Player().foeSpaceShipsTweensRegister.getItem(spaceShipSprite.UID));
	
	GameLoop().removeSpriteFromScene(spaceShipSprite, true);		// might fail if already destroyed => noError
}


/**
 * @method handleFireballOutOfScreen
 * @param {Projectile} fireballSprite
 * @return Void
 */
const handleFireballOutOfScreen = function(
		fireballSprite
	) {
	removeFireBallFromStage(
		fireballSprite
	);
}


/**
 * @method handleMainSpaceShipOutOfScreen
 * @param {CoreTypes.Dimension} windowSize
 * @return Void
 */
const handleMainSpaceShipOutOfScreen = function(
		windowSize
	) {
	
	if (Player().mainSpaceShip.x > windowSize.x.value)
		Player().mainSpaceShip.x -= Player().mainSpaceShip.width * 2;
	else if (Player().mainSpaceShip.x + Player().mainSpaceShip.width < 0)
		Player().mainSpaceShip.x += Player().mainSpaceShip.width * 2;
	else if (Player().mainSpaceShip.y > windowSize.y.value)
		Player().mainSpaceShip.y -= Player().mainSpaceShip.height * 2;
}


/**
 * @method handleDisposableSpriteAnimationEnded
 * @param {Sprite} sprite
 * @return Void
 */
const handleDisposableSpriteAnimationEnded = function(sprite) {
	let spritePos = CoreTypes.disposableSpritesRegister.indexOf(sprite);
	
	if (spritePos === -1) {
		console.warn('a disposable FX wasn\'t found in the register for deletion', spritePos, sprite);
		return;
	}
	CoreTypes.disposableSpritesRegister.splice(spritePos, 1);
	
	GameLoop().removeSpriteFromScene(sprite, true); // noError: we found a weird bug on destructing the mainSpaceShip
}


/**
 * @method createSmallExplosion
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {Array<Object>} loadedAssets
 * @return Void
 */
const createSmallExplosion = function(
		damagedFoeSpaceShip,
		loadedAssets
	) {
	const explosion = new ExplosionSprite(
		new CoreTypes.Point(
			damagedFoeSpaceShip.x + getRandomExplosionOffset(damagedFoeSpaceShip.width),		// ExplosionSprite has a 0.5 anchor
			damagedFoeSpaceShip.y + damagedFoeSpaceShip.height - getRandomExplosionOffset(damagedFoeSpaceShip.height) - 84								// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
		),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[2].impactTilemap,
		new CoreTypes.Dimension(32, 32)
	);
	const explosionTween = new TileToggleTween(
		windowSize,
		// @ts-ignore : TS doesn't understand anything to prototypal inheritance
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
	
	GameLoop().addAnimatedSpriteToScene(explosion, explosionTween);
	CoreTypes.disposableSpritesRegister.push(explosion);
}

/**
 * @method createGreenExplosion
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {Array<Object>} loadedAssets
 * @return Void
 */
const createGreenExplosion = function(
		damagedFoeSpaceShip,
		loadedAssets
	) {
	
	const startPosition = new CoreTypes.Point(
		damagedFoeSpaceShip.x + getRandomExplosionOffset(damagedFoeSpaceShip.width / 4),		// ExplosionSprite has a 0.5 anchor
		damagedFoeSpaceShip.y - getRandomExplosionOffset(damagedFoeSpaceShip.height / 8)
	);
	
	const explosion = new ExplosionSprite(
		startPosition,
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[2].greenExplosionTilemap,
		null
	);
	// @ts-ignore scaleX is inherited
	explosion.scaleX = 1.5;
	// @ts-ignore scaleY is inherited
	explosion.scaleY = 1.5;
	
	const explosionTween = new TileToggleTween(
		windowSize,
		// @ts-ignore : TS doesn't understand anything to prototypal inheritance
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
	
	GameLoop().addAnimatedSpriteToScene(explosion, explosionTween);
	CoreTypes.disposableSpritesRegister.push(explosion);
}

/**
 * @method createYellowExplosion
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {Array<Object>} loadedAssets
 * @return Void
 */
const createYellowExplosion = function(
		damagedFoeSpaceShip,
		loadedAssets
	) {
	
	const explosion = new ExplosionSprite(
		new CoreTypes.Point(
			damagedFoeSpaceShip.x + damagedFoeSpaceShip.width / 2 + getRandomExplosionOffset(damagedFoeSpaceShip.width / 4),		// ExplosionSprite has a 0.5 anchor
			damagedFoeSpaceShip.y + damagedFoeSpaceShip.height / 2 - getRandomExplosionOffset(damagedFoeSpaceShip.height / 8)
		),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[2].yellowExplosionTilemap,
		null
	);
	// @ts-ignore
	explosion.scaleX = 2;
	// @ts-ignore
	explosion.scaleY = 2;
	
	const explosionTween = new TileToggleTween(
		windowSize,
		// @ts-ignore : TS doesn't understand anything to prototypal inheritance
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
	
	GameLoop().addAnimatedSpriteToScene(explosion, explosionTween);
	CoreTypes.disposableSpritesRegister.push(explosion);
}

/**
 * @method activateShield
 * @param {Sprite} spaceShip
 * @param {Array<Object>} loadedAssets
 * @return Void
 */
const activateShield = function(
		spaceShip,
		loadedAssets
	) {
	
	let zoom = 1;
	let shieldPosition;
	if (spaceShip.name === 'mainSpaceShipSprite'		// mainSpaceShipSprite doesn't have a spriteObj prop
		|| (spaceShip.spriteObj.anchor.x === 1
			&& spaceShip.spriteObj.anchor.y === 1)) {
		shieldPosition = new CoreTypes.Point(
			spaceShip.x + spaceShip.width / 2,
			spaceShip.y + spaceShip.height / 2
		);
	}
	else if (spaceShip.spriteObj.anchor.x === .5
		&& spaceShip.spriteObj.anchor.y === .5) {
		shieldPosition = new CoreTypes.Point(
			spaceShip.x,
			spaceShip.y
		);
	}
	
	const shield = new ExplosionSprite(
		shieldPosition,
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[2].shieldTilemap,
		new CoreTypes.Dimension(200, 200)
	);
	shield.name = 'shieldSprite';
	// @ts-ignore zoom is inherited
	shield.zoom = zoom;
	
	const shieldTween = new TileToggleTween(
		windowSize,
		// @ts-ignore : TS doesn't understand anything to prototypal inheritance
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
	
	GameLoop().addAnimatedSpriteToScene(shield, shieldTween);
	CoreTypes.disposableSpritesRegister.push(shield);
}

/**
 * @method createLoot
 * @param {FoeSpaceShip} foeSpaceShip
 * @param {Array<Object>} loadedAssets
 * @return {LootSprite}
 */
const createLoot = function(
		foeSpaceShip,
		loadedAssets
	) {
	
	const lootTextureName = gameConstants.lootSpritesTextures[getRandomLootType()];
	
	if (GameState().currentLootCount[lootTextureName] === gameConstants.maxLootsByType[lootTextureName])
		return;
	
		
	const loot = new LootSprite(
		new CoreTypes.Point(
			foeSpaceShip.x,
			foeSpaceShip.y
		),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[2][lootTextureName + 'Tilemap'],
		lootTextureName
	);
	
	const lootTween = new Tween(
		windowSize,
		// @ts-ignore : TS doesn't understand anything to prototypal inheritance
		loot,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(0, 7),
		.1,
		false
	);
	GameLoop().addAnimatedSpriteToScene(loot, lootTween);
	
	CoreTypes.disposableTweensRegister.push({
		lootSprite : loot,
		lootTween : lootTween
	});
	
	return loot;
}




/**
 * @method shouldChangeLevel
 * @param {PIXI.Text} currentLevelText
 * @param {() => Void} addFoeSpaceShips
 * @return Void
 */
const shouldChangeLevel = function (currentLevelText, addFoeSpaceShips) {
	if (Object.keys(Player().foeSpaceShipsRegister.cache).length === 1
		&& GameState().currentLevel < 6) {
		
		if (GameState().currentScore >= gameConstants.levels[GameState().currentLevel.toString()].requiredPointsToStepUp) {
			GameState().currentLevel++;
			GameState().currentLootCount.medikit = 0;
			GameState().currentLootCount.weapon = 0;
			// @ts-ignore PIXI.Text is a mocked type
			currentLevelText.text = GameState().currentLevel;
			addFoeSpaceShips();
		}
		else
			addFoeSpaceShips();
	}
}

/**
 * @method getRandomFoe
 * @param {Number} count
 */
function getRandomFoe(count) {
	return Math.floor(Math.random() * count).toString();
}

/**
 * @method getRandomLootType
 * @return {'0'|'1'|'2'|'3'}
 */
function getRandomLootType() {
	// @ts-ignore TS doesn't understand the algo
	return (Math.floor(Math.random() * 1.9)).toString(); // shall be Math.floor(Math.random() * lootTypesCount)
}

/**
 * @method getRandomExplosionOffset
 * @param {Number} shipDimension
 */
function getRandomExplosionOffset(shipDimension) {
	return Math.round((Math.random() - .5) * shipDimension / 2);
}


let counter = 0;

/**
 * @method addUIDMarkerToEntity
 * Helper method for debug
 * @param {Sprite} sprite
 * @param {Number} offset
 * @param {String} text
 * @return Void
 */
function addUIDMarkerToEntity(
		sprite,
		offset,
		text
	) {
	
	offset = offset || 0;
	text = text || '';
	// @ts-ignore
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
	currentLevelText.text = counter++ + ' ' + sprite.UID + ' ' + (GameLoop().currentTime / 1000).toString().slice(0, 4) + ' ' + text;
	
	
	const textTween = new Tween(
		windowSize,
		currentLevelText,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(0, 7),
		.1,
		false
	);
	
	GameLoop().pushTween(textTween);
	GameLoop().addSpriteToScene(currentLevelText);
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