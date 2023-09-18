const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');

const AssetsLoader = require('src/GameTypes/gameSingletons/AssetsLoader');
/** @type {Array<Object>} */
let loadedAssets = null;
AssetsLoader.then(function(loadedBundles) {
	loadedAssets = loadedBundles;
});

const {levels, mainSpaceShipLifePoints, lootSpritesTextures, maxLootsByType, objectTypes, plasmaBlastDescriptors} = require('src/GameTypes/gameSingletons/gameConstants');
const {windowSize, cellSize, gridCoords, getFoeCell} = require('src/GameTypes/grids/gridManager');

const Player = require('src/GameTypes/gameSingletons/Player');
let GameState = require('src/GameTypes/gameSingletons/GameState');
const GameLoop = require('src/GameTypes/gameSingletons/GameLoop');

const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');

const GameTitleSprite = require('src/GameTypes/sprites/GameTitleSprite');
const MainSpaceShip = require('src/GameTypes/sprites/MainSpaceShip');
const FoeSpaceShip = require('src/GameTypes/sprites/FoeSpaceShip');
const BossSpaceShip = require('src/GameTypes/sprites/BossSpaceShip');
const StatusBarSprite = require('src/GameTypes/sprites/StatusBarSprite');
const ExplosionSprite = require('src/GameTypes/sprites/ExplosionSprite');
const LootSprite = require('src/GameTypes/sprites/LootSprite');
const BlastSprite = require('src/GameTypes/sprites/BlastSprite');
const BigShield = require('src/GameTypes/sprites/BigShield');
const BigExplosion = require('src/GameTypes/sprites/BigExplosion');

const Tween = require('src/GameTypes/tweens/Tween');
const TileTween = require('src/GameTypes/tweens/TileTween');
const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');
const DelayedCooledDownPropFadeToggleTween = require('src/GameTypes/tweens/DelayedCooledDownPropFadeToggleTween');

const ProjectileFactory = require('src/GameTypes/factories/ProjectileFactory');

/** 
 * @constructor GameObjectFactory
*/
const GameObjectFactory = function() {

}
//GameObjectFactory.prototype = {};

/**
 * @method newObject
 * @param {String} objectType
 * @param {boolean} [addToScene = true] addToScene
 * @param {Array<Number|String|Boolean>} [metadata = new Array()] metadata
 * @param {Sprite} [refToSprite = null] refToSprite
 * @return Void
 */
GameObjectFactory.prototype.newObject = function(objectType, addToScene, metadata, refToSprite) {
	switch (objectType) {
		case objectTypes.background:
			this.createBg();
			break;
		case objectTypes.title:
			// @ts-ignore: metadata[0] is {String}, not Union type 		// HACK: FIXME
			return this.createTitle(metadata[0], metadata[1]);
		case objectTypes.infiniteTitle:
			// @ts-ignore: metadata[0] is {String}, not Union type 		// HACK: FIXME
			return this.createInfiniteTitle(metadata[0]);
		case objectTypes.statusBar:
			return this.createStatusBar();
		case objectTypes.mainSpaceShip:
			return this.createMainSpaceShip();
		case objectTypes.projectiles:
			this.createProjectiles();
			break;
		case objectTypes.foeSpaceShip:
			return this.createFoeSpaceShip(metadata);
		case objectTypes.bossSpaceShip:
			return this.createBossSpaceShip(metadata);
		case objectTypes.shield:
			this.createShield(refToSprite);
			break;
		case objectTypes.smallExplosion:
			this.createSmallExplosion(refToSprite);
			break;
		case objectTypes.greenExplosion:
			this.createGreenExplosion(refToSprite);
			break;
		case objectTypes.yellowExplosion:
			this.createYellowExplosion(refToSprite);
			break;
		case objectTypes.bigShield:
			this.createBigShield(refToSprite);
			break;
		case objectTypes.bigExplosion:
			this.createBigExplosion(refToSprite);
			break;
		case objectTypes.loot:
			return this.createLoot(refToSprite);
		case objectTypes.plasmaBlast:
			// @ts-ignore: metadata[0] is {Boolean}, not Union type 		// HACK: FIXME
			this.createPlasmaBlast(refToSprite, metadata[0]);
			break;
		default:
			console.error('Attempting to create a game object with a name that has not been defined: ' + objectType)
	}
}

