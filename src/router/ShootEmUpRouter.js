/**
 * @router DevToolsStructRouter 
 */

const CoreTypes = require('src/GameTypes/CoreTypes');
const {windowSize, cellSize, gridCoords, occupiedCells, getFoeCell, getRandomFoe} = require('src/GameTypes/gridManager');
const {levels, lifePoints, weapons} = require('src/GameTypes/gameNumbers');
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
const Projectile = require('src/GameTypes/Projectile');

const spaceShipCollisionTester = require('src/GameTypes/spaceShipCollisionTester');
const fireBallCollisionTester = require('src/GameTypes/fireBallCollisionTester');

const GameLoop = require('src/GameTypes/GameLoop');
const gameLogic = require('src/GameTypes/GameLogic');
 
var classConstructor = function() {
	function init(rootNodeSelector) {
		
		let  gameState = {
			currentLevel : 1
		}
		
		const keyboardListener = new KeyboardListener();
		

		
		// ASSETS PRELOADING
		const manifest = {
			bundles : [
				{
					name : 'backgrounds',
					assets : [
						{name : 'bgBack', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Blue Nebula/Blue Nebula 1 - 1024x1024.png'}
					]
				},
				{
					name : 'spaceShips',
					assets : [
						{name : 'mainSpaceShip', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/04/Spaceship_04_YELLOW.png'},
						{name : 'foeSpaceShip01', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/03/Spaceship_03_RED.png'},
						{name : 'foeSpaceShip02', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/02/Spaceship_02_PURPLE.png'},
						{name : 'foeSpaceShip03', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/06/Spaceship_06_BLUE.png'}
					]
				},
				{
					name : 'flames',
					assets : [
						{name : 'flamesTilemap', srcs : 'plugins/ShootEmUp/assets/ships/Flames_tilemap.png'},
						{name : 'fireballsTilemap', srcs : 'plugins/ShootEmUp/assets/Fireball_sprite.png'},
						{name : 'impactTilemap', srcs : 'plugins/ShootEmUp/assets/Impact_sprite.png'}
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
			const gameLoop = new GameLoop(windowSize);
			
			
			
			// BACKGROUND
			const bgZoom = 1.8;
			const worldMap = new TilingSprite(
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
				loadedAssets[2].flamesTilemap
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
			let foeSpaceShipsRegister = [], foeSpaceShipsTweensRegister = [];
			function addFoeSpaceShips() {
				let foeSpaceShip, foeCount = 0, foeCell, foePosition, randomFoeSeed, randomFoe, foeSpaceShipTween;
				while (foeCount < levels[gameState.currentLevel]) {
					foeCell = getFoeCell();
					foePosition = new CoreTypes.Point(
						parseInt(gridCoords.x[foeCell.x] + cellSize / 2),
						parseInt(gridCoords.y[foeCell.y] - cellSize * 2)
					);
					
					randomFoeSeed = gameState.currentLevel < 3 ? Object.keys(loadedAssets[1]).length - 2 : Object.keys(loadedAssets[1]).length - 1;
					randomFoe = getRandomFoe(randomFoeSeed).toString();
					
					foeSpaceShip = new FoeSpaceShip(
						foePosition,
						foeCell,
						loadedAssets[1]['foeSpaceShip0' + randomFoe],
						lifePoints[randomFoe - 1]
					);
					
					foeSpaceShipsRegister.push(foeSpaceShip.spriteObj);
					
					foeSpaceShipTween = new Tween(windowSize, foeSpaceShip.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 7), .1);
					foeSpaceShipsTweensRegister.push(foeSpaceShipTween);
					
					gameLoop.pushTween(foeSpaceShipTween);
					gameLoop.stage.addChild(foeSpaceShip.spriteObj);
					foeCount++;
				}
			}
			addFoeSpaceShips();
			
			
			// FIREBALLS
			let fireballsRegister = [], fireballsTweensRegister = [];
			function launchFireball() {
				const fireballDimensions = new CoreTypes.Dimension(125, 125);
				const startPosition = new CoreTypes.Point(
					mainSpaceShipSprite.spriteObj.x + mainSpaceShipDimensions.x.value / 2 - fireballDimensions.x.value / 2,
					mainSpaceShipSprite.spriteObj.y - fireballDimensions.y.value + 38		// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
				);
				
				const fireball = new Projectile(
					startPosition,
					fireballDimensions,
					loadedAssets[2].fireballsTilemap,
					1
				)
				fireballsRegister.push(fireball.spriteObj);
				
				const fireballTween = new TileToggleMovingTween(windowSize, fireball.spriteObj, CoreTypes.TweenTypes.add, startPosition, new CoreTypes.Point(0, -25), .4, false, 12, new CoreTypes.Point(0, 125), 11, 'invert');
				fireballsTweensRegister.push(fireballTween);
				
				gameLoop.pushTween(fireballTween);
				gameLoop.stage.addChild(fireball.spriteObj);
				
				let fireBallCollisionTest;
				foeSpaceShipsRegister.forEach(function(foeSpaceShipSpriteObj) {
					fireBallCollisionTest = new fireBallCollisionTester(fireball.spriteObj, foeSpaceShipSpriteObj);
					gameLoop.pushCollisionTest(fireBallCollisionTest);
					fireballTween.collisionTestsRegister.push(fireBallCollisionTest);
				});
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
					launchFireball();
				}
				else if (keyCode === KeyboardEvents.indexOf('Q') && ctrlKey) {
					gameLoop.stop()
				}
			});
			
			
			
			// GAME LOOP EVENTS
			gameLoop.addEventListener('foeSpaceShipOutOfScreen', function(e) {
				gameLogic.handleFoeSpaceShipOutOfScreen(
					gameLoop,
					e.data,
					foeSpaceShipsRegister,
					foeSpaceShipsTweensRegister
				);
			});
			gameLoop.addEventListener('foeSpaceShipDamaged', function(e) {
				gameLogic.handleFoeSpaceShipDamaged(
					gameLoop,
					foeSpaceShipsRegister,
					foeSpaceShipsTweensRegister,
					fireballsRegister,
					fireballsTweensRegister,
					e.data[1],
					e.data[0],
					loadedAssets
				);
			});
			gameLoop.addEventListener('foeSpaceShipDestroyed', function(e) {
				gameLogic.shouldChangeLevel(
					gameState,
					foeSpaceShipsRegister,
					addFoeSpaceShips
				);
			});
			gameLoop.addEventListener('fireballOutOfScreen', function(e) {
				gameLogic.handleFireballOutOfScreen(
					gameLoop,
					e.data,
					fireballsRegister,
					fireballsTweensRegister
				);
			});
			gameLoop.addEventListener('mainSpaceShipOutOfScreen', function(e) {
				console.log('mainSpaceShipOutOfScreen', e.data);
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