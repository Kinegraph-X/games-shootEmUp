


/**
 * @constructor GameRule
 * @param {String} targetObjectType
 * @param {String} action
 * @param {Array<String>} params
 * @param {String} type
 */
const GameRule = function(targetObjectType, action, params, type) {
	this.targetObjectType = targetObjectType;
	this.action = action;
	this.params = params;
	this.type = type;
}
 
const ruleSet = {
	testOutOfScreen : [
		new GameRule('FoeSpaceShip', 'trigger', ['foeSpaceShipOutOfScreen', 'target'], null),
		new GameRule('MainSpaceShip', 'trigger', ['mainSpaceShipOutOfScreen', 'target'], null),
		new GameRule('Projectile', 'trigger', ['fireballOutOfScreen', 'target'], null),
		new GameRule('LootSprite', 'trigger', ['lootOutOfScreen', 'target'], null)
	],
	mainSpaceShipTestCollision : [
		new GameRule('LootSprite', 'trigger', ['mainSpaceShipPowerUp',  'mainSpaceShipSprite', 'referenceObj'], 'powerUp'),
		new GameRule('MainSpaceShip', 'trigger', ['mainSpaceShipDamaged', 'mainSpaceShipSprite', 'referenceObj'], 'hostile'),
		new GameRule('MainSpaceShip', 'trigger', ['mainSpaceShipHit', 'mainSpaceShipSprite', 'referenceObj'], 'hostileHit')
	],
	foeSpaceShipTestCollision : [
		new GameRule('FoeSpaceShip', 'trigger', ['foeSpaceShipDamaged', 'fireballSprite', 'referenceObj'], null),
		new GameRule('BossSpaceShip', 'trigger', ['foeSpaceShipDamaged', 'fireballSprite', 'referenceObj'], null)
	]
}



module.exports = ruleSet;