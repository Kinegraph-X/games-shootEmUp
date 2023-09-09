const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');

const AssetsLoader = require('src/GameTypes/gameSingletons/AssetsLoader');
/** @type {Array<Object>} */
let loadedAssets;

const {levels, foeDescriptors, mainSpaceShipLifePoints, lootSpritesTextures, maxLootsByType, weapons, objectTypes} = require('src/GameTypes/gameSingletons/gameConstants');
const {windowSize, cellSize, gridCoords, occupiedCells, getFoeCell} = require('src/GameTypes/grids/gridManager');
const gameLogic = require('src/GameTypes/gameSingletons/gameLogic');

const Player = require('src/GameTypes/gameSingletons/Player');
let GameState = require('src/GameTypes/gameSingletons/GameState');
const GameLoop = require('src/GameTypes/gameSingletons/GameLoop');

const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');

const MainSpaceShip = require('src/GameTypes/sprites/MainSpaceShip');
const FoeSpaceShip = require('src/GameTypes/sprites/FoeSpaceShip');
const StatusBarSprite = require('src/GameTypes/sprites/StatusBarSprite');
const ExplosionSprite = require('src/GameTypes/sprites/ExplosionSprite');
const LootSprite = require('src/GameTypes/sprites/LootSprite');

const Tween = require('src/GameTypes/tweens/Tween');
const TileTween = require('src/GameTypes/tweens/TileTween');
const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');

const ProjectileFactory = require('src/GameTypes/factories/ProjectileFactory');

/** 
 * @constructor GameObjectFactory
 * @param {CoreTypes.Dimension} windowSize
*/
const GameObjectFactory = function(windowSize) {
	this.windowSize = windowSize;
	this.loadedAssets = new Array();
	const self = this;
	AssetsLoader.then(function(loadedAssets) {
		self.loadedAssets = loadedAssets;
	});
}
//GameObjectFactory.prototype = {};

/**
 * @method newObject
 * @param {String} objectType
 * @param {boolean} addToScene
 * @param {Array<Number>} metadata
 * @param {Sprite} refToSprite
 * @return Void
 */
GameObjectFactory.prototype.newObject = function(objectType, addToScene = true, metadata = new Array(), refToSprite = null) {
	switch (objectType) {
		case objectTypes.background:
			this.createBg();
			break;
		case objectTypes.statusBar:
			return this.createStatusBar();
		case objectTypes.mainSpaceShip:
			return this.createMainSpaceShip();
		case objectTypes.projectiles:
			this.createProjectiles();
			break;
		case objectTypes.foeSpaceShip:
			return this.createFoeSpaceShip(metadata);
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
		case objectTypes.loot:
			return this.createLoot(refToSprite);
		default:
			console.error('Attempting to create a game object with a name that has not been defined.')
	}
}

/**
 * @method createStatusBar
 * @return {StatusBarSprite}
 */
GameObjectFactory.prototype.createStatusBar = function() {
	const statusBar = new StatusBarSprite(
		this.windowSize,
		// @ts-ignore loadedAssets.prop unknown
		this.loadedAssets[0].statusBarLeft,
		null
	);
	
	GameLoop().addSpriteToScene(statusBar.gameStatusSpriteObj);
	GameLoop().stage.addChild(statusBar.textForLevelSpriteObj);
	GameLoop().stage.addChild.apply(GameLoop().stage, statusBar.textForScoreSpriteObj);
	
	return statusBar;
}

/**
 * @method createProjectiles
 * @return Void
 */
GameObjectFactory.prototype.createProjectiles = function() {
	const startPosition = new CoreTypes.Point(
		// @ts-ignore x is inherited
		Player().mainSpaceShip.x + Player().mainSpaceShip.defaultSpaceShipDimensions.x.value / 2,
		// @ts-ignore y is inherited
		Player().mainSpaceShip.y - ProjectileFactory.prototype.projectileDimensions.y.value + 92		// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
	);
	new ProjectileFactory(
		this.windowSize,
		this.loadedAssets,
		startPosition,
		GameState().currentWeapon
	);
}

/**
 * @method createFoeSpaceShip
 * @param {Array<Number>} metadata
 * The index 0 of metadata contains the number of shielded foes we've already created
 * @return {FoeSpaceShip}
 */
