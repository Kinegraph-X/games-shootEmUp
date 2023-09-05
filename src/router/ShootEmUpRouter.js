/**
 * @router DevToolsStructRouter 
 */

const FontFaceObserver = require('src/utilities/fontfaceobserver');
const KeyboardEvents = require('src/events/JSKeyboardMap');
const KeyboardListener = require('src/events/GameKeyboardListener');
const {throttle} = require('src/core/commonUtilities');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const PropertyCache = require('src/core/PropertyCache').ObjectCache;

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const {windowSize, cellSize, gridCoords, occupiedCells, getFoeCell} = require('src/GameTypes/grids/gridManager');
const {levels, foeDescriptors, mainSpaceShipLifePoints, weapons} = require('src/GameTypes/gameSingletons/gameConstants');

const Player = require('src/GameTypes/gameSingletons/Player');
let GameState = require('src/GameTypes/gameSingletons/GameState');
const GameLoop = require('src/GameTypes/gameSingletons/GameLoop');
GameLoop(windowSize);
const gameLogic = require('src/GameTypes/gameSingletons/gameLogic');

const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');

const Tween = require('src/GameTypes/tweens/Tween');
const TileTween = require('src/GameTypes/tweens/TileTween');
const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');
const TileToggleMovingTween = require('src/GameTypes/tweens/TileToggleMovingTween');

const MainSpaceShip = require('src/GameTypes/sprites/MainSpaceShip');
const FoeSpaceShip = require('src/GameTypes/sprites/FoeSpaceShip');
const StatusBarSprite = require('src/GameTypes/sprites/StatusBarSprite');
const ProjectileFactory = require('src/GameTypes/factories/ProjectileFactory');

