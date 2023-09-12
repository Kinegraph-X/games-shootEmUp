 
 /**
 * @typedef {Object} PIXI.Text
 * @typedef {import('src/GameTypes/interfaces/Wounder')} Wounder
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 * @typedef {import('src/GameTypes/sprites/TilingSprite')} TilingSprite
 * @typedef {import('src/GameTypes/sprites/FoeSpaceShip')} FoeSpaceShip
 * @typedef {import('src/GameTypes/sprites/Projectile')} Projectile
 * @typedef {import('src/GameTypes/sprites/StatusBarSprite')} StatusBarSprite
 */

/**
 * @singleton
 * Rules for the actual game
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const {levels, foeDescriptors, mainSpaceShipLifePoints, lootSpritesTextures, maxLootsByType, weapons, objectTypes} = require('src/GameTypes/gameSingletons/gameConstants');
const {windowSize, occupiedCells} = require('src/GameTypes/grids/gridManager');
const ruleSet = require('src/GameTypes/gameSingletons/gameRules');
const GameState = require('src/GameTypes/gameSingletons/GameState');
const GameLoop = require('src/GameTypes/gameSingletons/GameLoop');

const ExplosionSprite = require('src/GameTypes/sprites/ExplosionSprite');
const LootSprite = require('src/GameTypes/sprites/LootSprite');

const GameObjectsFactory = require('src/GameTypes/factories/GameObjectsFactory');

const Tween = require('src/GameTypes/tweens/Tween');
const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');
const CoolDownTween = require('src/GameTypes/tweens/CoolDownTween'); 
const CooledDownPropFadeToggleTween = require('src/GameTypes/tweens/CooledDownPropFadeToggleTween');
const DelayedCooledDownPropFadeToggleTween = require('src/GameTypes/tweens/DelayedCooledDownPropFadeToggleTween');

const mainSpaceShipCollisionTester = require('src/GameTypes/collisionTests/mainSpaceShipCollisionTester');

const Player = require('src/GameTypes/gameSingletons/Player');





/**
 * @method handleFoeSpaceShipDamaged
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {Projectile} explodedFireball
 * @param {PIXI.Text} scoreTextSprite
 * @return Void
 */