/**
 * @method createTitle
 * @param {String} text	
 * @param {Number|String|Boolean} fadeOut		// HACK: FIXME
 * @return {GameTitleSprite}
 */
GameObjectFactory.prototype.createTitle = function(text, fadeOut) {
	const title = new GameTitleSprite(
		GameLoop().windowSize,
		text
	);
	
	if (fadeOut) {
		const titleTween = new DelayedCooledDownPropFadeToggleTween(
			// @ts-ignore TS doesn't know a thing to prototypal inheritance
			title.spriteObj,
			CoreTypes.TweenTypes.add,
			'alpha',
			-1,
			120,
			function() {
				GameLoop().removeSpriteFromScene(title);
			},
			120,
			0
		);
		GameLoop().addAnimatedSpriteToScene(title, titleTween);
	}
	else
		GameLoop().addSpriteToScene(title);
	
	return title;
}

/**
 * @method createInfiniteTitle
 * @param {String} text	
 * @return {Array<GameTitleSprite|DelayedCooledDownPropFadeToggleTween>}
 */
GameObjectFactory.prototype.createInfiniteTitle = function(text) {
	const title = new GameTitleSprite(
		GameLoop().windowSize,
		text
	);
	
	const titleTween = new DelayedCooledDownPropFadeToggleTween(
		// @ts-ignore TS doesn't know a thing to prototypal inheritance
		title.spriteObj,
		CoreTypes.TweenTypes.add,
		'alpha',
		-1,
		+Infinity,
		function() {},
		120,
		0
	);
	GameLoop().addAnimatedSpriteToScene(title, titleTween);
	
	return [title, titleTween];
}

/**
 * @method createStatusBar
 * @return {StatusBarSprite}
 */
GameObjectFactory.prototype.createStatusBar = function() {
	const statusBar = new StatusBarSprite(
		GameLoop().windowSize,
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[0].statusBarHealth,
		// @ts-ignore type is unknown
		loadedAssets[0].statusBarShield
	);
	
	GameLoop().addSpriteToScene(statusBar.gameStatusHealthSpriteObj);
	GameLoop().addSpriteToScene(statusBar.gameStatusShieldSpriteObj);
	GameLoop().stage.addChild(statusBar.textForLevelSpriteObj);
	GameLoop().stage.addChild.apply(GameLoop().stage, statusBar.textForScoreSpriteObj);
	
	return statusBar;
}

/**
 * @method createProjectiles
 * @param {boolean} [fromFoe = false] fromFoe
 * @param {String} [foeUID = ''] foeUID
 * @param {Boolean} [isBoss = false] isBoss
 * @return Void
 */
GameObjectFactory.prototype.createProjectiles = function(fromFoe, foeUID, isBoss) {
	// This position shall be overridden in the projectile factory if we've passed a "fromFoe" flag
	const startPosition = new CoreTypes.Point(
			// @ts-ignore x is inherited
			Player().mainSpaceShip.x + Player().mainSpaceShip.defaultSpaceShipDimensions.x.value / 2,
			// @ts-ignore y is inherited
			Player().mainSpaceShip.y - ProjectileFactory.prototype.projectileDimensions.y.value + 92		// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
		);
	
	new ProjectileFactory(
		GameLoop().windowSize,
		loadedAssets,
		startPosition,
		fromFoe ? GameState().currentLevel - 1 : GameState().currentWeapon,
		fromFoe,
		foeUID,
		isBoss
	);
}

