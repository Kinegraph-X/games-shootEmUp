/**
 * @router DevToolsStructRouter 
 */

const FontFaceObserver = require('src/utilities/fontfaceobserver');

const CoreTypes = require('src/GameTypes/CoreTypes');
const {throttle} = require('src/core/commonUtilities');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
let gameState = require('src/GameTypes/GameState');
const {windowSize, cellSize, gridCoords, occupiedCells, getFoeCell, getRandomFoe} = require('src/GameTypes/gridManager');
const {levels, foeDescriptors, mainSpaceShipLifePoints, weapons} = require('src/GameTypes/gameConstants');
const KeyboardEvents = require('src/events/JSKeyboardMap');
const KeyboardListener = require('src/events/GameKeyboardListener');
const Sprite = require('src/GameTypes/Sprite');
const TilingSprite = require('src/GameTypes/TilingSprite');

const Tween = require('src/GameTypes/Tween');
const TileTween = require('src/GameTypes/TileTween');
const TileToggleTween = require('src/GameTypes/TileToggleTween');
const TileToggleMovingTween = require('src/GameTypes/TileToggleMovingTween');

const MainSpaceShip = require('src/GameTypes/MainSpaceShip');
const FoeSpaceShip = require('src/GameTypes/FoeSpaceShip');
const ShieldedFoeSpaceShip = require('src/GameTypes/ShieldedFoeSpaceShip');
const StatusBarSprite = require('src/GameTypes/StatusBarSprite');
const Projectile = require('src/GameTypes/Projectile');
const ProjectileFactory = require('src/GameTypes/ProjectileFactory');

const spaceShipCollisionTester = require('src/GameTypes/spaceShipCollisionTester');
const fireBallCollisionTester = require('src/GameTypes/fireBallCollisionTester');
const mainSpaceShipCollisionTester = require('src/GameTypes/mainSpaceShipCollisionTester');