const handleFoeSpaceShipDamaged = function(
		damagedFoeSpaceShip,
		explodedFireball,
		scoreTextSprite
	) {
		
	// Avoid potential double deletion when collided twice in the same frame
	// @ts-ignore lifePoints is inherited
	if (damagedFoeSpaceShip.hasBeenDestroyed()
		&& explodedFireball.name === 'fireballSprite') {	// Test the "name" prop : the mainSpaceShip may also collide a foe
		removeFireBallFromStage(explodedFireball);			// (then the mainSpaceShipSprite is positionned
		return;
	}
	
	if (damagedFoeSpaceShip.hasShield)
		GameObjectsFactory().newObject(objectTypes.shield, true, [], damagedFoeSpaceShip);

	damagedFoeSpaceShip.handleDamage(explodedFireball);
	
	GameObjectsFactory().newObject(objectTypes.smallExplosion, true, [], damagedFoeSpaceShip);
	
	// @ts-ignore lifePoints is inherited
	if (damagedFoeSpaceShip.hasBeenDestroyed())
		 handleFoeSpaceShipDestroyed(
			damagedFoeSpaceShip,
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
 * @param {PIXI.Text} scoreTextSprite
 * @return Void
 */
const handleFoeSpaceShipDestroyed = function(
		damagedFoeSpaceShip,
		scoreTextSprite
	) {
	
	GameObjectsFactory().newObject(objectTypes.greenExplosion, true, [], damagedFoeSpaceShip);
	GameObjectsFactory().newObject(objectTypes.plasmaBlast, true, [], damagedFoeSpaceShip);
	
	// foeSpaceShipSprite removal from the gameLoop & scene
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsRegister.deleteItem(damagedFoeSpaceShip.UID);
	
	// @ts-ignore UID is inherited
	GameLoop().markCollisionTestsForRemoval(Player().foeSpaceShipsTweensRegister.getItem(damagedFoeSpaceShip.UID).collisionTestsRegister);
	
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsCollisionTestsRegister.deleteItem(damagedFoeSpaceShip.UID);
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsTweensRegister.deleteItem(damagedFoeSpaceShip.UID);
	
	// Remove recurring fireball tween
	if (parseInt(damagedFoeSpaceShip.foeType) > 0) {
		// @ts-ignore UID is inherited
		GameLoop().removeTween(CoreTypes.fromFoesFireballRecurringTweensRegister.getItem(damagedFoeSpaceShip.UID))
		// @ts-ignore UID is inherited
		CoreTypes.fromFoesFireballRecurringTweensRegister.deleteItem(damagedFoeSpaceShip.UID);
	}
	
	GameLoop().removeSpriteFromScene(damagedFoeSpaceShip);
	
	if (Math.random() <= damagedFoeSpaceShip.lootChance)
		handleLoot(damagedFoeSpaceShip);
	
	// clean grid cell to be able to load more foeSpaceShips
	occupiedCells[damagedFoeSpaceShip.cell.x][damagedFoeSpaceShip.cell.y] = false;
	GameState().incrementScore(foeDescriptors[damagedFoeSpaceShip.foeType].pointsPrize);
	// @ts-ignore PIXI.Text is a mocked type
	scoreTextSprite.text = GameState().getCurrentScoreAsFormattedString();
	GameLoop().trigger('foeSpaceShipDestroyed');
}




/**
 * @method handleMainSpaceShipHit
 * A different method than the handleMainSpaceShipDamaged,
 * as the "damaged" method expects the collided Sprite
 * to be a FoeSpaceShip (and hence, to be damageable...)
 * @param {Projectile} foeFireball
 * @param {StatusBarSprite} statusBar
 * @return Void
 */
const handleMainSpaceShipHit = function(
		foeFireball,
		statusBar
	) {
	removeFireBallFromStage(foeFireball);
	Player().mainSpaceShip.decrementHealth();
	GameObjectsFactory().newObject(objectTypes.shield, true, [], Player().mainSpaceShip);
	handleInvicibleMainSpaceShip();
	
	if (Player().mainSpaceShip.hasBeenDestroyed()) {
		handleMainSpaceShipDestroyed(statusBar);
	}
	else {
		// only if we're NOT dead, visually decrement the life-bar (else we hide it, for now)
		// @ts-ignore tilePositionX is inherited
		statusBar.decrementHealth();
		createBlinkingSpaceShip(Player().mainSpaceShip);
	}
}

/**
 * @method handleMainSpaceShipDamaged
 * @param {FoeSpaceShip} damagedFoeSpaceShip
 * @param {StatusBarSprite} statusBar
 * @return Void
 */
const handleMainSpaceShipDamaged = function(
		damagedFoeSpaceShip,
		statusBar
	) {
	Player().mainSpaceShip.decrementHealth();
	
	GameObjectsFactory().newObject(objectTypes.shield, true, [], Player().mainSpaceShip);
	GameObjectsFactory().newObject(
		objectTypes.smallExplosion,
		true,
		[],
		// @ts-ignore FIXME: HACK
		{
			x : Player().mainSpaceShip.x + Player().mainSpaceShip.width / 2,
			y : Player().mainSpaceShip.y + Player().mainSpaceShip.height / 1.8,
			width : Player().mainSpaceShip.width / 2,
			height : 0
		}
	);
	
	handleInvicibleMainSpaceShip();
	handleFoeSpaceShipDamaged(
		damagedFoeSpaceShip,
		// @ts-ignore FIXME: HACK
		{
			damage : 1
		},
		statusBar.textForScoreSpriteObj[1]
	);
	
	if (Player().mainSpaceShip.hasBeenDestroyed()) {
		handleMainSpaceShipDestroyed(statusBar);
	}
	else {
		// only if we're NOT dead, visually decrement the life-bar (else we hide it, for now)
		// @ts-ignore tilePositionX is inherited
		statusBar.decrementHealth();
		createBlinkingSpaceShip(Player().mainSpaceShip);
	}
}


/**
 * @method handleMainSpaceShipDestroyed
 * @param {StatusBarSprite} statusBar
 * @return Void
 */
const handleMainSpaceShipDestroyed = function(
		statusBar
	) {
	GameLoop().gameOver = true;
	// GAME OVER TITLE
	GameObjectsFactory().newObject(objectTypes.title, true, ['Game Over']);
	
	GameLoop().markCollisionTestsForRemoval(Object.values(Player().foeSpaceShipsCollisionTestsRegister.cache));
	GameLoop().removeSpriteFromScene(Player().mainSpaceShip);		// noError: seems we have a bug, unknown after a round of exploring the code
	GameLoop().removeSpriteFromScene(statusBar.gameStatusSpriteObj);
	GameLoop().stage.removeChild(statusBar.textForLevelSpriteObj);
	
	// Temporary hack to shw the animation before stopping
	setTimeout(function() {
		GameLoop().stop();
	},1024)
	
	
	// can't remove collision test while looping
//	GameLoop().removeAllCollisionTests();
	
	GameObjectsFactory().newObject(objectTypes.yellowExplosion, true, [], Player().mainSpaceShip);
}

/**
 * @mthod handleInvicibleSpaceShip
 */
const handleInvicibleMainSpaceShip = function() {
	GameLoop().markCollisionTestsForRemoval(Object.values(Player().foeSpaceShipsCollisionTestsRegister.cache));
	Player().foeSpaceShipsCollisionTestsRegister.reset();
	
	for (let foeSpaceShipSpriteObj of Object.values(Player().foeSpaceShipsRegister.cache)) {
		Player().foeSpaceShipsTweensRegister.cache[foeSpaceShipSpriteObj.UID].collisionTestsRegister = 
			// We'll loop through all the tests, including those against projectiles.
			// It's not efficient, but do we have a reference to the specific test in the scope ? Seems not...
			Player().foeSpaceShipsTweensRegister.getItem(foeSpaceShipSpriteObj.UID).collisionTestsRegister.filter(function(/** @type {mainSpaceShipCollisionTester}*/test) {
				if (test.type === 'hostile')
					return false;
				return true;
			});
	}
}

/**
 * @mthod handleDamageableSpaceShip
 */
const handleDamageableMainSpaceShip = function() {
	let mainSpaceShipCollisionTest;
	for (let foeSpaceShipSpriteObj of Object.values(Player().foeSpaceShipsRegister.cache)) {
		mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(Player().mainSpaceShip, foeSpaceShipSpriteObj, 'hostile');
		Player().foeSpaceShipsCollisionTestsRegister.setItem(foeSpaceShipSpriteObj.UID, mainSpaceShipCollisionTest);
		CoreTypes.tempAsyncCollisionsTests.push(mainSpaceShipCollisionTest);
		// @ts-ignore  UID is inherited
		Player().foeSpaceShipsTweensRegister.getItem(foeSpaceShipSpriteObj.UID).collisionTestsRegister.push(mainSpaceShipCollisionTest);
	}
}

/**
 * @method handlePowerUp
 * @param {LootSprite} lootSprite
 * @param {StatusBarSprite} statusBarSprite
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
			if (Player().mainSpaceShip.getHealth() < mainSpaceShipLifePoints[GameState().currentLevel]) {
				Player().mainSpaceShip.incrementHealth();
				// @ts-ignore tilePositionX is inherited
				statusBarSprite.incrementHealth();
			}
			break;
		case 'weapon':
			// FIXME: don't like declaring Object props as {Number}
			if (typeof weapons[++GameState().currentWeapon] === 'undefined')
				--GameState().currentWeapon;
			break;
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
 * Funny solution to handle the spaceShip being to away from the scene
 * => just replace it back at a potentially dangerous position in game
 * @return Void
 */
const handleMainSpaceShipOutOfScreen = function() {
	if (Player().mainSpaceShip.x > GameLoop().windowSize.x.value)
		Player().mainSpaceShip.x -= Player().mainSpaceShip.width * 2;
	else if (Player().mainSpaceShip.x + Player().mainSpaceShip.width < 0)
		Player().mainSpaceShip.x += Player().mainSpaceShip.width * 2;
	else if (Player().mainSpaceShip.y > GameLoop().windowSize.y.value)
		Player().mainSpaceShip.y -= Player().mainSpaceShip.height * 2;
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
 * @return Void
 */
const handleLoot = function(
		damagedFoeSpaceShip
	) {
	
	let lootSprite = GameObjectsFactory().newObject(objectTypes.loot, true, [], damagedFoeSpaceShip);
	
	// There has already been enough loots of a certain type
	if (typeof lootSprite === 'undefined')
		return;
	else
		// @ts-ignore FIXME: lootType should be Union {'madikit' | 'powerUp'}
		GameState().currentLootCount[lootSprite.lootType]++;
	
	// @ts-ignore :expected {Sprite}, given {LootSprite} => TS doesn't understand anything to prototype inheritance...
	const mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(Player().mainSpaceShip, lootSprite, 'powerUp');
	// we chose to wait for the next frame : appending it synchronlously 
	// has caused us a lot of false tracks when debugging
	CoreTypes.tempAsyncCollisionsTests.push(mainSpaceShipCollisionTest);
}


/**
 * @method handleDisposableSpriteAnimationEnded
 * @param {Tween} tween
 * @return Void
 */
const handleDisposableSpriteAnimationEnded = function(tween) {
	// CooldownTweens don't imply removing the sprite from the scene
	// @ts-ignore objectType: implicit inheritance
	if (tween instanceof CoolDownTween)
		return;
	
	let spritePos = CoreTypes.disposableSpritesRegister.indexOf(tween.target);
	
	if (spritePos === -1) {
		console.warn('a disposable FX wasn\'t found in the register for deletion', spritePos, tween.target);
		return;
	}
	CoreTypes.disposableSpritesRegister.splice(spritePos, 1);
	
	GameLoop().removeSpriteFromScene(tween.target, true); // noError: we found a weird bug on destructing the mainSpaceShip
}



/**
 * @method createBlinkingSpaceShip
 * @param {Sprite} spaceShip
 * @return Void
 */
const createBlinkingSpaceShip = function(
	spaceShip
) {
	const blinkTween = new CooledDownPropFadeToggleTween(
		spaceShip,
		CoreTypes.TweenTypes.add,
		'alpha',
		-1,
		90,
		handleDamageableMainSpaceShip,
		15
	);
	GameLoop().pushTween(blinkTween);
}








/**
 * @method shouldChangeLevel
 * @param {PIXI.Text} currentLevelText
 * @param {() => Void} addFoeSpaceShips
 * @return Void
 */
const shouldChangeLevel = function (currentLevelText, addFoeSpaceShips) {
	if (Object.keys(Player().foeSpaceShipsRegister.cache).length === 1
		&& GameState().getCurrentLevel() < 6) {
		
		if (GameState().getCurrentScore() >= levels[GameState().getCurrentLevelAsString()].requiredPointsToStepUp) {
			GameState().incrementLevel();
			GameState().currentLootCount.medikit = 0;
			GameState().currentLootCount.weapon = 0;
			// @ts-ignore PIXI.Text is a mocked type
			currentLevelText.text = GameState().getCurrentLevelAsString();
			addFoeSpaceShips();
		}
		else
			addFoeSpaceShips();
	}
	else if (Object.keys(Player().foeSpaceShipsRegister.cache).length === 0
		&& GameState().getCurrentLevel() === 6)
		// YOU WIN TITLE
		GameObjectsFactory().newObject(objectTypes.title, true, ['YOU WIN']);
}





let counter = 0;
/**
 * @method addUIDMarkerToEntity
 * Helper method for debugging
 * @param {Sprite} sprite
 * @param {Number} offset
 * @param {String} text
 * @return Void
 */
function addUIDMarkerToEntity(
		sprite,
		offset = 0,
		text = ''
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
	// @ts-ignore PIXI types are mocked
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
	GameLoop().stage.addChild(currentLevelText);
}





module.exports = {
	handleFoeSpaceShipDamaged,
	handleFoeSpaceShipOutOfScreen,
	handleMainSpaceShipHit,
	handleMainSpaceShipDamaged,
	handleFireballOutOfScreen,
	handleMainSpaceShipOutOfScreen,
	handleDisposableSpriteAnimationEnded,
	shouldChangeLevel,
	handlePowerUp
};