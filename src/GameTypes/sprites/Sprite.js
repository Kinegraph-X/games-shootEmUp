const UIDGenerator = require('src/core/UIDGenerator').UIDGenerator;

// like if it "implements" the Damageable interface
const Wounder = require('src/GameTypes/interfaces/Wounder');
 

/**
 * @namespace Sprite
 * @constructor Sprite
 * @param {Number} lifePoints
 */
const Sprite = function(lifePoints) {
	// @ts-ignore
	if (typeof PIXI === 'undefined') {
		console.warn('The PIXI lib must be present in the global scope of the page');
		return;
	}
	Wounder.call(this);
	
	this.UID = UIDGenerator.newUID();
	this.enteredScreen = false;
	this.lifePoints = lifePoints || 0;
	this.spriteObj = null;
}
Sprite.prototype = Object.create(Wounder.prototype);

/**
 * @method @virtual getSprite
 */
Sprite.prototype.getSprite = function() {}			// VIRTUAL

/**
 * @virtual name
 */
Sprite.prototype.name = 'Sprite'					// VIRTUAL

/**
 * @method incrementHealth
 */
Sprite.prototype.incrementHealth = function() {
	// @ts-ignore lifePoints is inherited
	this.lifePoints++
}

/**
 * @method decrementHealth
 */
Sprite.prototype.decrementHealth = function() {
	// @ts-ignore lifePoints is inherited
	this.lifePoints--
}

/**
 * @method hasBeenDestroyed
 * @return {boolean}
 */
Sprite.prototype.hasBeenDestroyed = function() {
	return this.lifePoints === 0;
}


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
}

 
 
 
module.exports = Sprite;