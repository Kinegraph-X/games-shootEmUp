/**
 * @ruleSet
 * 
 */


const GameRule = function(targetName, action, params) {
	this.targetName = targetName;
	this.action = action;
	this.params = params;
}
 
const ruleSet = {
	testOutOfScreen : [
		new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipOutOfScreen', 'target']),
		new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipOutOfScreen', 'target']),
		new GameRule('fireballSprite', 'trigger', ['fireballOutOfScreen', 'target'])
	],
	mainSpaceShipTestCollision : [new GameRule('mainSpaceShipSprite', 'trigger', ['mainSpaceShipDestroyed', 'target'])],
	foeSpaceShipTestCollision : [new GameRule('foeSpaceShipSprite', 'trigger', ['foeSpaceShipDestroyed', 'fireballSprite', 'referenceObj'])],
}




module.exports =  ruleSet;