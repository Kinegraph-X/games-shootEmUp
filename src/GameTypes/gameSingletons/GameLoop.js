 /**
 * @typedef {Object} PIXI.Sprite
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 * @typedef {import('src/GameTypes/tweens/Tween')} Tween
 * @typedef {import('src/GameTypes/collisionTests/fireballCollisionTester')} FireballCollisionTester
 * @typedef {import('src/GameTypes/collisionTests/mainSpaceShipCollisionTester')} MainSpaceShipCollisionTester
 * @typedef {import('src/GameTypes/collisionTests/spaceShipCollisionTester')} SpaceShipCollisionTester
 */

const {EventEmitter} = require('src/core/CoreTypes');
const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const ruleSet = require('src/GameTypes/gameSingletons/gameRules');

/**
 * @constructor GameLoop
 * @param {CoreTypes.Dimension} windowSize
 */
const GameLoop = function(windowSize) {
	this.windowSize = windowSize;
	// @ts-ignore  PIXI
	if (typeof PIXI === 'undefined') {
		console.warn('The PIXI lib must be present in the global scope of the page');
		return;
	}
	EventEmitter.call(this);
	// @ts-ignore inherited method
	this.createEvent('mainSpaceShipOutOfScreen');
	// @ts-ignore inherited method
	this.createEvent('mainSpaceShipDamaged');
	// @ts-ignore inherited method
	this.createEvent('mainSpaceShipPowerUp');
	// @ts-ignore inherited method
	this.createEvent('foeSpaceShipDamaged');
	// @ts-ignore inherited method
	this.createEvent('foeSpaceShipDestroyed');
	// @ts-ignore inherited method
	this.createEvent('foeSpaceShipOutOfScreen');
	// @ts-ignore inherited method
	this.createEvent('fireballOutOfScreen');
	// @ts-ignore inherited method
	this.createEvent('disposableSpriteAnimationEnded');
	
	this.loopStarted = false;
	this.loopStartedTime = 0;
	this.firstFramesDuration = {
		chosen : 0,
		groups : []
	};
	this.currentTime = 0;
	this.tweens = new Array();
	this.collisionTests = new Array();
	// @ts-ignore  PIXI
	this.renderer = new PIXI.Renderer({width : windowSize.x.value, height : windowSize.y.value});
	// @ts-ignore PIXI
	this.stage = new PIXI.Container();
}
GameLoop.prototype = Object.create(EventEmitter.prototype);

/**
 * @constructor as a static method FrameGroup
 * @param {Number} initialVal
 */
GameLoop.prototype.FrameGroup = function(initialVal) {
	this.rounded = Math.round(initialVal);
	this.values = new Array();
	// @ts-ignore inherited method
	this.values.average(initialVal);
}
 
GameLoop.prototype.start = function() {
	let self= this,
		stepCount = 0,
		previousTimeStamp = 0,
		frameDuration = 0,
		stdFrameDuration = 0;
	// Benchmark related
//	let loopLastTimestamp = 0;
	this.loopStarted = true;
	
	requestAnimationFrame(loop);
	
	/** @param  {Number} timestamp */
	function loop(timestamp) {
		
		if (!self.loopStarted)
		 	return;
		else if (!self.loopStartedTime) {
		 	self.loopStartedTime = timestamp;
		 	previousTimeStamp = timestamp;
		}
		 
		self.currentTime = timestamp - self.loopStartedTime;
		
		frameDuration = timestamp - previousTimeStamp;
		if (!(stdFrameDuration = self.getFrameDuration(frameDuration))) {
			previousTimeStamp = timestamp;
			requestAnimationFrame(loop);
			return;
		}
		
		previousTimeStamp = timestamp;
		
//		performance.mark('benchmark');


		// Tweens handling
		for (let i = self.tweens.length - 1; i >= 0; i--) {
			let tween = self.tweens[i];
			if (tween.oneShot) {
				tween.nextStep(1, self.currentTime);
				self.removeTween(tween);
			}
			else {
				// HACK for the tweens starting lately => FIXME: is there a way to extract that from the GameLoop class ?
				if (!tween.lastStepTimestamp)
					tween.lastStepTimestamp = self.currentTime;
				
				if (tween.ended) {
					self.removeTween(tween);
					// @ts-ignore inherited method
					self.trigger('disposableSpriteAnimationEnded', tween);
				}
				
				stepCount = Math.round((self.currentTime - tween.lastStepTimestamp) / stdFrameDuration);
				
				if (!stepCount)
					continue;
				tween.nextStep(stepCount, stdFrameDuration, self.currentTime);
				
				if (tween.testOutOfScreen()) {
					self.removeTween(tween);
					
					// Remove the collisionTests here, when a sprite goes out of screen
					self.removeCollisionTests(tween.collisionTestsRegister);
					
					// trigger an event for the app router to be able to clean the registers
					ruleSet.testOutOfScreen.forEach(function(rule) {
						if (rule.targetName === tween.target.name) {
							// @ts-ignore implicitly inherited method
							self[rule.action](rule.params[0], tween[rule.params[1]]);
						}
					})
				}
			}
		}
		
		// Collision Handling
		self.testAndCleanCollisions.call(self);
		
//		performance.measure('bench_measure', 'benchmark');
//		let perf = performance.getEntriesByName('bench_measure')[performance.getEntriesByName('bench_measure').length - 1].duration;
//		if (perf > 17)
//			console.log('Dropped frame. Last interval was ' + perf.toString());
//		else {
//			console.log('last frame interval : ' + (self.currentTime - loopLastTimestamp).toString());
//			console.log('frame compute duration : ' + perf.toString());
//		}
//		loopLastTimestamp = self.currentTime;

		// Finally render the stage
		self.renderer.render(self.stage);
		requestAnimationFrame(loop);
	}
}