/**
 * @method createFoeSpaceShip
 * @param {Array<Number|String|Boolean>} metadata		// HACK: FIXME
 * The index 0 of metadata contains the number of shielded foes we've already created
 * @return {FoeSpaceShip}
 */
GameObjectFactory.prototype.createFoeSpaceShip = function(metadata) {
	const foeCell = getFoeCell();
	const foePosition = new CoreTypes.Point(
		gridCoords.x[foeCell.x] + cellSize / 2,
		gridCoords.y[foeCell.y] - cellSize * 2
	);
	const randomFoeSeed = GameState().currentLevel < 3 ? Object.keys(loadedAssets[1]).length - 4 : Object.keys(loadedAssets[1]).length - 3;
	const randomFoe = this.getRandomFoe(randomFoeSeed);
	const hasShield = parseInt(randomFoe) > 0 && metadata[0] <= levels[GameState().currentLevel].shieldedFoeCount - 1;
	
	const foeSpaceShip = new FoeSpaceShip(
		foePosition,
		foeCell,
		// @ts-ignore type is unknown
		loadedAssets[1]['foeSpaceShip0' + randomFoe + (hasShield ? 'Shielded' : '')],
		randomFoe
	);
	if (hasShield) {
		foeSpaceShip.hasShield = true;
		foeSpaceShip.damage = 2;
	}
	
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsRegister.setItem(foeSpaceShip.UID, foeSpaceShip);
	// @ts-ignore : TS doesn't understand anything to prototypal inheritance (foeSpaceShip IS an instance of a Sprite)
	const foeSpaceShipTween = new Tween(GameLoop().windowSize, foeSpaceShip, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 7), .1, false);
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsTweensRegister.setItem(foeSpaceShip.UID, foeSpaceShipTween);
	
	if (parseInt(randomFoe) % 2 === 1)
		// @ts-ignore UID is inherited
		this.createProjectiles(true, foeSpaceShip.UID);
	
	GameLoop().addAnimatedSpriteToScene(foeSpaceShip, foeSpaceShipTween);
	return foeSpaceShip;
}

/**
 * @method createBossSpaceShip
 * @param {Array<Number|String|Boolean>} metadata		// HACK: FIXME
 * The index 0 of metadata contains the number of shielded foes we've already created
 * @return {BossSpaceShip}
 */
GameObjectFactory.prototype.createBossSpaceShip = function(metadata) {
	let foeCell = getFoeCell();
	// Place it visible, although randomly
	foeCell = {
		x : foeCell.x < 3 
			? 3 
			: foeCell.x < 7 
				? foeCell.x
				: 7,
		y : 3
	};
	const foePosition = new CoreTypes.Point(
		gridCoords.x[foeCell.x] + cellSize / 2,
		gridCoords.y[foeCell.y] - cellSize * 2 + 100	// MAGIC NUMBER to go lower than the grid (Boss is too big to fit in)
	);
	
	const bossSpaceShip = new BossSpaceShip(
		foePosition,
		foeCell,
		// @ts-ignore prop unknown
		loadedAssets[2]['bossSpaceShip0' + GameState().currentLevel.toString()],
		(GameState().currentLevel + 1).toString() 		// foeType is minimum 2 as the Sprite can fire projectiles (auto removal of the recurring tween)
	);
	
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsRegister.setItem(bossSpaceShip.UID, bossSpaceShip);
	// @ts-ignore : TS doesn't understand anything to prototypal inheritance (bossSpaceShip IS an instance of a Sprite)
	const bossSpaceShipTween = new DelayedCooledDownPropFadeToggleTween(
			// @ts-ignore TS doesn't know a thing to prototypal inheritance
			bossSpaceShip,
			CoreTypes.TweenTypes.add,
			'x',
			-400,
			+Infinity,
			function() {},
			200,
			0
	);
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsTweensRegister.setItem(bossSpaceShip.UID, bossSpaceShipTween);
	GameLoop().addAnimatedSpriteToScene(bossSpaceShip, bossSpaceShipTween);
	
	// @ts-ignore UID is inherited
	this.createProjectiles(true, bossSpaceShip.UID, true);
	
	return bossSpaceShip;
}

