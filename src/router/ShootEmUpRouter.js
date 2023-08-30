/**
 * @router DevToolsStructRouter 
 */

const CoreTypes = require('src/GameTypes/CoreTypes');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
let gameState = require('src/GameTypes/GameState');
const {windowSize, cellSize, gridCoords, occupiedCells, getFoeCell, getRandomFoe} = require('src/GameTypes/gridManager');
const {levels, foeDescriptors, mainSpaceShipLifePoints, weapons} = require('src/GameTypes/gameConstants');
const KeyboardEvents = require('src/events/JSKeyboardMap');
const KeyboardListener = require('src/events/KeyboardListener');
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
						{name : 'statusBarLeft', srcs : 'plugins/ShootEmUp/assets/Status_Bar_Left.png'}
					]
				},
				{
					name : 'spaceShips',
					assets : [
						{name : 'mainSpaceShip', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/04/Spaceship_04_YELLOW.png'},
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
			]).then(onLoaded);
		});
		
		
		
		// ONLOADED => GAME INIT
		function onLoaded(loadedAssets) {
			console.log('Ctrl + Q to stop the game loop');
			const gameLoop = new GameLoop(windowSize);
			
			
			
			// BACKGROUND
			const bgZoom = 1.8;
			const worldMap = new TilingSprite(
				UIDGenerator.newUID(),
				new CoreTypes.Point(-(windowSize.x.value * bgZoom - windowSize.x.value) / 2, 0),
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				loadedAssets[0].bgBack,
				bgZoom
			);
			worldMap.spriteObj.name = 'bgLayer01';
			const worldMapTween = new TileTween(windowSize, worldMap.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 25), .1);
			gameLoop.pushTween(worldMapTween);
			gameLoop.stage.addChild(worldMap.spriteObj);
			
			
			
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
					randomFoe = '2';
					
//					if (parseInt(randomFoe) > 1 && shieldedFoeCount <= levels[gameState.currentLevel].shieldedFoeCount - 1) {
//						foeSpaceShip = new ShieldedFoeSpaceShip(
//							foePosition,
//							foeCell,
//							randomFoe,
//							loadedAssets[1]['foeSpaceShip0' + randomFoe + 'Shielded'],
//							foeDescriptors[(parseInt(randomFoe) - 1).toString()].lifePoints,
//							foeDescriptors[(parseInt(randomFoe) - 1).toString()].lootChance
//						);
//						shieldedFoeCount++;
//					}
//					else {
						foeSpaceShip = new FoeSpaceShip(
							foePosition,
							foeCell,
							randomFoe,
							loadedAssets[1]['foeSpaceShip0' + randomFoe],
							foeDescriptors[(parseInt(randomFoe) - 1).toString()].lifePoints,
							foeDescriptors[(parseInt(randomFoe) - 1).toString()].lootChance
						);
//					}
					
					partialFoeSpaceShipsRegister.push(foeSpaceShip.spriteObj);
					CoreTypes.foeSpaceShipsRegister.push(foeSpaceShip.spriteObj);
					
					foeSpaceShipTween = new Tween(windowSize, foeSpaceShip.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 7), .1);
					CoreTypes.foeSpaceShipsTweensRegister.push(foeSpaceShipTween);
					
					gameLoop.pushTween(foeSpaceShipTween);
					gameLoop.stage.addChild(foeSpaceShip.spriteObj);
					foeCount++;
				}
				let mainSpaceShipCollisionTest, foeSpriteIdx = 0;
				partialFoeSpaceShipsRegister.forEach(function(foeSpaceShipSpriteObj) {
					mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(mainSpaceShipSprite.spriteObj, foeSpaceShipSpriteObj, 'hostile');
					gameLoop.pushCollisionTest(mainSpaceShipCollisionTest);
					foeSpriteIdx = CoreTypes.foeSpaceShipsRegister.indexOf(foeSpaceShipSpriteObj);
					CoreTypes.foeSpaceShipsTweensRegister[foeSpriteIdx].collisionTestsRegister.push(mainSpaceShipCollisionTest);
				});
			}
			addFoeSpaceShips();

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

			
			
			// Projectiles
			function launchFireball(type) {
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
			}
			
			
			
			
			// KEYBOARD HANDLING
			keyboardListener.addEventListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if (keyCode === KeyboardEvents.indexOf('LEFT')) {
					const mainSpaceShipeTween = new Tween(windowSize, mainSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(-30, 0), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT')) {
					const mainSpaceShipeTween = new Tween(windowSize, mainSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(30, 0), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('UP')) {
					const mainSpaceShipeTween = new Tween(windowSize, mainSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, -30), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN')) {
					const mainSpaceShipeTween = new Tween(windowSize, mainSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 30), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					launchFireball(gameState.currentWeapon);
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
					loadedAssets
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
				console.log('mainSpaceShipOutOfScreen', e.data);
			});
			gameLoop.addEventListener('mainSpaceShipDamaged', function(e) {
				gameLogic.handleMainSpaceShipDamaged(
					gameLoop,
					e.data[0],
					loadedAssets,
					statusBar.gameStatusSpriteObj,
					statusBar.textForLevelSpriteObj
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