/**
 * @method stop
 * 
 * Self-explanatory
 */
GameLoop.prototype.stop = function() {
	this.loopStarted = false;
	this.loopStartedTime = 0;
	
	console.log("stop : this.loopStarted", this.loopStarted);
}

/**
 * @method getFrameDuration
 * @param {Number} duration
 */
GameLoop.prototype.getFrameDuration = function(duration) {
	if (this.firstFramesDuration.chosen)
		return this.firstFramesDuration.chosen;
	else {
		if (!this.firstFramesDuration.groups.length)
			this.firstFramesDuration.groups.push(new this.FrameGroup(duration));
		else {
			const roundedDuration = Math.round(duration);
			let found = false;
			this.firstFramesDuration.groups.forEach(function(group) {
				if (!found) {
					if (group.rounded === roundedDuration) {
						found = true;
						group.values.average(duration);
					}
					if (group.values.length === 5) {
						found = true;
						this.firstFramesDuration.chosen = group.values.avg;
					}
				}
			}, this);
			if (!found) {
				this.firstFramesDuration.groups.push(new this.FrameGroup(duration));
			}
		}
		
		if (this.firstFramesDuration.chosen)
			return this.firstFramesDuration.chosen;
	}
	return null;
}

/**
 * @method addSpriteToScene
 * 
 * Self-explanatory
 * 
 * @param {Sprite} sprite
 * 
 */
GameLoop.prototype.addSpriteToScene = function(sprite) {
	this.stage.addChild(sprite.spriteObj);
}

/**
 * @method addAnimatedSpriteToScene
 * 
 * Self-explanatory
 * 
 * @param {Sprite} sprite
 * @param {Tween} tween
 */
GameLoop.prototype.addAnimatedSpriteToScene = function(sprite, tween) {
	this.stage.addChild(sprite.spriteObj);
	this.pushTween(tween);
}

/**
 * @method removeSpriteFromScene
 * 
 * Self-explanatory
 * 
 * @param {Sprite} sprite
 * @param {Boolean} noError
 * 
 */
GameLoop.prototype.removeSpriteFromScene = function(sprite, noError) {
	// @ts-ignore PIXI
	if (!(this.stage.removeChild(sprite.spriteObj) instanceof PIXI.Container)) {
		if (noError)
			return;
		else
			throw new Error('Error while removing  object from scene : Not Found')
	}
}

/**
 * @method unshiftTween
 * 
 * Self-explanatory
 * 
 * @param {Tween} tween
 * 
 */
GameLoop.prototype.unshiftTween = function(tween) {
	this.tweens.unshift(tween);
}

/**
 * @method pushTween
 * 
 * Self-explanatory
 * 
 * @param {Tween} tween
 * 
 */
GameLoop.prototype.pushTween = function(tween) {
	this.tweens.push(tween);
}

/**
 * @method insertTween
 * 
 * Self-explanatory
 * 
 * @param {Tween} tween
 * @param {Number} pos
 * 
 */
GameLoop.prototype.insertTween = function(tween, pos) {
	this.tweens.splice(pos, 0, tween);
}

/**
 * @method removeTween
 * 
 * Self-explanatory
 * 
 * @param {Tween} tween
 * 
 */
