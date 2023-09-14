 /**
 * @typedef {import('src/GameTypes/interfaces/Wounder')} Wounder
 */


/**
 * @constructor ShieldedDamageable
 *
 */
const ShieldedDamageable = function() {
	this.healthPoints = 0;
	this.shieldCharge = 0;
}
//ShieldedDamageable.prototype = {};

/**
 * @method getHealth
 * @return {Number}
 */
ShieldedDamageable.prototype.getHealth = function() {
	return this.healthPoints;
}

/**
 * @method incrementHealth
 */
ShieldedDamageable.prototype.incrementHealth = function() {
	this.healthPoints++
}

/**
 * @method decrementHealth
 */
ShieldedDamageable.prototype.decrementHealth = function() {
	this.healthPoints--
}

/**
 * @method handleDamage
 * @param {Wounder} sprite
 * @return Void
 */
ShieldedDamageable.prototype.handleDamage = function(sprite) {
	this.healthPoints -= sprite.damage;
}

/**
 * @method hasBeenDestroyed
 * @return {boolean}
 */
ShieldedDamageable.prototype.hasBeenDestroyed = function() {
	return this.healthPoints <= 0;
}




module.exports = ShieldedDamageable;