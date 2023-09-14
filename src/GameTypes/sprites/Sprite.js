const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;

// It "implements" the Wounder interface
const Wounder = require('src/GameTypes/interfaces/Wounder');
const Damageable = require('src/GameTypes/interfaces/Damageable');
 

/**
 * @namespace Sprite
 * @constructor Sprite
 * @param {Number} healthPoints
 */
const Sprite = function(healthPoints) {
	// @ts-ignore
	if (typeof PIXI === 'undefined') {
		console.warn('The PIXI lib must be present in the global scope of the page');
		return;
	}
	Wounder.call(this);
	Damageable.call(this);
	
	this.UID = UIDGenerator.newUID();
	this.enteredScreen = false;
	this.healthPoints = healthPoints || 0;
	this.spriteObj = null;
}
const proto_proto = Object.create(Wounder.prototype);
Object.assign(proto_proto, Damageable.prototype); 
Sprite.prototype = Object.create(proto_proto);
/**
 * @static objectType
 */
Sprite.prototype.objectType = 'Sprite'
Sprite.prototype.objectType = 'Sprite';


/**
 * @method getSprite
 * @virtual 
 */
Sprite.prototype.getSprite = function() {}


Object.defineProperty(Sprite.prototype, 'x', {
	get : function() {
		return this.spriteObj.x;
	},
	set : function(newVal) {
		this.spriteObj.x = newVal;
	}
});

Object.defineProperty(Sprite.prototype,'y', {
	get : function() {
		return this.spriteObj.y;
	},
	set : function(newVal) {
		this.spriteObj.y = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'width', {
	get : function() {
		return this.spriteObj.width;
	},
	set : function(newVal) {
		this.spriteObj.width = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'height', {
	get : function() {
		return this.spriteObj.height;
	},
	set : function(newVal) {
		this.spriteObj.height = newVal;
	}
});

// The rotations are meant to be expressed in degrees
Object.defineProperty(Sprite.prototype, 'rotation', {
	get : function() {
		return this.spriteObj.rotation * 180 / Math.PI;
	},
	set : function(newVal) {
		this.spriteObj.rotation = newVal * Math.PI / 180;
	}
});

Object.defineProperty(Sprite.prototype, 'scaleX', {
	get : function() {
		return this.spriteObj.scale.x;
	},
	set : function(newVal) {
		this.spriteObj.scale.x = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'scaleY', {
	get : function() {
		return this.spriteObj.scale.y;
	},
	set : function(newVal) {
		this.spriteObj.scale.y = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'zoom', {
	get : function() {
		return this.spriteObj.zoom;
	},
	set : function(newVal) {
		this.spriteObj.zoom = newVal;
	}
});


Object.defineProperty(Sprite.prototype, 'alpha', {
	get : function() {
		return this.spriteObj.alpha;
	},
	set : function(newVal) {
		this.spriteObj.alpha = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'tilePositionX', {
	get : function() {
		return this.spriteObj.tilePosition.x;
	},
	set : function(newVal) {
		this.spriteObj.tilePosition.x = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'tilePositionY', {
	get : function() {
		return this.spriteObj.tilePosition.y;
	},
	set : function(newVal) {
		this.spriteObj.tilePosition.y = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'tileTransformScaleX', {
	get : function() {
		return this.spriteObj.tileTransform.scale.x;
	},
	set : function(newVal) {
		this.spriteObj.tileTransform.scale.x = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'tileTransformScaleY', {
	get : function() {
		return this.spriteObj.tileTransform.scale.y;
	},
	set : function(newVal) {
		this.spriteObj.tileTransform.scale.y = newVal;
	}
});

Object.defineProperty(Sprite.prototype, 'tileTransformRotation', {
	get : function() {
		return this.spriteObj.tileTransform.rotation;
	},
	set : function(newVal) {
		this.spriteObj.tileTransform.rotation = newVal;
	}
});


/**
 * @method _definePropsOnSelf
 * //@private 
 * 
 * A helper to obtain a list of getter/setter props hosted on 
 * a not-Sprite instance meant to reflect the often-used props
 * of a PIXI.Sprite object 
 */
Sprite.prototype._definePropsOnSelf = function() {
	
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
	
	// The rotations are meant to be expressed in degrees
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
	
	Object.defineProperty(this, 'alpha', {
		get : function() {
			return this.spriteObj.alpha;
		},
		set : function(newVal) {
			this.spriteObj.alpha = newVal;
		}
	});
}

 
 
 
module.exports = Sprite;