GameLoop.prototype.removeTween = function(tween) {
	var tweenPos = this.tweens.indexOf(tween);
	if (tweenPos !== -1)
		this.tweens.splice(tweenPos, 1);
}

/**
 * @method pushCollisionTest
 * 
 * Self-explanatory
 * 
 * @param {FireballCollisionTester|SpaceShipCollisionTester|MainSpaceShipCollisionTester} test
 * 
 */
GameLoop.prototype.pushCollisionTest = function(test) {
	this.collisionTests.push(test);
}

/**
 * @method removeCollisionTest
 * 
 * Self-explanatory
 * 
 * @param {FireballCollisionTester|SpaceShipCollisionTester|MainSpaceShipCollisionTester} test
 *
 */
GameLoop.prototype.removeCollisionTest = function(test) {
	var testPos = this.collisionTests.indexOf(test);
	if (testPos !== -1)
		this.collisionTests.splice(testPos, 1);
}

/**
 * @method removeCollisionTests
 * 
 * Self-explanatory
 * 
 * @param {Array<FireballCollisionTester|SpaceShipCollisionTester|MainSpaceShipCollisionTester>} tests
 *
 */
GameLoop.prototype.removeCollisionTests = function(tests) {
	let test;
	for (let i = this.collisionTests.length - 1; i >= 0; i--) {
		test = this.collisionTests[i];
		if (tests.indexOf(test) !== -1){
			this.collisionTests.splice(i, 1);
		}
	}
}

/**
 * @method removeCollisionTests
 * 
 * Self-explanatory
 * 
 * @param {Array<FireballCollisionTester|SpaceShipCollisionTester|MainSpaceShipCollisionTester>} tests
 *
 */
GameLoop.prototype.markCollisionTestsForRemoval = function(tests) {
	let test;
	for (let i = this.collisionTests.length - 1; i >= 0; i--) {
		test = this.collisionTests[i];
		if (tests.indexOf(test) !== -1){
			CoreTypes.clearedCollisionTests.add(i);
		}
	}
}


/**
 * @method removeAllCollisionTests
 * 
 *  * Self-explanatory
 */
GameLoop.prototype.removeAllCollisionTests = function() {
	this.collisionTests.length = 0;
}




/**
 * @method testAndCleanCollisions
 * 
 * A method which traverse the array of collision tests without modifying it,
 * and then updates it, removing all the tests which are not anymore relevant.
 */
GameLoop.prototype.testAndCleanCollisions = function() {
	/** @type {FireballCollisionTester|SpaceShipCollisionTester|MainSpaceShipCollisionTester} */
	let collisionTest,
		deletedTests = new Uint8Array(this.collisionTests.length),
		clearedTests = CoreTypes.clearedCollisionTests;
		clearedTests.clear();
	
	// For "loot" collisionTests, we seem to have a bug when there are many projectiles,
	// many spaceChips, etc. So, we avoid adding the collision test while looping,
	// and we add  it on the next frame
	Array.prototype.push.apply(this.collisionTests, CoreTypes.tempAsyncCollisionsTests);
	CoreTypes.tempAsyncCollisionsTests.length = 0;
	
	for (let i = this.collisionTests.length - 1; i >= 0; i--) {
				
		if (deletedTests.at(i) === 1)
			continue;
		
		collisionTest = this.collisionTests[i];
		
		if (collisionTest.testCollision()) {	// , collisionTest[rule.params[1]].name, collisionTest[rule.params[2]]
			// @ts-ignore objectType: implicit inheritance
			if (collisionTest.objectType === this.collisionTestNamesConstants.fireballCollisionTest) {
				ruleSet.foeSpaceShipTestCollision.forEach(function(rule) {
					if (rule.targetName === collisionTest.referenceObj.name) {
						// @ts-ignore implicit inheritance
						this[rule.action](rule.params[0], [collisionTest[rule.params[1]], collisionTest[rule.params[2]]]);
						// @ts-ignore implicit inheritance
						this.cleanCollisionTests(collisionTest[rule.params[1]], collisionTest[rule.params[2]], deletedTests, clearedTests);
					}
				}, this);
			}
			// @ts-ignore objectType: implicit inheritance
			else if (collisionTest.objectType === this.collisionTestNamesConstants.mainSpaceShipCollisionTest) {
				ruleSet.mainSpaceShipTestCollision.forEach(function(rule) {
					// @ts-ignore type: implicit inheritance
					if (collisionTest.type === rule.type) {
						// @ts-ignore implicit inheritance
						this[rule.action](rule.params[0], [collisionTest[rule.params[1]], collisionTest[rule.params[2]]]);
						// @ts-ignore implicit inheritance
						this.cleanCollisionTests(collisionTest[rule.params[1]], collisionTest[rule.params[2]], deletedTests, clearedTests);
					}
				}, this);
			}
			this.updateDeletedTests(deletedTests, clearedTests);
		}
	}
	
	this.effectivelySpliceDeletedTests(clearedTests);
}