GameObjectFactory.prototype.createFoeSpaceShip = function(metadata) {
	const foeCell = getFoeCell();
	const foePosition = new CoreTypes.Point(
		gridCoords.x[foeCell.x] + cellSize / 2,
		gridCoords.y[foeCell.y] - cellSize * 2
	);
	const randomFoeSeed = GameState().currentLevel < 3 ? Object.keys(this.loadedAssets[1]).length - 4 : Object.keys(this.loadedAssets[1]).length - 3;
	const randomFoe = this.getRandomFoe(randomFoeSeed);
	const hasShield = parseInt(randomFoe) > 0 && metadata[0] <= levels[GameState().currentLevel].shieldedFoeCount - 1;
	
	const foeSpaceShip = new FoeSpaceShip(
		foePosition,
		foeCell,
		this.loadedAssets[1]['foeSpaceShip0' + randomFoe + (hasShield ? 'Shielded' : '')],
		randomFoe
	);
	if (hasShield)
		foeSpaceShip.hasShield = true;
	
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsRegister.setItem(foeSpaceShip.UID, foeSpaceShip);
	// @ts-ignore : TS doesn't understand anything to prototypal inheritance (foeSpaceShip IS an instance of a Sprite)
	const foeSpaceShipTween = new Tween(this.windowSize, foeSpaceShip, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 7), .1, false);
	// @ts-ignore UID is inherited
	Player().foeSpaceShipsTweensRegister.setItem(foeSpaceShip.UID, foeSpaceShipTween);
	
	GameLoop().addAnimatedSpriteToScene(foeSpaceShip, foeSpaceShipTween);
	return foeSpaceShip;
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
		this.loadedAssets[1].mainSpaceShip,
		// @ts-ignore loadedAssets.prop unknown
		this.loadedAssets[2].flamesTilemap,
		mainSpaceShipLifePoints['1']
	);
	const flameTween = new TileToggleTween(
		this.windowSize,
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
		new CoreTypes.Dimension(this.windowSize.x.value, this.windowSize.y.value),
		// @ts-ignore loadedAssets.prop unknown
		this.loadedAssets[0].bgBack,
		bgZoom,
		null
	);
	
	const worldMapMiddle = new TilingSprite(
		new CoreTypes.Dimension(this.windowSize.x.value, this.windowSize.y.value),
		// @ts-ignore loadedAssets.prop unknown
		this.loadedAssets[0].bgMiddle,
		1,
		null
	);
	// @ts-ignore blendMode
	worldMapMiddle.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	const worldMapFront = new TilingSprite(
		new CoreTypes.Dimension(this.windowSize.x.value, this.windowSize.y.value),
		// @ts-ignore loadedAssets.prop unknown
		this.loadedAssets[0].bgFront,
		.3,
		null
	);
	// @ts-ignore blendMode
	worldMapFront.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
	
	const worldMapBackTween = new TileTween(this.windowSize, worldMapBack, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 25), .1, false);
	const worldMapMiddleTween = new TileTween(this.windowSize, worldMapMiddle, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 12), .1, false);
	const worldMapFrontTween = new TileTween(this.windowSize, worldMapFront, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 3), .1, false);
	
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
		this.loadedAssets[2].shieldTilemap,
		new CoreTypes.Dimension(200, 200)
	);
	shield.name = 'shieldSprite';
	// @ts-ignore zoom is inherited
	shield.zoom = zoom;
	
	const shieldTween = new TileToggleTween(
		this.windowSize,
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
		this.loadedAssets[2].impactTilemap,
		new CoreTypes.Dimension(32, 32)
	);
	const explosionTween = new TileToggleTween(
		this.windowSize,
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
		this.loadedAssets[2].greenExplosionTilemap,
		null
	);
	// @ts-ignore scaleX is inherited
	explosion.scaleX = 1.5;
	// @ts-ignore scaleY is inherited
	explosion.scaleY = 1.5;
	
	const explosionTween = new TileToggleTween(
		this.windowSize,
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
		this.loadedAssets[2].yellowExplosionTilemap,
		null
	);
	// @ts-ignore
	explosion.scaleX = 2;
	// @ts-ignore
	explosion.scaleY = 2;
	
	const explosionTween = new TileToggleTween(
		this.windowSize,
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
		this.loadedAssets[2][lootTextureName + 'Tilemap'],
		lootTextureName
	);
	
	const lootTween = new Tween(
		this.windowSize,
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
 * @param {CoreTypes.Dimension} windowSize
 */
module.exports = function(windowSize = null) {
	// @ts-ignore singleton pattern
	if (typeof gameObjectsFactory !== 'undefined')
		// @ts-ignore singleton pattern
		return gameObjectsFactory;
	else
		return (gameObjectsFactory = new GameObjectFactory(windowSize));
};