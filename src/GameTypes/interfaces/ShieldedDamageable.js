 /**
 * @typedef {import('src/GameTypes/interfaces/Wounder')} Wounder
 */
const {mainSpaceShipLifePoints} = require('src/GameTypes/gameSingletons/gameConstants');
const GameState = require('src/GameTypes/gameSingletons/GameState');
const Damageable = require('src/GameTypes/interfaces/Damageable');

/**
 * @constructor ShieldedDamageable
 *
 */
const ShieldedDamageable = function() {
	this.healthPoints = 0;
	this.shieldCharge = 0;
}
ShieldedDamageable.prototype = Object.create(Damageable.prototype);

/**
 * @method getHealth
 * @return {Number}
 */
ShieldedDamageable.prototype.getHealth = function() {
	return this.healthPoints + this.shieldCharge;
}

/**
 * @method incrementShield
 */
ShieldedDamageable.prototype.incrementShield = function() {
	this.shieldCharge++
}

/**
 * @method decrementShield
 */
ShieldedDamageable.prototype.decrementShield = function() {
	this.shieldCharge--
}

/**
 * @method handleDamage
 * @param {Wounder} sprite
 * @return Void
 */
ShieldedDamageable.prototype.handleDamage = function(sprite) {
	if (this.shieldCharge - sprite.damage > mainSpaceShipLifePoints[GameState().currentLevel])
		return;
	
	if (this.shieldCharge > 1) {
		this.shieldCharge -= sprite.damage;
		return;
	}
	else if (this.shieldCharge === 1) {
		if (sprite.damage > 0)
			this.shieldCharge = 0;
		else {
			this.shieldCharge -= sprite.damage;
			return;
		}
	}
	else if (this.shieldCharge === 0) {
		// Case of a "healer" damage: don't grow beyond the max
		if (this.healthPoints - sprite.damage <= mainSpaceShipLifePoints[GameState().currentLevel])
			this.healthPoints -= sprite.damage;
		else if (sprite.damage < 0) {
			this.shieldCharge -= sprite.damage;
			return;
		}
	}
}

/**
 * @method hasBeenDestroyed
 * @return {boolean}
 */
ShieldedDamageable.prototype.hasBeenDestroyed = function() {
	return this.healthPoints <= 0;
}




module.exports = ShieldedDamageable;