



/**
 * @constructor RecurringCallbackTween
 * @param {() => Void} cb
 * @param {Number} interval
 * @param {Array<Object>} argsAsArray
 * @param {Object} scope
 * @param {String} propName
 */
const RecurringCallbackTween = function(cb, interval, argsAsArray, scope, propName) {
	this.cb = cb;
	this.interval = interval;
	this.argsAsArray = argsAsArray || new Array();
	this.scope = scope;
	this.propName = propName;
	
	this.lastStepTimestamp = 0;
	this.baseFrameDuration = 1000 / 60;
	this.currentPartialStep = 0;
}
RecurringCallbackTween.prototype.objectType = 'RecurringCallbackTween';

/**
 * @method nextStep
 * @param {Number} stepCount
 * @param {Number} frameDuration
 * @param {Number} timestamp
 * @return Void
 */
RecurringCallbackTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	stepCount *= frameDuration / this.baseFrameDuration;
	this.currentPartialStep += stepCount;
	
	if (this.currentPartialStep >= this.interval) {
		if (this.scope)
			// @ts-ignore cause we can't explicitly declare the type of "scope"
			this.cb(this.scope[this.propName]);
		else if (this.argsAsArray)
			this.cb.apply(null, this.argsAsArray);
		else
			this.cb();
			
		this.currentPartialStep = 0;
	}
	
	this.lastStepTimestamp = timestamp;
}

/**
 * @method testOutOfScreen
 */
RecurringCallbackTween.prototype.testOutOfScreen = function() {
	return false;
}





module.exports = RecurringCallbackTween;