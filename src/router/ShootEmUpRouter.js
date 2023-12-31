 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 */

/**
 * @router DevToolsStructRouter 
 */

const FontFaceObserver = require('src/utilities/fontfaceobserver');
const KeyboardEvents = require('src/events/JSKeyboardMap');
const KeyboardListener = require('src/events/GameKeyboardListener');
const {throttle} = require('src/core/commonUtilities');
const PropertyCache = require('src/core/PropertyCache').ObjectCache;

const AssetsLoader = require('src/GameTypes/gameSingletons/AssetsLoader');
const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
// cellSize, gridCoords, occupiedCells, getFoeCell
const {windowSize} = require('src/GameTypes/grids/gridManager');
// foeDescriptors, mainSpaceShipLifePoints, weapons, 
const {levels, objectTypes} = require('src/GameTypes/gameSingletons/gameConstants');

const Player = require('src/GameTypes/gameSingletons/Player');
let GameState = require('src/GameTypes/gameSingletons/GameState');
const GameLoop = require('src/GameTypes/gameSingletons/GameLoop');
// Singleton init
GameLoop(windowSize);
const gameLogic = require('src/GameTypes/gameSingletons/gameLogic');

const GameObjectsFactory = require('src/GameTypes/factories/GameObjectsFactory');
// Singleton init
GameObjectsFactory();

//const Sprite = require('src/GameTypes/sprites/Sprite');
//const TilingSprite = require('src/GameTypes/sprites/TilingSprite');

const Tween = require('src/GameTypes/tweens/Tween');
//const TileTween = require('src/GameTypes/tweens/TileTween');
//const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');
//const TileToggleMovingTween = require('src/GameTypes/tweens/TileToggleMovingTween');
const RecurringCallbackTween = require('src/GameTypes/tweens/RecurringCallbackTween');
//
//const MainSpaceShip = require('src/GameTypes/sprites/MainSpaceShip');
//const FoeSpaceShip = require('src/GameTypes/sprites/FoeSpaceShip');
//const StatusBarSprite = require('src/GameTypes/sprites/StatusBarSprite');
//const ProjectileFactory = require('src/GameTypes/factories/ProjectileFactory');
//
//const spaceShipCollisionTester = require('src/GameTypes/collisionTests/spaceShipCollisionTester');
//const fireBallCollisionTester = require('src/GameTypes/collisionTests/fireBallCollisionTester');
const mainSpaceShipCollisionTester = require('src/GameTypes/collisionTests/mainSpaceShipCollisionTester');