/**
 * @method createMainSpaceShip
 * @return {MainSpaceShip}
 */
GameObjectFactory.prototype.createMainSpaceShip = function() {
	const mainSpaceShipStartPosition = new CoreTypes.Point(
		windowSize.x.value / 2 - MainSpaceShip.prototype.defaultSpaceShipDimensions.x.value / 2,
		windowSize.y.value - MainSpaceShip.prototype.defaultSpaceShipDimensions.y.value
	);
	const mainSpaceShipSprite = new MainSpaceShip(
		mainSpaceShipStartPosition,
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[1].mainSpaceShip,
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[3].flamesTilemap,
		mainSpaceShipLifePoints['1']
	);
	const flameTween = new TileToggleTween(
		GameLoop().windowSize,
		mainSpaceShipSprite.flameTileSprite,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(0, 83),
		.1,
		false,
		2,
		6,
		'',
		false
	);
	GameLoop().addAnimatedSpriteToScene(mainSpaceShipSprite, flameTween);
	
	return mainSpaceShipSprite;
}

/**
 * @method createBg
 * @return Void
 */
GameObjectFactory.prototype.createBg = function() {
	const bgZoom = 1.8;
	const worldMapBack = new TilingSprite(
		new CoreTypes.Dimension(GameLoop().windowSize.x.value, GameLoop().windowSize.y.value),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[0].bgBack,
		bgZoom,
		null
	);
	// @ts-ignore name is a convinience prop to bypass outOfScreen
	worldMapBack.name = 'bgLayer';
	
	const worldMapMiddle = new TilingSprite(
		new CoreTypes.Dimension(GameLoop().windowSize.x.value, GameLoop().windowSize.y.value),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[0].bgMiddle,
		1,
		null
	);
	// @ts-ignore name is a convinience prop to bypass outOfScreen
	worldMapMiddle.name = 'bgLayer';
	// @ts-ignore blendMode
	worldMapMiddle.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	const worldMapFront = new TilingSprite(
		new CoreTypes.Dimension(GameLoop().windowSize.x.value, GameLoop().windowSize.y.value),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[0].bgFront,
		.3,
		null
	);
	// @ts-ignore name is a convinience prop to bypass outOfScreen
	worldMapFront.name = 'bgLayer';
	// @ts-ignore blendMode
	worldMapFront.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	const worldMapBackTween = new TileTween(GameLoop().windowSize, worldMapBack, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 25), .1, false);
	const worldMapMiddleTween = new TileTween(GameLoop().windowSize, worldMapMiddle, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 12), .1, false);
	const worldMapFrontTween = new TileTween(GameLoop().windowSize, worldMapFront, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 3), .1, false);
	
	GameLoop().addAnimatedSpriteToScene(worldMapBack, worldMapBackTween);
	GameLoop().addAnimatedSpriteToScene(worldMapMiddle, worldMapMiddleTween);
	GameLoop().addAnimatedSpriteToScene(worldMapFront, worldMapFrontTween);
}

/**
 * @method createShield
 * @param {Sprite} spaceShip
 * @return Void
 */
