


/**
 * @constructor GameRule
 * @param {String} targetName
 * @param {String} action
 * @param {Array<String>} params
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
		new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipOutOfScreen', 'target'], null),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipOutOfScreen', 'target'], null),
		new GameRule('fireballSprite', 'trigger', ['fireballOutOfScreen', 'target'], null)
	],
	mainSpaceShipTestCollision : [
		new GameRule('lootSprite', 'trigger', ['mainSpaceShipPowerUp',  'mainSpaceShipSprite', 'referenceObj'], 'powerUp'),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipDamaged', 'mainSpaceShipSprite', 'referenceObj'], 'hostile'),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipHit', 'mainSpaceShipSprite', 'referenceObj'], 'hostileHit')
	],
	foeSpaceShipTestCollision : [new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipDamaged', 'fireballSprite', 'referenceObj'], null)],
}



module.exports = ruleSet;