var classConstructor = function() {
	/** @type {(rootNodeSelector:String) => Void}} */
	function init(rootNodeSelector) {
		const keyboardListener = new KeyboardListener();
		
		// @ts-ignore style isn't a prop of Element ? wtf! https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
		document.querySelector('#ready').style.visibility = 'visible';
		const spinner = document.querySelector('#loading_spinner_2');
		// @ts-ignore style isn't a prop of Element ? wtf! https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
		spinner.style.opacity = 1;
		// @ts-ignore style isn't a prop of Element ? wtf! https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
		spinner.style.display = 'flex';
		const loadingText = document.createElement('span');
		loadingText.textContent = "Loading Assets..."
		spinner.append(loadingText);
		
		AssetsLoader.then(function(loadedAssets) {
			(new FontFaceObserver('Showcard Gothic'))
				.load().then(function() {
					/** @type {Array<Sprite|Tween>} */
					let titleSprite;
					// @ts-ignore
					document.querySelector('#ready').style.visibility = 'hidden';
					
					// FIRST INTERACT FOR WEB AUDIO
					let firstInteract = false;
					// @ts-ignore callback
					keyboardListener.addOnReleasedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
						if (!firstInteract && keyCode === KeyboardEvents.indexOf('ENTER')) {
							firstInteract = true;
							GameLoop().removeTween(titleSprite[1]);
							GameLoop().removeSpriteFromScene(titleSprite[0]);
							onLoaded(loadedAssets);
						}
						else if (keyCode === KeyboardEvents.indexOf('Q') && ctrlKey) {
							GameLoop().stop();
							loadedAssets[4].levelTheme.stop();
							loadedAssets[4].bossTheme.stop();
						}
					});
					
					// INTRO TITLE
					titleSprite = GameObjectsFactory().newObject(objectTypes.infiniteTitle, true, ['Press Enter', true]);
					
					// GAME LAUNCH
					document.querySelector(rootNodeSelector).appendChild(GameLoop().renderer.view);
					GameLoop().start();
				})
		})
		
		
		
		// ONLOADED => GAME INIT
		/** 
		 * @type {(loadedAssets:Array<Object>) => Void}
		 */
		function onLoaded(loadedAssets) {
			console.log('Ctrl + Q to stop the game loop');
			
			// @ts-ignore levelTheme isn't typed
			loadedAssets[4].levelTheme.play({volume : 0.02, loop : true});
			
			// BACKGROUND
			GameObjectsFactory().newObject(objectTypes.background);
			
			// INTRO TITLE
			GameObjectsFactory().newObject(objectTypes.title, true, ['Space Fleet', true]);
			
			// MAIN SPACESHIP
			const mainSpaceShipSprite = GameObjectsFactory().newObject(objectTypes.mainSpaceShip);
			
			// PLAYER INSTANCIATION : After Having got our mainSpaceShip
			Player({
				foeSpaceShipsRegister : new PropertyCache('foeSpaceShipsRegister'),
				foeSpaceShipsTweensRegister : new PropertyCache('foeSpaceShipsTweensRegister'),
				foeSpaceShipsCollisionTestsRegister : new PropertyCache('foeSpaceShipsCollisionTestsRegister'),
				lootsCollisionTestsRegister : new PropertyCache('lootsCollisionTestsRegister'),
				mainSpaceShip : mainSpaceShipSprite
			});
			
			// FOE SPACESHIPS
			function addFoeSpaceShips() {
				let partialFoeSpaceShipsRegister = [];
				let foeSpaceShip, foeCount = 0, shieldedFoeCount = 0;
				while (foeCount < levels[GameState().currentLevel.toString()].foeCount) {
					foeSpaceShip = GameObjectsFactory().newObject(objectTypes.foeSpaceShip, true, [shieldedFoeCount])
					partialFoeSpaceShipsRegister.push(foeSpaceShip);
					foeCount++;
					if (foeSpaceShip.hasShield)
						shieldedFoeCount++;
				}
				let mainSpaceShipCollisionTest;
				partialFoeSpaceShipsRegister.forEach(function(foeSpaceShipSprite) {
					// @ts-ignore inherited props on mainSpaceShipSprite
					mainSpaceShipCollisionTest = new mainSpaceShipCollisionTester(mainSpaceShipSprite, foeSpaceShipSprite, 'hostile');
					// @ts-ignore UID is inherited
					Player().foeSpaceShipsCollisionTestsRegister.setItem(foeSpaceShipSprite.UID, mainSpaceShipCollisionTest)
					
					CoreTypes.tempAsyncCollisionsTests.push(mainSpaceShipCollisionTest);
					// @ts-ignore UID is inherited
					Player().foeSpaceShipsTweensRegister.getItem(foeSpaceShipSprite.UID).collisionTestsRegister.push(mainSpaceShipCollisionTest);
				});
			}
			addFoeSpaceShips();
			
			// PROJECTILES
			const fireballThrottling = 15;
			const launchFireball = throttle(
				GameObjectsFactory().newObject.bind(GameObjectsFactory(), objectTypes.projectiles),
				fireballThrottling * 1000 /60
			);
			
			// STATUS BAR
			const statusBar = GameObjectsFactory().newObject(objectTypes.statusBar);
			
			
			
			// KEYBOARD HANDLING
			// @ts-ignore : TS doesn't understand anything to prototypal inheritance (mainSpaceShipSprite IS an instance of a Sprite)
			const mainSpaceShipeLeftTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(-15, 0), 1, false);
			// @ts-ignore : TS doesn't understand anything to prototypal inheritance (mainSpaceShipSprite IS an instance of a Sprite)
			const mainSpaceShipeRightTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(15, 0), 1, false);
			// @ts-ignore : TS doesn't understand anything to prototypal inheritance (mainSpaceShipSprite IS an instance of a Sprite)
			const mainSpaceShipeUpTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, -15), 1, false);
			// @ts-ignore : TS doesn't understand anything to prototypal inheritance (mainSpaceShipSprite IS an instance of a Sprite)
			const mainSpaceShipeDownTween = new Tween(windowSize, mainSpaceShipSprite, CoreTypes.TweenTypes.add, new CoreTypes.Point(0, 15), 1, false);
			
			const fireTween = new RecurringCallbackTween(launchFireball, fireballThrottling, null, null, '');

			// @ts-ignore : I don't want to type callbacks
			keyboardListener.addOnPressedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if ((keyCode === KeyboardEvents.indexOf('LEFT') || keyCode === KeyboardEvents.indexOf('Q')) && !ctrlKey) {
					mainSpaceShipSprite.rollWingsLeft();
					mainSpaceShipeLeftTween.lastStepTimestamp = GameLoop().currentTime;
					GameLoop().pushTween(mainSpaceShipeLeftTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT') || keyCode === KeyboardEvents.indexOf('D')) {
					mainSpaceShipSprite.rollWingsRight();
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
					launchFireball();
					GameLoop().pushTween(fireTween);
				}
			});
			// @ts-ignore : I don't want to type callbacks
			keyboardListener.addOnReleasedListener(function(originalEvent, ctrlKey, shiftKey, altKey, keyCode) {
				if ((keyCode === KeyboardEvents.indexOf('LEFT') || keyCode === KeyboardEvents.indexOf('Q')) && !ctrlKey) {
					mainSpaceShipSprite.rollWingsFlat();
					GameLoop().removeTween(mainSpaceShipeLeftTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('RIGHT') || keyCode === KeyboardEvents.indexOf('D')) {
					mainSpaceShipSprite.rollWingsFlat();
					GameLoop().removeTween(mainSpaceShipeRightTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('UP') || keyCode === KeyboardEvents.indexOf('Z')) {
					GameLoop().removeTween(mainSpaceShipeUpTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('DOWN') || keyCode === KeyboardEvents.indexOf('S')) {
					GameLoop().removeTween(mainSpaceShipeDownTween);
				}
				else if (keyCode === KeyboardEvents.indexOf('SPACE')) {
					GameLoop().removeTween(fireTween);
				}
			});
			
			
			
			
			
			// GAME LOOP EVENTS
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('foeSpaceShipOutOfScreen', function(e) {
				gameLogic.handleFoeSpaceShipOutOfScreen(
					e.data
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('foeSpaceShipDamaged', function(e) {
				gameLogic.handleFoeSpaceShipDamaged(
					e.data[1],
					e.data[0],
					statusBar.textForScoreSpriteObj[1]
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('foeSpaceShipDestroyed', function(e) {
				gameLogic.shouldChangeLevel(
					statusBar.textForLevelSpriteObj,
					addFoeSpaceShips
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('mainSpaceShipPowerUp', function(e) {
				gameLogic.handlePowerUp(
					e.data[1],
					statusBar
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('mainSpaceShipHit', function(e) {
				gameLogic.handleMainSpaceShipHit(
					e.data[1],
					statusBar
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('mainSpaceShipDamaged', function(e) {
				gameLogic.handleMainSpaceShipDamaged(
					e.data[1],
					statusBar
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('fireballOutOfScreen', function(e) {
				gameLogic.handleFireballOutOfScreen(
					e.data
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('lootOutOfScreen', function(e) {
				gameLogic.handleLootOutOfScreen(
					e.data
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('mainSpaceShipOutOfScreen', function(e) {
				gameLogic.handleMainSpaceShipOutOfScreen();
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('disposableSpriteAnimationEnded', function(e) {
				gameLogic.handleDisposableSpriteAnimationEnded(
					e.data
				);
			});
			// @ts-ignore don't want to type callbacks
			GameLoop().addEventListener('resize', function(e) {
				statusBar.onResize(e.data)
			});

			
			
			
			
		}
		
		
	}
	
	return {
		init : init
	}
}
module.exports = classConstructor;