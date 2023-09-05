const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;
const CoreTypes = require('src/GameTypes/_game/CoreTypes');
 
 /**
 * @constructor Sprite
 * @param {Number} lifePoints
 */
 const Sprite = function(lifePoints) {
	if (typeof PIXI === 'undefined') {
		console.warn('The PIXI lib must be present in the global scope of the page');
		return;
	}
	
	this._UID = UIDGenerator.newUID();
	this.enteredScreen = false;
	this.lifePoints = lifePoints || 0;
	this.spriteObj = null;
	
	this.definePropsOnSelf();
}
Sprite.prototype = {};

Sprite.prototype.getSprite = function() {}			// VIRTUAL

Sprite.prototype.definePropsOnSelf = function() {
	
	Object.defineProperty(this, 'x', {
		get : function() {
			return this.spriteObj.x;
		},
		set : function(newVal) {
			this.spriteObj.x = newVal;
		}
	});
	
	Object.defineProperty(this,'y', {
		get : function() {
			return this.spriteObj.y;
		},
		set : function(newVal) {
			this.spriteObj.y = newVal;
		}
	});
	
	Object.defineProperty(this, 'width', {
		get : function() {
			return this.spriteObj.width;
		},
		set : function(newVal) {
			this.spriteObj.width = newVal;
		}
	});
	
	Object.defineProperty(this, 'height', {
		get : function() {
			return this.spriteObj.height;
		},
		set : function(newVal) {
			this.spriteObj.height = newVal;
		}
	});
	
	Object.defineProperty(this, 'rotation', {
		get : function() {
			return this.spriteObj.rotation * 180 / Math.PI;
		},
		set : function(newVal) {
			this.spriteObj.rotation = newVal * Math.PI / 180;
		}
	});
	
	Object.defineProperty(this, 'scaleX', {
		get : function() {
			return this.spriteObj.scale.x;
		},
		set : function(newVal) {
			this.spriteObj.scale.x = newVal;
		}
	});
	
	Object.defineProperty(this, 'scaleY', {
		get : function() {
			return this.spriteObj.scale.y;
		},
		set : function(newVal) {
			this.spriteObj.scale.y = newVal;
		}
	});
	
	Object.defineProperty(this, 'zoom', {
		get : function() {
			return this.spriteObj.zoom;
		},
		set : function(newVal) {
			this.spriteObj.zoom = newVal;
		}
	});
	
	Object.defineProperty(this, 'tilePositionX', {
		get : function() {
			return this.spriteObj.tilePosition.x;
		},
		set : function(newVal) {
			this.spriteObj.tilePosition.x = newVal;
		}
	});
	
	Object.defineProperty(this, 'tilePositionY', {
		get : function() {
			return this.spriteObj.tilePosition.y;
		},
		set : function(newVal) {
			this.spriteObj.tilePosition.y = newVal;
		}
	});
	
	Object.defineProperty(this, 'tileTransformScaleX', {
		get : function() {
			return this.spriteObj.tileTransform.scale.x;
		},
		set : function(newVal) {
			this.spriteObj.tileTransform.scale.x = newVal;
		}
	});
	
	Object.defineProperty(this, 'tileTransformScaleY', {
		get : function() {
			return this.spriteObj.tileTransform.scale.y;
		},
		set : function(newVal) {
			this.spriteObj.tileTransform.scale.y = newVal;
		}
	});
	
	Object.defineProperty(this, 'tileTransformRotation', {
		get : function() {
			return this.spriteObj.tileTransform.rotation;
		},
		set : function(newVal) {
			this.spriteObj.tileTransform.rotation = newVal;
		}
	});

}

 
 
 
module.exports = Sprite;