GameObjectFactory.prototype.createShield = function(spaceShip) {
	let shieldPosition;
	
	if (spaceShip.objectType === 'MainSpaceShip') {
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
		loadedAssets[3].shieldTilemap,
		new CoreTypes.Dimension(200, 200)
	);
	shield.objectType = 'ShieldSprite';

	// @ts-ignore blendMode
	shield.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	const shieldTween = new TileToggleTween(
		GameLoop().windowSize,
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
 * @method createBigShield
 * @param {Sprite} spaceShip
 * @return Void
 */
GameObjectFactory.prototype.createBigShield = function(spaceShip) {
	let shieldPosition;
	
	shieldPosition = new CoreTypes.Point(
		spaceShip.x,
		spaceShip.y + 20  	// MAGIC NUMBER: shield is not quite centered on actual sprite images
	);
	
	const shield = new BigShield(
		shieldPosition
	);

	// @ts-ignore blendMode
	shield.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	const shieldTween = new TileToggleTween(
		GameLoop().windowSize,
		// @ts-ignore : TS doesn't understand anything to prototypal inheritance
		shield,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(0, 560),
		1,
		false,
		4,
		7,
		null,
		true
	);
	
	GameLoop().addAnimatedSpriteToScene(shield, shieldTween);
	CoreTypes.disposableSpritesRegister.push(shield);
}

/**
 * @method createBigExplosion
 * @param {Sprite} spaceShip
 * @return Void
 */
GameObjectFactory.prototype.createBigExplosion = function(spaceShip) {

	let explosionPosition = new CoreTypes.Point(
		spaceShip.x,
		spaceShip.y + 20  	// MAGIC NUMBER: explosion is not quite centered on actual sprite images
	);
	
	const explosion = new BigExplosion(
		explosionPosition
	);

	// @ts-ignore blendMode
	explosion.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	const explosionTween = new TileToggleTween(
		GameLoop().windowSize,
		// @ts-ignore : TS doesn't understand anything to prototypal inheritance
		explosion,
		CoreTypes.TweenTypes.add,
		new CoreTypes.Point(640, 0),
		1,
		false,
		9,
		15,
		null,
		true
	);
	
	GameLoop().addAnimatedSpriteToScene(explosion, explosionTween);
	CoreTypes.disposableSpritesRegister.push(explosion);
}

/**
 * @method createSmallExplosion
 * @param {Sprite} spaceShip
 * @return Void
 */
GameObjectFactory.prototype.createSmallExplosion = function(spaceShip) {
	const explosion = new ExplosionSprite(
		new CoreTypes.Point(
			spaceShip.x + this.getRandomExplosionOffset(spaceShip.width),		// ExplosionSprite has a 0.5 anchor
			spaceShip.y + spaceShip.height - this.getRandomExplosionOffset(spaceShip.height) - 84								// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
		),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[3].impactTilemap,
		new CoreTypes.Dimension(32, 32)
	);
	const explosionTween = new TileToggleTween(
		GameLoop().windowSize,
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
 * @param {Sprite} spaceShip
 * @return Void
 */
GameObjectFactory.prototype.createGreenExplosion = function(spaceShip) {
	const startPosition = new CoreTypes.Point(
		spaceShip.x + this.getRandomExplosionOffset(spaceShip.width / 4),		// ExplosionSprite has a 0.5 anchor
		spaceShip.y - this.getRandomExplosionOffset(spaceShip.height / 8)
	);
	
	const explosion = new ExplosionSprite(
		startPosition,
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[3].greenExplosionTilemap,
		null
	);
	// @ts-ignore scaleX is inherited
	explosion.scaleX = 1.5;
	// @ts-ignore scaleY is inherited
	explosion.scaleY = 1.5;
	
	const explosionTween = new TileToggleTween(
		GameLoop().windowSize,
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
 * @param {Sprite} spaceShip
 * @return Void
 */
GameObjectFactory.prototype.createYellowExplosion = function(spaceShip) {
	const explosion = new ExplosionSprite(
		new CoreTypes.Point(
			spaceShip.x + spaceShip.width / 2 + this.getRandomExplosionOffset(spaceShip.width / 4),		// ExplosionSprite has a 0.5 anchor
			spaceShip.y + spaceShip.height / 2 - this.getRandomExplosionOffset(spaceShip.height / 8)
		),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[3].yellowExplosionTilemap,
		null
	);
	// @ts-ignore
	explosion.scaleX = 2;
	// @ts-ignore
	explosion.scaleY = 2;
	
	const explosionTween = new TileToggleTween(
		GameLoop().windowSize,
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
 * @method createLoot
 * @param {Sprite} spaceShip
 * @return Void
 */
GameObjectFactory.prototype.createLoot = function(spaceShip) {
	const lootTextureName = lootSpritesTextures[this.getRandomLootType()];
	
	if (GameState().currentLootCount[lootTextureName] === maxLootsByType[lootTextureName])
		return;
	
		
	const loot = new LootSprite(
		new CoreTypes.Point(
			spaceShip.x,
			spaceShip.y
		),
		// @ts-ignore loadedAssets.prop unknown
		loadedAssets[3][lootTextureName + 'Tilemap'],
		lootTextureName
	);
	
	const lootTween = new Tween(
		GameLoop().windowSize,
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
 * @method createPlasmaBlast
 * @param {Sprite} spaceShip
 * @param {Boolean} isBoss
 * @return Void
 */
GameObjectFactory.prototype.createPlasmaBlast = function(spaceShip, isBoss) {
	const rotation = Math.random() * 360;
	for (let i = 0; i < 2; i++) {
		/** @type {BlastSprite} */
		let blast,
		/** @type {DelayedCooledDownPropFadeToggleTween} */
		blastTween;
		blast = new BlastSprite(
			new CoreTypes.Point(
				spaceShip.x,
				spaceShip.y
			),
			// @ts-ignore loadedAssets.prop unknown
			loadedAssets[0][plasmaBlastDescriptors[this.getBlastColor(spaceShip.foeType)][i]]
		);
		if (isBoss)
			blast.spriteObj.alpha = 1.75;
		// @ts-ignore TS doesn't know a thing to prototypal inheritance
		blast.scaleX = 1 + i;
		// @ts-ignore TS doesn't know a thing to prototypal inheritance
		blast.scaleY = 1 + i;
		// @ts-ignore TS doesn't know a thing to prototypal inheritance
		blast.rotation = rotation;
		blastTween = new DelayedCooledDownPropFadeToggleTween(
			// @ts-ignore TS doesn't know a thing to prototypal inheritance
			blast,
			CoreTypes.TweenTypes.add,
			'alpha',
			-1,
			15,
			function() {
				GameLoop().removeSpriteFromScene(blast);
			},
			15,
			i * 15
		);
		GameLoop().addAnimatedSpriteToScene(blast, blastTween);
	}
	
//	GameLoop().stage.addChild(blast.spriteObj);
	
//	CoreTypes.disposableSpritesRegister.push(explosion);
}


/**
 * @method getBlastColor
 * @param {Number} foeType
 */
GameObjectFactory.prototype.getBlastColor = function(foeType) {
	return foeType % 2 === 0 ? 'Orange' : 'Green';
}

/**
 * @method getRandomFoe
 * @param {Number} count
 */
GameObjectFactory.prototype.getRandomFoe = function(count) {
	return Math.floor(Math.random() * count).toString();
}

/**
 * @method getRandomExplosionOffset
 * Helper mthod
 * @param {Number} shipDimension
 * @return Void
 */
GameObjectFactory.prototype.getRandomExplosionOffset = function(shipDimension) {
	return Math.round((Math.random() - .5) * shipDimension / 2);
}

/**
 * @method getRandomLootType
 * @return {'0'|'1'|'2'|'3'}
 */
GameObjectFactory.prototype.getRandomLootType = function () {
	// @ts-ignore TS doesn't understand the algo
	return (Math.floor(Math.random() * 1.9)).toString(); // shall be Math.floor(Math.random() * lootTypesCount)
}




// @ts-ignore singleton pattern
var gameObjectsFactory;

/**
 *
 */
module.exports = function() {
	// @ts-ignore singleton pattern
	if (typeof gameObjectsFactory !== 'undefined')
		// @ts-ignore singleton pattern
		return gameObjectsFactory;
	else
		return (gameObjectsFactory = new GameObjectFactory());
};