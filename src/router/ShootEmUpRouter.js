/**
 * @router DevToolsStructRouter 
 */

const CoreTypes = require('src/GameTypes/CoreTypes');
const KeyboardEvents = require('src/events/JSKeyboardMap');
const KeyboardListener = require('src/events/KeyboardListener');
const Sprite = require('src/GameTypes/Sprite');
const TilingSprite = require('src/GameTypes/TilingSprite');

const Tween = require('src/GameTypes/Tween');
const TileTween = require('src/GameTypes/TileTween');
const TileToggleTween = require('src/GameTypes/TileToggleTween');
const TileToggleMovingTween = require('src/GameTypes/TileToggleMovingTween');

const spaceShipCollisionTester = require('src/GameTypes/spaceShipCollisionTester');
const fireBallCollisionTester = require('src/GameTypes/fireBallCollisionTester');

const GameLoop = require('src/GameTypes/GameLoop');
 
var classConstructor = function() {
	function init(rootNodeSelector) {
		
		let  gameState = {
			currentLevel : 1
		}
		const windowSize = new CoreTypes.Dimension(950, 950);
		const keyboardListener = new KeyboardListener();
		
		
		
		// GRID CELLS UTILITIES FOR FOE SPACESHIPS
		const gridCells = new CoreTypes.Dimension(8, 4);
		const cellSize = windowSize.x.value / gridCells.x.value;
		let occupiedCells = Array(gridCells.x.value);
		for (let c = 0, l = gridCells.x.value; c < l; c++) {
				occupiedCells[c] = Array(gridCells.y.value);
		}
		
		let gridCoords = {
			x : [],
			y : []
		};
		
		(function getCellCoords() {
			for (let i = 0, l = gridCells.x.value; i < l; i++) {
				gridCoords.x.push(i * cellSize);
			}
			for (let i = 0, l = gridCells.y.value; i < l; i++) {
				gridCoords.y.push(i * cellSize);
			}
		})();
		
		function getRandomCell() {
			const x = Math.floor(Math.random() * gridCells.x.value);
			const y = Math.floor(Math.random() * gridCells.y.value);
			return {
				x : x,
				y : y
			}
		}
		
		function isOccupiedCell(x, y) {
			return occupiedCells[x][y] === true;
		}
		
		function getFoeCell() {
			let foeCell = getRandomCell();
			if (isOccupiedCell(foeCell.x, foeCell.y)) {
				while (isOccupiedCell(foeCell.x, foeCell.y)) {
					foeCell = getRandomCell();
				}
			}
			else {
				occupiedCells[foeCell.x][foeCell.y] = true;
				return foeCell;
			}
			occupiedCells[foeCell.x][foeCell.y] = true;
			return foeCell;
		}
		
		function getRandomFoe(count) {
			return Math.floor(Math.random() * count) + 1;
		}
		
		
		
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
						{name : 'fireballsTilemap', srcs : 'plugins/ShootEmUp/assets/Fireball_sprite.png'}
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
		
		
		
		// DRAFT FOR FUTURE LEVELS
		const levels = {
			1 : 6,
			2 : 8,
			3 : 10,
			4 : 14,
			5 : 20,
			6 : 28
		}
		
		
		
		// ONLOADED => GAME INIT
		function onLoaded(loaded) {
			const gameLoop = new GameLoop(windowSize);
			
			
			
			// BACKGROUND
			const bgZoom = 1.8;
			const worldMap = new TilingSprite(
				new CoreTypes.Point(-(windowSize.x.value * bgZoom - windowSize.x.value) / 2, 0),
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				loaded[0].bgBack,
				bgZoom
			);
			worldMap.spriteObj.name = 'bgLayer01';
			const worldMapTween = new TileTween(windowSize, worldMap.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 25), .1);
			gameLoop.pushTween(worldMapTween);
			gameLoop.stage.addChild(worldMap.spriteObj);
			
			
			
			// MAIN SPACESHIP
			const mainSpaceShipContainer = new PIXI.Container();
			mainSpaceShipContainer.name = 'mainSpaceShipSprite';
			const mainSpaceShipDimensions = new CoreTypes.Dimension(200, 200);
			const mainSpaceShipSprite = new Sprite(
				new CoreTypes.Point(0, 0),
				mainSpaceShipDimensions,
				loaded[1].mainSpaceShip
			);
			mainSpaceShipContainer.addChild(mainSpaceShipSprite.spriteObj);
			const flameTileDimensions = new CoreTypes.Dimension(34, 83);
			const flameTileSprite = new TilingSprite(
				new CoreTypes.Point(0, 0),
				flameTileDimensions,
				loaded[2].flamesTilemap
			);
			flameTileSprite.spriteObj.x = mainSpaceShipDimensions.x.value / 2 - flameTileDimensions.x.value / 2;
			flameTileSprite.spriteObj.y = mainSpaceShipDimensions.y.value - flameTileDimensions.y.value / 2;
			flameTileSprite.spriteObj.name = 'flameSprite';
			const flameTween = new TileToggleTween(windowSize, flameTileSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 0), .1, false, 2);
			gameLoop.pushTween(flameTween);
			
			mainSpaceShipContainer.addChild(flameTileSprite.spriteObj);
			mainSpaceShipContainer.x = windowSize.x.value / 2 - mainSpaceShipDimensions.x.value / 2;
			mainSpaceShipContainer.y = windowSize.y.value - mainSpaceShipDimensions.y.value;
			gameLoop.stage.addChild(mainSpaceShipContainer);
			
			
			
			// FOE SPACESHIPS
			let foeSpaceShipsRegister = [], foeSpaceShipsTweensRegister = [];
			const foeSpaceShipDimensions = new CoreTypes.Dimension(120, 120);
			function addFoeSpaceShips() {
				let foeCount = 0, foeCell, foePosition;
				console.log(gameState.currentLevel, levels[gameState.currentLevel]);
				while (foeCount < levels[gameState.currentLevel]) {
					foeCell = getFoeCell();
					foePosition = new CoreTypes.Point(
						parseInt(gridCoords.x[foeCell.x] + cellSize / 2),
						parseInt(gridCoords.y[foeCell.y] - cellSize * 2)
					);
					
					const randomFoeSeed = gameState.currentLevel < 3 ? Object.keys(loaded[1]).length - 2 : Object.keys(loaded[1]).length - 1;
					const randomFoe = getRandomFoe(randomFoeSeed).toString();
					
					const foeSpaceShipSprite = new Sprite(
						foePosition,
						foeSpaceShipDimensions,
						loaded[1]['foeSpaceShip0' + randomFoe],
						180
					);
					foeSpaceShipSprite.spriteObj.anchor.set(0.5);
					foeSpaceShipSprite.spriteObj.name = 'foeSpaceShipSprite';
					foeSpaceShipSprite.spriteObj.cell = foeCell;
					foeSpaceShipsRegister.push(foeSpaceShipSprite.spriteObj);
					
					const foeSpaceShipTween = new Tween(windowSize, foeSpaceShipSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 7), .1);
					foeSpaceShipsTweensRegister.push(foeSpaceShipTween);
					
					gameLoop.pushTween(foeSpaceShipTween);
					gameLoop.stage.addChild(foeSpaceShipSprite.spriteObj);
					foeCount++;
				}
			}
			addFoeSpaceShips();
			
			
			// FIREBALLS
			let fireballsRegister = [], fireballsTweensRegister = [];
			function launchFireball() {
				const fireballDimensions = new CoreTypes.Dimension(125, 125);
				const startPosition = new CoreTypes.Point(
					mainSpaceShipContainer.x + mainSpaceShipDimensions.x.value / 2 - fireballDimensions.x.value / 2,
					mainSpaceShipContainer.y - fireballDimensions.y.value + 38		// WARNING: magic number : the mainSpaceShip's sprite doesn't occupy the whole height of its container
				);
				const fireballSprite = new TilingSprite(
					new CoreTypes.Point(0, 0),
					fireballDimensions,
					loaded[2].fireballsTilemap
				);
				fireballSprite.spriteObj.name = 'fireballSprite';
				fireballSprite.spriteObj.x = startPosition.x.value;
				fireballSprite.spriteObj.y = startPosition.y.value;
				fireballsRegister.push(fireballSprite.spriteObj);
				
				const fireballTween = new TileToggleMovingTween(windowSize, fireballSprite.spriteObj, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, -125), 1, false, 12, startPosition, new CoreTypes.Point(0, -25), .2, 'invert');
				fireballsTweensRegister.push(fireballTween);
				
				gameLoop.pushTween(fireballTween);
				gameLoop.stage.addChild(fireballSprite.spriteObj);
				
				let fireBallCollisionTest;
				foeSpaceShipsRegister.forEach(function(foeSpaceShipSpriteObj) {
					fireBallCollisionTest = new fireBallCollisionTester(fireballSprite.spriteObj, foeSpaceShipSpriteObj);
					gameLoop.pushCollisionTest(fireBallCollisionTest);
					fireballTween.collisionTestsRegister.push(fireBallCollisionTest);
				});
			}
			
			
			
			
			// KEYBOARD HANDLING
			keyboardListener.addEventListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if (keyCode === KeyboardEvents.indexOf('LEFT')) {
					const mainSpaceShipeTween = new Tween(windowSize, mainSpaceShipContainer, CoreTypes.TweenTypes.add, new CoreTypes.Point(-30, 0), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT')) {
					const mainSpaceShipeTween = new Tween(windowSize, mainSpaceShipContainer, CoreTypes.TweenTypes.add, new CoreTypes.Point(30, 0), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('UP')) {
					const mainSpaceShipeTween = new Tween(windowSize, mainSpaceShipContainer, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, -30), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN')) {
					const mainSpaceShipeTween = new Tween(windowSize, mainSpaceShipContainer, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 30), 1, true);
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
				console.log('foeSpaceShipOutOfScreen')
				let spritePos = foeSpaceShipsRegister.indexOf(e.data);
				foeSpaceShipsRegister.splice(spritePos, 1);
				spritePos = gameLoop.stage.children.indexOf(e.data);
				gameLoop.stage.children.splice(spritePos, 1);
			});
			gameLoop.addEventListener('foeSpaceShipDestroyed', function(e) {
				console.log('foeSpaceShipDestroyed');
				const destroyedFoeSpaceShip = e.data[1];
				const explodedFireball = e.data[0];
				
				// foeSpaceShipSprite removal from the gameLoop & scene
				let spritePos = foeSpaceShipsRegister.indexOf(destroyedFoeSpaceShip);
				foeSpaceShipsRegister.splice(spritePos, 1);
				gameLoop.removeTween(foeSpaceShipsTweensRegister[spritePos]);
				foeSpaceShipsTweensRegister.splice(spritePos, 1);
				
				spritePos = gameLoop.stage.children.indexOf(destroyedFoeSpaceShip);
				gameLoop.stage.children.splice(spritePos, 1);
				
				// fireball removal from the gameLoop & scene
				spritePos = fireballsRegister.indexOf(explodedFireball);
				fireballsRegister.splice(spritePos, 1);
				gameLoop.removeTween(fireballsTweensRegister[spritePos]);
				fireballsTweensRegister.splice(spritePos, 1);
				
				spritePos = gameLoop.stage.children.indexOf(explodedFireball);
				gameLoop.stage.children.splice(spritePos, 1);
				
				// prepare to load more foeSpaceShips
				occupiedCells[destroyedFoeSpaceShip.cell.x][destroyedFoeSpaceShip.cell.y] = false;
				shouldChangeLevel();
			});
			gameLoop.addEventListener('fireballOutOfScreen', function(e) {
				let spritePos = fireballsRegister.indexOf(e.data);
				fireballsRegister.splice(spritePos, 1);
				gameLoop.removeTween(fireballsTweensRegister[spritePos]);
				fireballsTweensRegister.splice(spritePos, 1);
				
				spritePos = gameLoop.stage.children.indexOf(e.data);
				gameLoop.stage.children.splice(spritePos, 1);
			});
			gameLoop.addEventListener('mainSpaceShipOutOfScreen', function(e) {
				console.log('mainSpaceShipOutOfScreen', e.data);
			});
			
			
			
			//  LEVEL UP CONDITION
			function shouldChangeLevel() {
				if (foeSpaceShipsRegister.length === 1 && gameState.currentLevel < 6) {
					gameState.currentLevel++
					addFoeSpaceShips();
					console.log(foeSpaceShipsRegister.length)
				}
			}
			
			
			
			// GAME LAUNCH
			document.querySelector(rootNodeSelector).appendChild(gameLoop.renderer.view);
			gameLoop.start();
			window.gameLoop = gameLoop;
			
//			setTimeout(function() {
//				gameLoop.stop();
//			}, 5000)
		}
		
		
	}
	
	return {
		init : init
	}
}
module.exports = classConstructor;