/**
 * @method cleanCollisionTests
 * 
 * Each time we found a matching collision, we loop a second time on the collision tests
 * to assert we're not leaving active tests in the loop, between, for example,
 * a destroyed foe and the main spaceship.
 * We could have used sort of a "indexOf" function, but that may come in a further optimization :
 * It would impose us to change the shape of the CollisionTester type.
 * 
 * @param {PIXI.Sprite} collidingSprite
 * The collisionTesters are designed as following : we think of "collidingSprite" as being
 * the "automatically moving" sprite (fireball in case of a collision with a foe ship), 
 * but as being the mainSpaceShip in case of a collision between a loot and the main ship,
 * or a collision between foe ship and the main ship.
 * 
 * @param {PIXI.Sprite} targetedSprite
 * @param {Uint8Array} deletedTests
 * @param {Set<Number>} clearedTests
 */
GameLoop.prototype.cleanCollisionTests = function(collidingSprite, targetedSprite, deletedTests, clearedTests) {
	let test;
	for (let i = this.collisionTests.length - 1; i >= 0; i--) {
		if (deletedTests.at(i) === 1)
			continue;
		
		test = this.collisionTests[i];
		if (test.fireballSprite === collidingSprite) {
			clearedTests.add(i);
		}
		// @ts-ignore hasShield : implicit inheritance
		else if (test.referenceObj === targetedSprite && targetedSprite.hasShield) {
			clearedTests.add(i);
		}
		// @ts-ignore lifePoints : implicit inheritance
		else if (test.referenceObj === targetedSprite && targetedSprite.lifePoints === 0) {
			clearedTests.add(i);
		}
		// This last condition works both on a collision between a foe ship and the main ship, and on a collision between the main ship and a loot
		// @ts-ignore name : implicit inheritance
		else if (test.referenceObj === targetedSprite && collidingSprite.name === this.spriteNamesConstants.mainSpaceShipSprite) {
			clearedTests.add(i);
		}
	}
}

/**
 * @method updateDeletedTests
 * @param {Uint8Array} deletedTests
 * @param {Set<Number>} clearedTests
 */
GameLoop.prototype.updateDeletedTests = function(deletedTests, clearedTests) {
	clearedTests.forEach(function(testIdx) {
//		console.log(testIdx)
		deletedTests.set([1], testIdx);
	});
}

/**
 * @method effectivelySpliceDeletedTests
 * @param {Set<Number>} clearedTests
 */
GameLoop.prototype.effectivelySpliceDeletedTests = function(clearedTests) {
	let testIdx = 0, setAsArray = Array.from(clearedTests).sort(this.sortingFunction);
	for (let i = setAsArray.length - 1; i >= 0; i--) {
		testIdx = setAsArray[i];
		this.collisionTests.splice(testIdx, 1);
	}
}

/**
 * @static collisionTestNamesConstants
 */
GameLoop.prototype.collisionTestNamesConstants = {
	fireballCollisionTest : 'fireballCollisionTest',
	mainSpaceShipCollisionTest : 'mainSpaceShipCollisionTest'
}

/**
 * @static collisionTestNamesConstants
 */
GameLoop.prototype.spriteNamesConstants = {
	mainSpaceShipSprite : 'mainSpaceShipSprite',
	foeSpaceShipSprite : 'foeSpaceShipSprite'
}

/**
 * @static @method sortingFunction
 * @param {Number} a
 * @param {Number} b
 */
GameLoop.prototype.sortingFunction = function(a, b){
	if (a < b) {
		return -1;
	}
	else if (a > b) {
    	return 1;
	}
	return 0;
}
 
// @ts-ignore singleton pattern
var gameLoop;

/**
 * @param {CoreTypes.Dimension} windowSize
 */
module.exports = function(windowSize = null) {
	// @ts-ignore singleton pattern
	if (typeof gameLoop !== 'undefined')
		// @ts-ignore singleton pattern
		return gameLoop;
	else
		return (gameLoop = new GameLoop(windowSize));
};