const spaceShipCollisionTester = require('src/GameTypes/collisionTests/spaceShipCollisionTester');
const fireBallCollisionTester = require('src/GameTypes/collisionTests/fireBallCollisionTester');
const mainSpaceShipCollisionTester = require('src/GameTypes/collisionTests/mainSpaceShipCollisionTester');



 
var classConstructor = function() {
	function init(rootNodeSelector) {
		const keyboardListener = new KeyboardListener();
		
		// ASSETS PRELOADING
		const manifest = {
			bundles : [
				{
					name : 'backgrounds',
					assets : [
						{name : 'bgBack', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Blue Nebula/Blue Nebula 1 - 1024x1024.png'},
						{name : 'bgMiddle', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Blue Nebula/Blue Nebula 6 - 1024x1024.png'},
						{name : 'bgFront', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Starfields/Starfield-9 - 1024x1024.png'},
						{name : 'statusBarLeft', srcs : 'plugins/ShootEmUp/assets/Status_Bar_Left.png'}
					]
				},
				{
					name : 'spaceShips',
					assets : [
						{name : 'mainSpaceShip', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/07/Spaceship_07_YELLOW_animated.png'},
						{name : 'foeSpaceShip00', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/03/Spaceship_03_RED.png'},
						{name : 'foeSpaceShip01', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/02/Spaceship_02_PURPLE.png'},
						{name : 'foeSpaceShip02', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/06/Spaceship_06_BLUE.png'},
						{name : 'foeSpaceShip01Shielded', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/02/Spaceship_02_YELLOW.png'},
						{name : 'foeSpaceShip02Shielded', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/06/Spaceship_06_YELLOW.png'}
					]
				},
				{
					name : 'flames',
					assets : [
						{name : 'flamesTilemap', srcs : 'plugins/ShootEmUp/assets/ships/Flames_tilemap.png'},
						{name : 'fireballsTilemap', srcs : 'plugins/ShootEmUp/assets/Fireball_sprite_v2.png'},
						{name : 'impactTilemap', srcs : 'plugins/ShootEmUp/assets/Impact_sprite.png'},
						{name : 'greenExplosionTilemap', srcs : 'plugins/ShootEmUp/assets/Explosion_Sprite.png'},
						{name : 'yellowExplosionTilemap', srcs : 'plugins/ShootEmUp/assets/Yellow_Explosion_Sprite.png'},
						{name : 'shieldTilemap', srcs : 'plugins/ShootEmUp/assets/Shield_Sprite.png'},
						{name : 'medikitTilemap', srcs : 'plugins/ShootEmUp/assets/loots/Medikit_Sprite.png'},
						{name : 'weaponTilemap', srcs : 'plugins/ShootEmUp/assets/loots/Weapon_Sprite.png'}
					]
				}
			]
		};
		PIXI.Assets.init({manifest}).then(function() {
			Promise.all([
				PIXI.Assets.loadBundle('backgrounds'),
				PIXI.Assets.loadBundle('spaceShips'),
				PIXI.Assets.loadBundle('flames')
			]).then(function(loadedAssets) {
				(new FontFaceObserver('Showcard Gothic'))
					.load().then(onLoaded.bind(null, loadedAssets))
			});
		});
		
		
		
		// ONLOADED => GAME INIT
		function onLoaded(loadedAssets) {
			console.log('Ctrl + Q to stop the game loop');
			
			
			
			
			// BACKGROUND
			const bgZoom = 1.8;
			const worldMapBack = new TilingSprite(
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				loadedAssets[0].bgBack,
				bgZoom
			);
			worldMapBack.name = 'bgLayer01';
			const worldMapBackTween = new TileTween(windowSize, worldMapBack, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 25), .1);
			GameLoop().addAnimatedSpriteToScene(worldMapBack, worldMapBackTween);
			
			const worldMapMiddle = new TilingSprite(
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				loadedAssets[0].bgMiddle,
				1
			);
			worldMapMiddle.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
			worldMapMiddle.name = 'bgLayer02';
			const worldMapMiddleTween = new TileTween(windowSize, worldMapMiddle, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 12), .1);
			GameLoop().addAnimatedSpriteToScene(worldMapMiddle, worldMapMiddleTween);
			
			const worldMapFront = new TilingSprite(
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				loadedAssets[0].bgFront,
				.3
			);
			worldMapFront.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
			worldMapFront.name = 'bgLayer03';
			const worldMapFrontTween = new TileTween(windowSize, worldMapFront, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 3), .1);
			GameLoop().addAnimatedSpriteToScene(worldMapFront, worldMapFrontTween);
			
			
			
			// MAIN SPACESHIP
			const mainSpaceShipStartPosition = new CoreTypes.Point(
				windowSize.x.value / 2 - MainSpaceShip.prototype.defaultSpaceShipDimensions.x.value / 2,
				windowSize.y.value - MainSpaceShip.prototype.defaultSpaceShipDimensions.y.value
			);
			const mainSpaceShipSprite = new MainSpaceShip(
				mainSpaceShipStartPosition,
				loadedAssets[1].mainSpaceShip,
				loadedAssets[2].flamesTilemap,
				mainSpaceShipLifePoints['1']
			);
			const flameTween = new TileToggleTween(
				windowSize,
				mainSpaceShipSprite.flameTileSprite,
				CoreTypes.TweenTypes.add,
				new CoreTypes.Point(0, 83),
				.1,
				false,
				2,
				6
			);
			GameLoop().addAnimatedSpriteToScene(mainSpaceShipSprite, flameTween);
			
			
			
			
			
			
			// PLAYER INSTANCIATION : After Having got our mainSpaceShip
			const player = Player({
				foeSpaceShipsRegister : new PropertyCache('foeSpaceShipsRegister'),
				foeSpaceShipsTweensRegister : new PropertyCache('foeSpaceShipsTweensRegister'),
				mainSpaceShip : mainSpaceShipSprite
			});
			
			
			
			// FOE SPACESHIPS
			function addFoeSpaceShips() {
				let partialFoeSpaceShipsRegister = [];
				let foeSpaceShip, foeCount = 0, shieldedFoeCount = 0, foeCell, foePosition, randomFoeSeed, randomFoe, foeSpaceShipTween;
				while (foeCount < levels[GameState().currentLevel].foeCount) {
					
					foeCell = getFoeCell();
					foePosition = new CoreTypes.Point(
						parseInt(gridCoords.x[foeCell.x] + cellSize / 2),
						parseInt(gridCoords.y[foeCell.y] - cellSize * 2)
					);
					
					randomFoeSeed = GameState().currentLevel < 3 ? Object.keys(loadedAssets[1]).length - 4 : Object.keys(loadedAssets[1]).length - 3;
					randomFoe = gameLogic.getRandomFoe(randomFoeSeed);
					
					// DEBUG
//					randomFoe = '2';
					
					foeSpaceShip = new FoeSpaceShip(
						foePosition,
						foeCell,
						loadedAssets[1]['foeSpaceShip0' + randomFoe],
						randomFoe
					);
					
					if (parseInt(randomFoe) > 0 && shieldedFoeCount <= levels[GameState().currentLevel].shieldedFoeCount - 1) {
						foeSpaceShip.hasShield = true;
						shieldedFoeCount++;
					}
					
					partialFoeSpaceShipsRegister.push(foeSpaceShip);
					player.foeSpaceShipsRegister.setItem(foeSpaceShip._UID, foeSpaceShip);
					
					foeSpaceShipTween = new Tween(windowSize, foeSpaceShip, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 7), .1);
					player.foeSpaceShipsTweensRegister.setItem(foeSpaceShip._UID, foeSpaceShipTween);
					
					GameLoop().addAnimatedSpriteToScene(foeSpaceShip, foeSpaceShipTween);
					foeCount++;
				}
				let mainSpaceShipCollisionTest;
				partialFoeSpaceShipsRegister.forEach(function(foeSpaceShipSpriteObj) {
					mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(mainSpaceShipSprite, foeSpaceShipSpriteObj, 'hostile');
					GameLoop().pushCollisionTest(mainSpaceShipCollisionTest);
					Player().foeSpaceShipsTweensRegister.cache[foeSpaceShipSpriteObj._UID].collisionTestsRegister.push(mainSpaceShipCollisionTest);
				});
			}
			addFoeSpaceShips();
			
			
			
			
			
			// DEBUG to display loots only
//			let foeSpaceShip, foeCount = 0, shieldedFoeCount = 0, foeCell, foePosition, randomFoeSeed, randomFoe, foeSpaceShipTween;
//			while (foeCount < 28) {
//				foeCell = getFoeCell();
//				foePosition = new CoreTypes.Point(
//					parseInt(gridCoords.x[foeCell.x] + cellSize / 2),
//					parseInt(gridCoords.y[foeCell.y] - cellSize * 2)
//				);
//				
//				foeSpaceShip = new FoeSpaceShip(
//					foePosition,
//					foeCell,
//					1,
//					loadedAssets[1]['foeSpaceShip01'],
//					0,
//					0
//				);
//				
//				let lootSprite = gameLogic.createLoot(
//					foeSpaceShip,
//					loadedAssets
//				);
//				
//				let mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(mainSpaceShipSprite, lootSprite, 'powerUp');
////				console.log('looted', mainSpaceShipCollisionTest);
//				CoreTypes.tempAsyncCollisionsTests.push(mainSpaceShipCollisionTest);
//				
//				foeCount++;
//			}

			
			
			
			// PROJECTILES
			const fireballThrottling = 250;
			const launchFireball = throttle(
				function (type) {
					const startPosition = new CoreTypes.Point(
						mainSpaceShipSprite.x + mainSpaceShipSprite.defaultSpaceShipDimensions.x.value / 2,
						mainSpaceShipSprite.y - ProjectileFactory.prototype.projectileDimensions.y.value + 92		// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
					);
					new ProjectileFactory(
						windowSize,
						loadedAssets,
						startPosition,
						type
					);
				},
				fireballThrottling
			);
			
			
			
			
			// KEYBOARD HANDLING
			const mainSpaceShipeLeftTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(-10, 0), 1, false);
			const mainSpaceShipeRightTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(10, 0), 1, false);
			const mainSpaceShipeUpTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, -10), 1, false);
			const mainSpaceShipeDownTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 10), 1, false);
			let interval;
			keyboardListener.addOnPressedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if ((keyCode === KeyboardEvents.indexOf('LEFT') || keyCode === KeyboardEvents.indexOf('Q')) && !ctrlKey) {
					mainSpaceShipSprite.mainSpaceShipSprite.tilePositionY = 200;
					mainSpaceShipeLeftTween.lastStepTimestamp = GameLoop().currentTime;
					GameLoop().pushTween(mainSpaceShipeLeftTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT') || keyCode === KeyboardEvents.indexOf('D')) {
					mainSpaceShipSprite.mainSpaceShipSprite.tilePositionY = 0;
					mainSpaceShipeRightTween.lastStepTimestamp = GameLoop().currentTime;
					GameLoop().pushTween(mainSpaceShipeRightTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('UP') || keyCode === KeyboardEvents.indexOf('Z')) {
					mainSpaceShipeUpTween.lastStepTimestamp = GameLoop().currentTime;
					GameLoop().pushTween(mainSpaceShipeUpTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN') || keyCode === KeyboardEvents.indexOf('S')) {
					mainSpaceShipeDownTween.lastStepTimestamp = GameLoop().currentTime;
					GameLoop().pushTween(mainSpaceShipeDownTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					launchFireball(GameState().currentWeapon);
					
					interval = setInterval(function() {
						launchFireball(GameState().currentWeapon);
					}, fireballThrottling);
				}
			});
			keyboardListener.addOnReleasedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if ((keyCode === KeyboardEvents.indexOf('LEFT') || keyCode === KeyboardEvents.indexOf('Q')) && !ctrlKey) {
					mainSpaceShipSprite.mainSpaceShipSprite.tilePositionY = 400;
					GameLoop().removeTween(mainSpaceShipeLeftTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT') || keyCode === KeyboardEvents.indexOf('D')) {
					mainSpaceShipSprite.mainSpaceShipSprite.tilePositionY = 400;
					GameLoop().removeTween(mainSpaceShipeRightTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('UP') || keyCode === KeyboardEvents.indexOf('Z')) {
					GameLoop().removeTween(mainSpaceShipeUpTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN') || keyCode === KeyboardEvents.indexOf('S')) {
					GameLoop().removeTween(mainSpaceShipeDownTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					clearInterval(interval);
				}
				else if (keyCode === KeyboardEvents.indexOf('Q') && ctrlKey) {
					GameLoop().stop()
				}
			});
			
			
			
			
			// STATUS BAR
			const statusBar = new StatusBarSprite(
				windowSize,
				loadedAssets[0].statusBarLeft
			)
			GameLoop().addSpriteToScene(statusBar.gameStatusSpriteObj);
			GameLoop().stage.addChild(statusBar.textForLevelSpriteObj);
			GameLoop().stage.addChild.apply(GameLoop().stage, statusBar.textForScoreSpriteObj);
			
			
			
			// GAME LOOP EVENTS
			GameLoop().addEventListener('foeSpaceShipOutOfScreen', function(e) {
				gameLogic.handleFoeSpaceShipOutOfScreen(
					e.data
				);
			});
			GameLoop().addEventListener('foeSpaceShipDamaged', function(e) {
				gameLogic.handleFoeSpaceShipDamaged(
					e.data[1],
					e.data[0],
					loadedAssets,
					statusBar.textForScoreSpriteObj[1]
				);
			});
			GameLoop().addEventListener('foeSpaceShipDestroyed', function(e) {
				gameLogic.shouldChangeLevel(
					statusBar.textForLevelSpriteObj,
					addFoeSpaceShips
				);
			});
			GameLoop().addEventListener('mainSpaceShipPowerUp', function(e) {
				gameLogic.handlePowerUp(
					e.data[1],
					statusBar.gameStatusSpriteObj
				);
			});
			GameLoop().addEventListener('fireballOutOfScreen', function(e) {
				gameLogic.handleFireballOutOfScreen(
					e.data
				);
			});
			GameLoop().addEventListener('mainSpaceShipOutOfScreen', function(e) {
				gameLogic.handleMainSpaceShipOutOfScreen(
					windowSize,
					e.data
				);
			});
			GameLoop().addEventListener('mainSpaceShipDamaged', function(e) {
				gameLogic.handleMainSpaceShipDamaged(
					e.data[1],
					loadedAssets,
					statusBar.gameStatusSpriteObj,
					statusBar.textForLevelSpriteObj,
					statusBar.textForScoreSpriteObj[1]
				);

			});
			GameLoop().addEventListener('disposableSpriteAnimationEnded', function(e) {
				gameLogic.handleDisposableSpriteAnimationEnded(
					e.data
				);
			});

			
			
			
			// GAME LAUNCH
			document.querySelector(rootNodeSelector).appendChild(GameLoop().renderer.view);
			GameLoop().start();
		}
		
		
	}
	
	return {
		init : init
	}
}
module.exports = classConstructor;