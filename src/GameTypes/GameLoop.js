const CoreTypes = require('src/GameTypes/CoreTypes');
const gameLogic = require('src/GameTypes/GameLogic');

/**
 * @constructor GameLoop
 * 
 */
const GameLoop = function(windowSize) {
	if (typeof PIXI === 'undefined') {
		console.warn('The PIXI lib must be present in the global scope of the page');
		return;
	}
	CoreTypes.EventEmitter.call(this);
	this.createEvent('mainSpaceShipOutOfScreen');
	this.createEvent('foeSpaceShipDestroyed');
	this.createEvent('foeSpaceShipOutOfScreen');
	this.createEvent('fireballOutOfScreen');
	
	this.loopStarted = false;
	this.loopStartedTime = 0;
	this.currentTime = 0;
	this.tweens = [];
	this.collisionTests = [];
	this.renderer = new PIXI.Renderer({width : windowSize.x.value, height : windowSize.y.value});
	this.stage = new PIXI.Container();
}
GameLoop.prototype = Object.create(CoreTypes.EventEmitter.prototype);

 
GameLoop.prototype.start = function() {
	var self= this,
		stepCount = 0;
	this.loopStarted = true;
	requestAnimationFrame(loop);
	 
	function loop(timestamp) {
		if (!self.loopStarted)
		 	return;
		else if (!self.loopStartedTime) {
		 	self.loopStartedTime = timestamp;
		}
		 
		self.currentTime = timestamp - self.loopStartedTime;
		
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
				
				stepCount = Math.round((self.currentTime - tween.lastStepTimestamp) / (1000 / 60));
				tween.nextStep(stepCount, self.currentTime);
				
				if (tween.testOutOfScreen()) {
					self.removeTween(tween);
					
					// Remove the collisionTests here, when a sprite goes out of screen
					tween.collisionTestsRegister.forEach(function(collisionTest) {
						self.removeCollisionTest(collisionTest);
					});
					
					// trigger an event for the app router to be able to clean the registers
					if (typeof gameLogic.testOutOfScreen !== 'undefined') {
						gameLogic.testOutOfScreen.forEach(function(rule) {
//							console.log(rule.targetName, tween.target.name);
							if (rule.targetName === tween.target.name) {
								self[rule.action](rule.params[0], tween[rule.params[1]]);
							}
						})
					}
				}
			}
		}
		
		self.recursiveCollisionTest(self);
		
		// Clean all the collision tests concerning th fireball that made a shot
		// FIXME: try to find a way to abstract away the named "fireballSprite" prop 
//		let test;
//		testsToRemove.forEach(function(sprite) {
			
//			
//		})
		 
		self.renderer.render(self.stage);
		requestAnimationFrame(loop);
	}
}
 
GameLoop.prototype.stop = function() {
	this.loopStarted = false;
	this.loopStartedTime = 0;
}

GameLoop.prototype.unshiftTween = function(tween) {
	this.tweens.unshift(tween);
}

GameLoop.prototype.pushTween = function(tween) {
	this.tweens.push(tween);
}

GameLoop.prototype.insertTween = function(tween, pos) {
	this.tweens.splice(pos, 0, tween);
}

GameLoop.prototype.removeTween = function(tween) {
	var tweenPos = this.tweens.indexOf(tween);
	if (tweenPos !== -1)
		this.tweens.splice(tweenPos, 1);
}
 
GameLoop.prototype.pushCollisionTest = function(test) {
	this.collisionTests.push(test);
}
 
GameLoop.prototype.removeCollisionTest = function(test) {
	var testPos = this.collisionTests.indexOf(test);
	if (testPos !== -1)
		this.collisionTests.splice(testPos, 1);
}

GameLoop.prototype.recursiveCollisionTest = function(self) {
	// Collision tests
	let collisionTest, shouldBreak = false;
	for (let i = self.collisionTests.length - 1; i >= 0; i--) {
		collisionTest = self.collisionTests[i];
		if (collisionTest.testCollision()) {
			if (typeof gameLogic.foeSpaceShipTestCollision !== 'undefined') {
				gameLogic.foeSpaceShipTestCollision.forEach(function(rule) {
					if (rule.targetName === collisionTest.referenceObj.name) {
						self[rule.action](rule.params[0], [collisionTest[rule.params[1]], collisionTest[rule.params[2]]]);
						shouldBreak = true;
						self.cleanCollisionTests(collisionTest[rule.params[1]], collisionTest[rule.params[2]]);
					}
				});
			}
		}
		if (shouldBreak) {
			break;
			self.recursiveCollisionTest(self);
		}
	}
}

GameLoop.prototype.cleanCollisionTests = function(firebBallSprite, foeSpaceShipSprite) {
	let test;
	for (let i = this.collisionTests.length - 1; i >= 0; i--) {
		test = this.collisionTests[i];
		if (test.fireballSprite === firebBallSprite || test.referenceObj === foeSpaceShipSprite) {
			this.collisionTests.splice(i, 1);
		}
	}
}
 
 
 
 module.exports = GameLoop;