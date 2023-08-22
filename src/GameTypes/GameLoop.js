const TileToggleMovingTween = require('src/GameTypes/TileToggleMovingTween');

/**
 * @constructor GameLoop
 * 
 */
const GameLoop = function(windowSize) {
	if (typeof PIXI === 'undefined') {
		console.warn('The PIXI lib must be present in the global scope of the page');
		return;
	}
	this.loopStarted = false;
	this.loopStartedTime = 0;
	this.currentTime = 0;
	this.tweens = [];
	this.renderer = new PIXI.Renderer({width : windowSize.x.value, height : windowSize.y.value});
	this.stage = new PIXI.Container();
}
GameLoop.prototype = {};
 
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
		 
		self.tweens.forEach(function(tween) {
			if (tween.oneShot) {
				tween.nextStep(1, self.currentTime);
				self.removeTween(tween);
			}
			else {
				// HACK for the tweens starting lately => FIXME: what do we do in this case ?
				if (!tween.lastStepTimestamp && tween instanceof TileToggleMovingTween)
					tween.lastStepTimestamp = self.currentTime;
				stepCount = Math.round((self.currentTime - tween.lastStepTimestamp) / (1000 / 60));
				tween.nextStep(stepCount, self.currentTime);
			}
		});
		 
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
 
 
 
 
 
 
 
 module.exports = GameLoop;