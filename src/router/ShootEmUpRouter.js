/**
 * @router DevToolsStructRouter 
 */

const FontFaceObserver = require('src/utilities/fontfaceobserver');
const KeyboardEvents = require('src/events/JSKeyboardMap');
const KeyboardListener = require('src/events/GameKeyboardListener');
const {throttle} = require('src/core/commonUtilities');
const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const PropertyCache = require('src/core/PropertyCache').ObjectCache;

const AssetsLoader = require('src/GameTypes/gameSingletons/AssetsLoader');
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
	/** @type {(rootNodeSelector:String) => Void}} */
	function init(rootNodeSelector) {
		const keyboardListener = new KeyboardListener();
		
		AssetsLoader().then(function(loadedAssets) {
			(new FontFaceObserver('Showcard Gothic'))
				.load().then(onLoaded.bind(null, loadedAssets))
		})
		
		
		
		// ONLOADED => GAME INIT
		/** 
		 * @type {(loadedAssets:Array<Object>) => Void}
		 */
		function onLoaded(loadedAssets) {
			console.log('Ctrl + Q to stop the game loop');
			
			
			// BACKGROUND
			const bgZoom = 1.8;
			const worldMapBack = new TilingSprite(
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				// @ts-ignore loadedAssets.prop unknown
				loadedAssets[0].bgBack,
				bgZoom,
				null
			);
			const worldMapBackTween = new TileTween(windowSize, worldMapBack, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 25), .1, false);
			// @ts-ignore GameLoop() expects 1 argument 
			GameLoop().addAnimatedSpriteToScene(worldMapBack, worldMapBackTween);
			
			const worldMapMiddle = new TilingSprite(
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				// @ts-ignore loadedAssets.prop unknown
				loadedAssets[0].bgMiddle,
				1,
				null
			);
			// @ts-ignore blendMode
			worldMapMiddle.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
			const worldMapMiddleTween = new TileTween(windowSize, worldMapMiddle, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 12), .1, false);
			// @ts-ignore GameLoop() expects 1 argument 
			GameLoop().addAnimatedSpriteToScene(worldMapMiddle, worldMapMiddleTween);
			
			const worldMapFront = new TilingSprite(
				new CoreTypes.Dimension(windowSize.x.value, windowSize.y.value),
				// @ts-ignore loadedAssets.prop unknown
				loadedAssets[0].bgFront,
				.3,
				null
			);
			// @ts-ignore blendMode
			worldMapFront.spriteObj.blendMode = PIXI.BLEND_MODES.ADD;
			const worldMapFrontTween = new TileTween(windowSize, worldMapFront, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 3), .1, false);
			// @ts-ignore GameLoop() expects 1 argument 
			GameLoop().addAnimatedSpriteToScene(worldMapFront, worldMapFrontTween);
			
			
			
			// MAIN SPACESHIP
			const mainSpaceShipStartPosition = new CoreTypes.Point(
				windowSize.x.value / 2 - MainSpaceShip.prototype.defaultSpaceShipDimensions.x.value / 2,
				windowSize.y.value - MainSpaceShip.prototype.defaultSpaceShipDimensions.y.value
			);
			const mainSpaceShipSprite = new MainSpaceShip(
				mainSpaceShipStartPosition,
				// @ts-ignore loadedAssets.prop unknown
				loadedAssets[1].mainSpaceShip,
				// @ts-ignore loadedAssets.prop unknown
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
				6,
				'',
				false
			);
			// @ts-ignore GameLoop() expects 1 argument 
			GameLoop().addAnimatedSpriteToScene(mainSpaceShipSprite, flameTween);
			
			
			
			
			
			
			// PLAYER INSTANCIATION : After Having got our mainSpaceShip
			const player = Player({
				foeSpaceShipsRegister : new PropertyCache('foeSpaceShipsRegister'),
				foeSpaceShipsTweensRegister : new PropertyCache('foeSpaceShipsTweensRegister'),
				foeSpaceShipsCollisionTestsRegister : new PropertyCache('foeSpaceShipsCollisionTestsRegister'),
				mainSpaceShip : mainSpaceShipSprite
			});
			
			
			
			// FOE SPACESHIPS
			function addFoeSpaceShips() {
				let partialFoeSpaceShipsRegister = [];
				let foeSpaceShip, foeCount = 0, shieldedFoeCount = 0, foeCell, foePosition, randomFoeSeed, randomFoe, foeSpaceShipTween;
				while (foeCount < levels[GameState().currentLevel.toString()].foeCount) {
					
					foeCell = getFoeCell();
					foePosition = new CoreTypes.Point(
						gridCoords.x[foeCell.x] + cellSize / 2,
						gridCoords.y[foeCell.y] - cellSize * 2
					);
					
					randomFoeSeed = GameState().currentLevel < 3 ? Object.keys(loadedAssets[1]).length - 4 : Object.keys(loadedAssets[1]).length - 3;
					randomFoe = gameLogic.getRandomFoe(randomFoeSeed);
					
					// DEBUG
//					randomFoe = '2';
					
					foeSpaceShip = new FoeSpaceShip(
						foePosition,
						foeCell,
						// @ts-ignore loadedAssets.prop unknown
						loadedAssets[1]['foeSpaceShip0' + randomFoe],
						randomFoe
					);
					
					if (parseInt(randomFoe) > 0 && shieldedFoeCount <= levels[GameState().currentLevel].shieldedFoeCount - 1) {
						foeSpaceShip.hasShield = true;
						shieldedFoeCount++;
					}
					
					partialFoeSpaceShipsRegister.push(foeSpaceShip);
					// @ts-ignore UID is inherited
					player.foeSpaceShipsRegister.setItem(foeSpaceShip.UID, foeSpaceShip);
					// @ts-ignore : TS doesn't understand anything to prototypal inheritance (foeSpaceShip IS an instance of a Sprite)
					foeSpaceShipTween = new Tween(windowSize, foeSpaceShip, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 7), .1, false);
					// @ts-ignore UID is inherited
					player.foeSpaceShipsTweensRegister.setItem(foeSpaceShip.UID, foeSpaceShipTween);
					
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().addAnimatedSpriteToScene(foeSpaceShip, foeSpaceShipTween);
					foeCount++;
				}
				let mainSpaceShipCollisionTest;
				partialFoeSpaceShipsRegister.forEach(function(foeSpaceShipSpriteObj) {
					// @ts-ignore inherited props on mainSpaceShipSprite
					mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(mainSpaceShipSprite, foeSpaceShipSpriteObj, 'hostile');
					// @ts-ignore UID is inherited
					Player().foeSpaceShipsCollisionTestsRegister.setItem(foeSpaceShipSpriteObj.UID, mainSpaceShipCollisionTest)
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().pushCollisionTest(mainSpaceShipCollisionTest);
					// @ts-ignore UID is inherited
					Player().foeSpaceShipsTweensRegister.cache[foeSpaceShipSpriteObj.UID].collisionTestsRegister.push(mainSpaceShipCollisionTest);
				});
			}
			addFoeSpaceShips();
			
			

			
			
			
			// PROJECTILES
			const fireballThrottling = 250;
			const launchFireball = throttle(
				/** @type {(type:Number) =>  Void} */
				function (type) {
					const startPosition = new CoreTypes.Point(
						// @ts-ignore x is inherited
						mainSpaceShipSprite.x + mainSpaceShipSprite.defaultSpaceShipDimensions.x.value / 2,
						// @ts-ignore y is inherited
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
			// @ts-ignore : TS doesn't understand anything to prototypal inheritance (mainSpaceShipSprite IS an instance of a Sprite)
			const mainSpaceShipeLeftTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(-10, 0), 1, false);
			// @ts-ignore : TS doesn't understand anything to prototypal inheritance (mainSpaceShipSprite IS an instance of a Sprite)
			const mainSpaceShipeRightTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(10, 0), 1, false);
			// @ts-ignore : TS doesn't understand anything to prototypal inheritance (mainSpaceShipSprite IS an instance of a Sprite)
			const mainSpaceShipeUpTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, -10), 1, false);
			// @ts-ignore : TS doesn't understand anything to prototypal inheritance (mainSpaceShipSprite IS an instance of a Sprite)
			const mainSpaceShipeDownTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 10), 1, false);
			/** @type {Number} uid returned by setInterval */
			let interval;
			// @ts-ignore don't know how to type callbacks
			keyboardListener.addOnPressedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if ((keyCode === KeyboardEvents.indexOf('LEFT') || keyCode === KeyboardEvents.indexOf('Q')) && !ctrlKey) {
					mainSpaceShipSprite.rollWingsLeft();
					// @ts-ignore GameLoop() expects 1 argument 
					mainSpaceShipeLeftTween.lastStepTimestamp = GameLoop().currentTime;
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().pushTween(mainSpaceShipeLeftTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT') || keyCode === KeyboardEvents.indexOf('D')) {
					mainSpaceShipSprite.rollWingsRight();
					// @ts-ignore GameLoop() expects 1 argument 
					mainSpaceShipeRightTween.lastStepTimestamp = GameLoop().currentTime;
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().pushTween(mainSpaceShipeRightTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('UP') || keyCode === KeyboardEvents.indexOf('Z')) {
					// @ts-ignore GameLoop() expects 1 argument 
					mainSpaceShipeUpTween.lastStepTimestamp = GameLoop().currentTime;
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().pushTween(mainSpaceShipeUpTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN') || keyCode === KeyboardEvents.indexOf('S')) {
					// @ts-ignore GameLoop() expects 1 argument 
					mainSpaceShipeDownTween.lastStepTimestamp = GameLoop().currentTime;
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().pushTween(mainSpaceShipeDownTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					launchFireball(GameState().currentWeapon);
					
					interval = setInterval(function() {
						launchFireball(GameState().currentWeapon);
					}, fireballThrottling);
				}
			});
			// @ts-ignore don't know how to type callbacks
			keyboardListener.addOnReleasedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if ((keyCode === KeyboardEvents.indexOf('LEFT') || keyCode === KeyboardEvents.indexOf('Q')) && !ctrlKey) {
					mainSpaceShipSprite.rollWingsFlat();
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().removeTween(mainSpaceShipeLeftTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT') || keyCode === KeyboardEvents.indexOf('D')) {
					mainSpaceShipSprite.rollWingsFlat();
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().removeTween(mainSpaceShipeRightTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('UP') || keyCode === KeyboardEvents.indexOf('Z')) {
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().removeTween(mainSpaceShipeUpTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN') || keyCode === KeyboardEvents.indexOf('S')) {
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().removeTween(mainSpaceShipeDownTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					clearInterval(interval);
				}
				else if (keyCode === KeyboardEvents.indexOf('Q') && ctrlKey) {
					// @ts-ignore GameLoop() expects 1 argument 
					GameLoop().stop()
				}
			});
			
			
			
			
			// STATUS BAR
			const statusBar = new StatusBarSprite(
				windowSize,
				// @ts-ignore loadedAssets.prop unknown
				loadedAssets[0].statusBarLeft,
				null
			)
			// @ts-ignore GameLoop() expects 1 argument 
			GameLoop().addSpriteToScene(statusBar.gameStatusSpriteObj);
			// @ts-ignore GameLoop() expects 1 argument 
			GameLoop().stage.addChild(statusBar.textForLevelSpriteObj);
			// @ts-ignore GameLoop() expects 1 argument 
			GameLoop().stage.addChild.apply(GameLoop().stage, statusBar.textForScoreSpriteObj);
			
			
			
			// GAME LOOP EVENTS
			// @ts-ignore don't know how to type callbacks
			GameLoop().addEventListener('foeSpaceShipOutOfScreen', function(e) {
				gameLogic.handleFoeSpaceShipOutOfScreen(
					e.data
				);
			});
			// @ts-ignore don't know how to type callbacks
			GameLoop().addEventListener('foeSpaceShipDamaged', function(e) {
				gameLogic.handleFoeSpaceShipDamaged(
					e.data[1],
					e.data[0],
					loadedAssets,
					statusBar.textForScoreSpriteObj[1]
				);
			});
			// @ts-ignore don't know how to type callbacks
			GameLoop().addEventListener('foeSpaceShipDestroyed', function(e) {
				gameLogic.shouldChangeLevel(
					statusBar.textForLevelSpriteObj,
					addFoeSpaceShips
				);
			});
			// @ts-ignore don't know how to type callbacks
			GameLoop().addEventListener('mainSpaceShipPowerUp', function(e) {
				gameLogic.handlePowerUp(
					e.data[1],
					statusBar.gameStatusSpriteObj
				);
			});
			// @ts-ignore don't know how to type callbacks
			GameLoop().addEventListener('fireballOutOfScreen', function(e) {
				gameLogic.handleFireballOutOfScreen(
					e.data
				);
			});
			// @ts-ignore don't know how to type callbacks
			GameLoop().addEventListener('mainSpaceShipOutOfScreen', function(e) {
				gameLogic.handleMainSpaceShipOutOfScreen(
					windowSize
				);
			});
			// @ts-ignore don't know how to type callbacks
			GameLoop().addEventListener('mainSpaceShipDamaged', function(e) {
				gameLogic.handleMainSpaceShipDamaged(
					e.data[1],
					loadedAssets,
					statusBar
				);

			});
			// @ts-ignore don't know how to type callbacks
			GameLoop().addEventListener('disposableSpriteAnimationEnded', function(e) {
				gameLogic.handleDisposableSpriteAnimationEnded(
					e.data
				);
			});

			
			
			
			// GAME LAUNCH
			// @ts-ignore GameLoop() expects 1 argument 
			document.querySelector(rootNodeSelector).appendChild(GameLoop().renderer.view);
			// @ts-ignore GameLoop() expects 1 argument 
			GameLoop().start();
		}
		
		
	}
	
	return {
		init : init
	}
}
module.exports = classConstructor;