const GameLoop = require('src/GameTypes/GameLoop');
const gameLogic = require('src/GameTypes/gameLogic');
 
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
						{name : 'mainSpaceShip', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/07/Spaceship_07_YELLOW.png'},
						{name : 'foeSpaceShip01', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/03/Spaceship_03_RED.png'},
						{name : 'foeSpaceShip02', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/02/Spaceship_02_PURPLE.png'},
						{name : 'foeSpaceShip03', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/06/Spaceship_06_BLUE.png'},
						{name : 'foeSpaceShip02Shielded', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/02/Spaceship_02_YELLOW.png'},
						{name : 'foeSpaceShip03Shielded', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/06/Spaceship_06_YELLOW.png'}
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
			const gameLoop = new GameLoop(windowSize);
			
			
			
			// BACKGROUND
			const bgZoom = 1.8;
			const worldMapBack = new TilingSprite(
				UIDGenerator.newUID(),
				new CoreTypes.Point(-(windowSize.x.value * bgZoom - windowSize.x.value) / 2, 0),
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				loadedAssets[0].bgBack,
				bgZoom
			);
			worldMapBack.spriteObj.name = 'bgLayer01';
			const worldMapBackTween = new TileTween(windowSize, worldMapBack.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 25), .1);
			gameLoop.pushTween(worldMapBackTween);
			gameLoop.stage.addChild(worldMapBack.spriteObj);
			
			const worldMapMiddle = new TilingSprite(
				UIDGenerator.newUID(),
				new CoreTypes.Point(-(windowSize.x.value * bgZoom - windowSize.x.value) / 2, 0),
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				loadedAssets[0].bgMiddle,
				1
			);
			worldMapMiddle.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
			worldMapMiddle.spriteObj.name = 'bgLayer02';
			const worldMapMiddleTween = new TileTween(windowSize, worldMapMiddle.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 12), .1);
			gameLoop.pushTween(worldMapMiddleTween);
			gameLoop.stage.addChild(worldMapMiddle.spriteObj);
			
			const worldMapFront = new TilingSprite(
				UIDGenerator.newUID(),
				new CoreTypes.Point(-(windowSize.x.value * bgZoom - windowSize.x.value) / 2, 0),
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				loadedAssets[0].bgFront,
				.3
			);
			worldMapFront.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
			worldMapFront.spriteObj.name = 'bgLayer03';
			const worldMapFrontTween = new TileTween(windowSize, worldMapFront.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 3), .1);
			gameLoop.pushTween(worldMapFrontTween);
			gameLoop.stage.addChild(worldMapFront.spriteObj);
			
			
			
			// MAIN SPACESHIP
			const mainSpaceShipDimensions = new CoreTypes.Dimension(200, 200);
			const mainSpaceShipStartPosition = new CoreTypes.Point(
				windowSize.x.value / 2 - mainSpaceShipDimensions.x.value / 2,
				windowSize.y.value - mainSpaceShipDimensions.y.value
			);
			const mainSpaceShipSprite = new MainSpaceShip(
				mainSpaceShipStartPosition,
				mainSpaceShipDimensions,
				loadedAssets[1].mainSpaceShip,
				loadedAssets[2].flamesTilemap,
				mainSpaceShipLifePoints['1']
			);
			const flameTween = new TileToggleTween(
				windowSize,
				mainSpaceShipSprite.flameTileSprite.spriteObj,
				CoreTypes.TweenTypes.add,
				new CoreTypes.Point(0, 83),
				.1,
				false,
				2,
				6
			);
			gameLoop.pushTween(flameTween);
			gameLoop.stage.addChild(mainSpaceShipSprite.spriteObj);
			
			
			
			// FOE SPACESHIPS
			function addFoeSpaceShips() {
				let partialFoeSpaceShipsRegister = [];
				let foeSpaceShip, foeCount = 0, shieldedFoeCount = 0, foeCell, foePosition, randomFoeSeed, randomFoe, foeSpaceShipTween;
				while (foeCount < levels[gameState.currentLevel].foeCount) {
					
					foeCell = getFoeCell();
					foePosition = new CoreTypes.Point(
						parseInt(gridCoords.x[foeCell.x] + cellSize / 2),
						parseInt(gridCoords.y[foeCell.y] - cellSize * 2)
					);
					
					randomFoeSeed = gameState.currentLevel < 3 ? Object.keys(loadedAssets[1]).length - 4 : Object.keys(loadedAssets[1]).length - 3;
					randomFoe = getRandomFoe(randomFoeSeed).toString();
					
					// DEBUG
//					randomFoe = '2';
					
					if (parseInt(randomFoe) > 1 && shieldedFoeCount <= levels[gameState.currentLevel].shieldedFoeCount - 1) {
						foeSpaceShip = new ShieldedFoeSpaceShip(
							foePosition,
							foeCell,
							randomFoe,
							loadedAssets[1]['foeSpaceShip0' + randomFoe + 'Shielded'],
							foeDescriptors[(parseInt(randomFoe) - 1).toString()].lifePoints,
							foeDescriptors[(parseInt(randomFoe) - 1).toString()].lootChance
						);
						shieldedFoeCount++;
					}
					else {
						foeSpaceShip = new FoeSpaceShip(
							foePosition,
							foeCell,
							randomFoe,
							loadedAssets[1]['foeSpaceShip0' + randomFoe],
							foeDescriptors[(parseInt(randomFoe) - 1).toString()].lifePoints,
							foeDescriptors[(parseInt(randomFoe) - 1).toString()].lootChance
						);
					}
					
					partialFoeSpaceShipsRegister.push(foeSpaceShip.spriteObj);
					CoreTypes.foeSpaceShipsRegister.setItem(foeSpaceShip._UID, foeSpaceShip.spriteObj);
					
					foeSpaceShipTween = new Tween(windowSize, foeSpaceShip.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 7), .1);
					CoreTypes.foeSpaceShipsTweensRegister.setItem(foeSpaceShip._UID, foeSpaceShipTween);
					
					gameLoop.pushTween(foeSpaceShipTween);
					gameLoop.stage.addChild(foeSpaceShip.spriteObj);
					foeCount++;
				}
				let mainSpaceShipCollisionTest;
				partialFoeSpaceShipsRegister.forEach(function(foeSpaceShipSpriteObj) {
					mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(mainSpaceShipSprite.spriteObj, foeSpaceShipSpriteObj, 'hostile');
					gameLoop.pushCollisionTest(mainSpaceShipCollisionTest);
					CoreTypes.foeSpaceShipsTweensRegister.cache[foeSpaceShipSpriteObj._UID].collisionTestsRegister.push(mainSpaceShipCollisionTest);
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
//					gameLoop,
//					foeSpaceShip.spriteObj,
//					loadedAssets
//				);
//				
//				let mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(mainSpaceShipSprite.spriteObj, lootSprite, 'powerUp');
////				console.log('looted', mainSpaceShipCollisionTest);
//				CoreTypes.tempAsyncCollisionsTests.push(mainSpaceShipCollisionTest);
//				
//				foeCount++;
//			}

			
			
			
			
			const fireballThrottling = 250;
			// Projectiles
			const launchFireball = throttle(
				function (type) {
					const startPosition = new CoreTypes.Point(
						mainSpaceShipSprite.spriteObj.x + mainSpaceShipDimensions.x.value / 2,
						mainSpaceShipSprite.spriteObj.y - ProjectileFactory.prototype.projectileDimensions.y.value + 92		// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
					);
					new ProjectileFactory(
						windowSize,
						loadedAssets,
						gameLoop,
						startPosition,
						weapons[type].spriteTexture,
						weapons[type].damage,
						weapons[type].moveTiles
					);
				},
				fireballThrottling
			);
			
			
			
			
			// KEYBOARD HANDLING
			const mainSpaceShipeLeftTween = new Tween(windowSize, mainSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(-10, 0), 1, false);
			const mainSpaceShipeRightTween = new Tween(windowSize, mainSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(10, 0), 1, false);
			const mainSpaceShipeUpTween = new Tween(windowSize, mainSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, -10), 1, false);
			const mainSpaceShipeDownTween = new Tween(windowSize, mainSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 10), 1, false);
			let interval;
			keyboardListener.addOnPressedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if ((keyCode === KeyboardEvents.indexOf('LEFT') || keyCode === KeyboardEvents.indexOf('Q')) && !ctrlKey) {
					mainSpaceShipeLeftTween.lastStepTimestamp = gameLoop.currentTime;
					gameLoop.pushTween(mainSpaceShipeLeftTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT') || keyCode === KeyboardEvents.indexOf('D')) {
					mainSpaceShipeRightTween.lastStepTimestamp = gameLoop.currentTime;
					gameLoop.pushTween(mainSpaceShipeRightTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('UP') || keyCode === KeyboardEvents.indexOf('Z')) {
					mainSpaceShipeUpTween.lastStepTimestamp = gameLoop.currentTime;
					gameLoop.pushTween(mainSpaceShipeUpTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN') || keyCode === KeyboardEvents.indexOf('S')) {
					mainSpaceShipeDownTween.lastStepTimestamp = gameLoop.currentTime;
					gameLoop.pushTween(mainSpaceShipeDownTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					launchFireball(gameState.currentWeapon);
					
					interval = setInterval(function() {
						launchFireball(gameState.currentWeapon);
					}, fireballThrottling);
				}
			});
			keyboardListener.addOnReleasedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if ((keyCode === KeyboardEvents.indexOf('LEFT') || keyCode === KeyboardEvents.indexOf('Q')) && !ctrlKey) {
					gameLoop.removeTween(mainSpaceShipeLeftTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT') || keyCode === KeyboardEvents.indexOf('D')) {
					gameLoop.removeTween(mainSpaceShipeRightTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('UP') || keyCode === KeyboardEvents.indexOf('Z')) {
					gameLoop.removeTween(mainSpaceShipeUpTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN') || keyCode === KeyboardEvents.indexOf('S')) {
					gameLoop.removeTween(mainSpaceShipeDownTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					clearInterval(interval);
				}
				else if (keyCode === KeyboardEvents.indexOf('Q') && ctrlKey) {
					gameLoop.stop()
				}
			});
			
			
			
			
			// STATUS BAR
			const statusBar = new StatusBarSprite(
				windowSize,
				loadedAssets[0].statusBarLeft
			)
			gameLoop.stage.addChild(statusBar.gameStatusSpriteObj);
			gameLoop.stage.addChild(statusBar.textForLevelSpriteObj);
			gameLoop.stage.addChild.apply(gameLoop.stage, statusBar.textForScoreSpriteObj);
			
			
			
			// GAME LOOP EVENTS
			gameLoop.addEventListener('foeSpaceShipOutOfScreen', function(e) {
				gameLogic.handleFoeSpaceShipOutOfScreen(
					gameLoop,
					e.data
				);
			});
			gameLoop.addEventListener('foeSpaceShipDamaged', function(e) {
				gameLogic.handleFoeSpaceShipDamaged(
					gameLoop,
					e.data[1],
					e.data[0],
					mainSpaceShipSprite.spriteObj,
					loadedAssets,
					statusBar.textForScoreSpriteObj[1]
				);
			});
			gameLoop.addEventListener('foeSpaceShipDestroyed', function(e) {
				gameLogic.shouldChangeLevel(
					statusBar.textForLevelSpriteObj,
					addFoeSpaceShips
				);
			});
			gameLoop.addEventListener('mainSpaceShipPowerUp', function(e) {
				gameLogic.handlePowerUp(
					gameLoop,
					e.data[1],
					e.data[0],
					statusBar.gameStatusSpriteObj
				);
			});
			gameLoop.addEventListener('fireballOutOfScreen', function(e) {
				gameLogic.handleFireballOutOfScreen(
					gameLoop,
					e.data
				);
			});
			gameLoop.addEventListener('mainSpaceShipOutOfScreen', function(e) {
				gameLogic.handleMainSpaceShipOutOfScreen(
					windowSize,
					gameLoop,
					e.data
				);
			});
			gameLoop.addEventListener('mainSpaceShipDamaged', function(e) {
				gameLogic.handleMainSpaceShipDamaged(
					gameLoop,
					e.data[0],
					e.data[1],
					loadedAssets,
					statusBar.gameStatusSpriteObj,
					statusBar.textForLevelSpriteObj,
					statusBar.textForScoreSpriteObj[1]
				);

			});
			gameLoop.addEventListener('disposableSpriteAnimationEnded', function(e) {
				gameLogic.handleDisposableSpriteAnimationEnded(
					gameLoop,
					e.data
				);
			});

			
			
			
			// GAME LAUNCH
			document.querySelector(rootNodeSelector).appendChild(gameLoop.renderer.view);
			gameLoop.start();
		}
		
		
	}
	
	return {
		init : init
	}
}
module.exports = classConstructor;