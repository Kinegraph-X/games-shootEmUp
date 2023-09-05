


/**
 * @constructor GameRule
 * @param {String} targetName
 * @param {String} action
 * @param {Array} params
 * @param {String} type
 */
const GameRule = function(targetName, action, params, type) {
	this.targetName = targetName;
	this.action = action;
	this.params = params;
	this.type = type;
}
 
const ruleSet = {
	testOutOfScreen : [
		new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipOutOfScreen', 'target']),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipOutOfScreen', 'target']),
		new GameRule('fireballSprite', 'trigger', ['fireballOutOfScreen', 'target'])
	],
	mainSpaceShipTestCollision : [
		new GameRule('lootSprite', 'trigger', ['mainSpaceShipPowerUp',  'mainSpaceShipSprite', 'referenceObj'], 'powerUp'),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipDamaged', 'mainSpaceShipSprite', 'referenceObj'], 'hostile')
		
	],
	foeSpaceShipTestCollision : [new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipDamaged', 'fireballSprite', 'referenceObj'])],
}



module.exports = ruleSet;