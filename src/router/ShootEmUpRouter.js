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
const GameLoop = require('src/GameTypes/GameLoop');
 
var classConstructor = function() {
	function init(rootNodeSelector) {
		
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
						{name : 'foeSpaceShip', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/03/Spaceship_03_RED.png'}
					]
				},
				{
					name : 'flames',
					assets : [
						{name : 'flamesTilemap', srcs : 'plugins/ShootEmUp/assets/ships/flames_tilemap.png'},
						{name : 'fireballsTilemap', srcs : 'plugins/ShootEmUp/assets/fireball_sprite.png'}
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
			3 : 10 
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
			const worldMapTween = new TileTween(worldMap.spriteObj, 'add', new CoreTypes.Point(0, 25), .1);
			gameLoop.pushTween(worldMapTween);
			gameLoop.stage.addChild(worldMap.spriteObj);
			
			
			
			// MAIN SPACESHIP
			const mainSpaceShipContainer = new PIXI.Container();
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
			const flameTween = new TileToggleTween(flameTileSprite.spriteObj, 'add', new CoreTypes.Point(0, 0), .1, false, 2);
			gameLoop.pushTween(flameTween);
			
			mainSpaceShipContainer.addChild(flameTileSprite.spriteObj);
			mainSpaceShipContainer.x = windowSize.x.value / 2 - mainSpaceShipDimensions.x.value / 2;
			mainSpaceShipContainer.y = windowSize.y.value - mainSpaceShipDimensions.y.value;
			gameLoop.stage.addChild(mainSpaceShipContainer);
			
			
			
			// FOE SPACESHIPS
			let foeCount = 0, foeCell, foePosition;
			const foeSpaceShipDimensions = new CoreTypes.Dimension(120, 120);
			while (foeCount < levels[1]) {
				foeCell = getFoeCell();
				foePosition = new CoreTypes.Point(
					gridCoords.x[foeCell.x] + cellSize / 2 - foeSpaceShipDimensions.x.value / 2	+ cellSize,
					gridCoords.y[foeCell.y] - cellSize
				);
				
				const foeSpaceShipSprite = new Sprite(
					foePosition,
					foeSpaceShipDimensions,
					loaded[1].foeSpaceShip,
					180
				);
				const foeSpaceShipTween = new Tween(foeSpaceShipSprite.spriteObj, 'add', new CoreTypes.Point(0, 7), .1);
				gameLoop.pushTween(foeSpaceShipTween);
				gameLoop.stage.addChild(foeSpaceShipSprite.spriteObj);
				foeCount++;
			}
			
			
			
			// FIREBALLS
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
				fireballSprite.spriteObj.x = startPosition.x.value;
				fireballSprite.spriteObj.y = startPosition.y.value;
				const fireballTween = new TileToggleMovingTween(fireballSprite.spriteObj, 'add', new CoreTypes.Point(0, -125), 1, false, 12, startPosition, new CoreTypes.Point(0, -25), .2, 'invert');
				gameLoop.pushTween(fireballTween);
				gameLoop.stage.addChild(fireballSprite.spriteObj);
			}
			
			
			
			
			
			
			
			// KEYBOARD HANDLING
			keyboardListener.addEventListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if (keyCode === KeyboardEvents.indexOf('LEFT')) {
					const mainSpaceShipeTween = new Tween(mainSpaceShipContainer, 'add', new CoreTypes.Point(-30, 0), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT')) {
					const mainSpaceShipeTween = new Tween(mainSpaceShipContainer, 'add', new CoreTypes.Point(30, 0), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('UP')) {
					const mainSpaceShipeTween = new Tween(mainSpaceShipContainer, 'add', new CoreTypes.Point(0, -30), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN')) {
					const mainSpaceShipeTween = new Tween(mainSpaceShipContainer, 'add', new CoreTypes.Point(0, 30), 1, true);
					gameLoop.pushTween(mainSpaceShipeTween);

				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					launchFireball();
				}
			});
			
			
			
			
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