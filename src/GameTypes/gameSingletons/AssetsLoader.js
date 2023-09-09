


// ASSETS PRELOADING
const manifest = {
	bundles : [
		{
			name : 'backgrounds',
			assets : [
				{name : 'bgBack', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Blue Nebula/Blue Nebula 1 - 1024x1024.png'},
				{name : 'bgMiddle', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Blue Nebula/Blue Nebula 6 - 1024x1024.png'},
				{name : 'bgFront', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Starfields/Starfield-9 - 1024x1024.png'},
				{name : 'statusBarLeft', srcs : 'plugins/ShootEmUp/assets/Status_Bar_Left.png'}
			]
		},
		{
			name : 'spaceShips',
			assets : [
				{name : 'mainSpaceShip', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/07/Spaceship_07_YELLOW_animated.png'},
				{name : 'foeSpaceShip00', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/03/Spaceship_03_RED.png'},
				{name : 'foeSpaceShip01', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/02/Spaceship_02_PURPLE.png'},
				{name : 'foeSpaceShip02', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/06/Spaceship_06_BLUE.png'},
				{name : 'foeSpaceShip01Shielded', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/02/Spaceship_02_YELLOW.png'},
				{name : 'foeSpaceShip02Shielded', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/06/Spaceship_06_YELLOW.png'}
			]
		},
		{
			name : 'flames',
			assets : [
				{name : 'flamesTilemap', srcs : 'plugins/ShootEmUp/assets/ships/Flames_tilemap.png'},
				{name : 'fireballsTilemap', srcs : 'plugins/ShootEmUp/assets/Fireball_sprite_v2.png'},
				{name : 'redFireballsTilemap', srcs : 'plugins/ShootEmUp/assets/RedFireballSprite.png'},
				{name : 'multiFireSpearsSprite', srcs : 'plugins/ShootEmUp/assets/MultiFireSpearsSprite.png'},
				{name : 'blueFireballSprite', srcs : 'plugins/ShootEmUp/assets/BlueFireballSprite.png'},
				{name : 'impactTilemap', srcs : 'plugins/ShootEmUp/assets/Impact_sprite.png'},
				{name : 'greenExplosionTilemap', srcs : 'plugins/ShootEmUp/assets/Explosion_Sprite.png'},
				{name : 'yellowExplosionTilemap', srcs : 'plugins/ShootEmUp/assets/Yellow_Explosion_Sprite.png'},
				{name : 'shieldTilemap', srcs : 'plugins/ShootEmUp/assets/Shield_Sprite.png'},
				{name : 'medikitTilemap', srcs : 'plugins/ShootEmUp/assets/loots/Medikit_Sprite.png'},
				{name : 'weaponTilemap', srcs : 'plugins/ShootEmUp/assets/loots/Weapon_Sprite.png'}
			]
		}
	]
};
		
		
		
		
module.exports = new Promise(function(resolve, reject) {
		// @ts-ignore
		PIXI.Assets.init({manifest}).then(function() {
			Promise.all([
				// @ts-ignore
				PIXI.Assets.loadBundle('backgrounds'),
				// @ts-ignore
				PIXI.Assets.loadBundle('spaceShips'),
				// @ts-ignore
				PIXI.Assets.loadBundle('flames')
			]).then(function(loadedAssets) {
				resolve(loadedAssets);
			});
		});
	});