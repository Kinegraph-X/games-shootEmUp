


// ASSETS PRELOADING
const manifest = {
	bundles : [
		{
			name : 'backgrounds',
			assets : [
				{name : 'bgBack', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Blue Nebula/Blue Nebula 1 - 1024x1024.png'},
				{name : 'bgMiddle', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Blue Nebula/Blue Nebula 6 - 1024x1024.png'},
				{name : 'bgFront', srcs : 'plugins/ShootEmUp/assets/tileMaps/world/Starfields/Starfield-9 - 1024x1024.png'},
				{name : 'plasmaOrange01', srcs : 'plugins/ShootEmUp/assets/tileMaps/plasma/Orange Plasma/Orange_Plasma_01.png'},
				{name : 'plasmaOrange02', srcs : 'plugins/ShootEmUp/assets/tileMaps/plasma/Orange Plasma/Orange_Plasma_02.png'},
				{name : 'plasmaOrange03', srcs : 'plugins/ShootEmUp/assets/tileMaps/plasma/Orange Plasma/Orange_Plasma_03.png'},
				{name : 'plasmaGreen01', srcs : 'plugins/ShootEmUp/assets/tileMaps/plasma/Green Plasma/Green_Plasma_01.png'},
				{name : 'plasmaGreen02', srcs : 'plugins/ShootEmUp/assets/tileMaps/plasma/Green Plasma/Green_Plasma_02.png'},
				{name : 'plasmaGreen03', srcs : 'plugins/ShootEmUp/assets/tileMaps/plasma/Green Plasma/Green_Plasma_03.png'},
				{name : 'statusBarHealth', srcs : 'plugins/ShootEmUp/assets/Status_Bar_Health.png'},
				{name : 'statusBarShield', srcs : 'plugins/ShootEmUp/assets/Status_Bar_Shield.png'}
			]
		},
		{
			name : 'spaceShips',
			assets : [
				{name : 'mainSpaceShip', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/07/Spaceship_07_YELLOW_animated.png'},
				{name : 'foeSpaceShip00', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Grey/Spaceship_01.png'},
				{name : 'foeSpaceShip01', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Grey/Spaceship_02.png'},
				{name : 'foeSpaceShip02', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Grey/Spaceship_03.png'},
				{name : 'foeSpaceShip01Shielded', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Grey/Spaceship_04.png'},
				{name : 'foeSpaceShip02Shielded', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Grey/Spaceship_05.png'},
			]
		},
		{
			name : 'bosses',
			assets : [
				{name : 'bossSpaceShip01', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Boss_01.png'},
				{name : 'bossSpaceShip02', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Boss_02.png'},
				{name : 'bossSpaceShip03', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Boss_03.png'},
				{name : 'bossSpaceShip04', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Boss_04.png'},
				{name : 'bossSpaceShip05', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Boss_05.png'},
				{name : 'bossSpaceShip06', srcs : 'plugins/ShootEmUp/assets/ships/Spaceships/Boss_06.png'}
			]
		},
		{
			name : 'flames',
			assets : [
				{name : 'flamesTilemap', srcs : 'plugins/ShootEmUp/assets/ships/Flames_tilemap.png'},
				{name : 'foeFireballTilemap', srcs : 'plugins/ShootEmUp/assets/Foe_Fireball_Sprite.png'},
				{name : 'fireballsTilemap', srcs : 'plugins/ShootEmUp/assets/Fireball_sprite_v2.png'},
				{name : 'redFireballsTilemap', srcs : 'plugins/ShootEmUp/assets/RedFireballSprite.png'},
				{name : 'multiFireSpearsSprite', srcs : 'plugins/ShootEmUp/assets/MultiFireSpearsSprite.png'},
				{name : 'blueFireballSprite', srcs : 'plugins/ShootEmUp/assets/BlueFireballSprite.png'},
				{name : 'impactTilemap', srcs : 'plugins/ShootEmUp/assets/Impact_sprite.png'},
				{name : 'greenExplosionTilemap', srcs : 'plugins/ShootEmUp/assets/Explosion_Sprite.png'},
				{name : 'yellowExplosionTilemap', srcs : 'plugins/ShootEmUp/assets/Yellow_Explosion_Sprite.png'},
				{name : 'shieldTilemap', srcs : 'plugins/ShootEmUp/assets/Shield_Sprite.png'},
				{name : 'bigShieldTilemap', srcs : 'plugins/ShootEmUp/assets/Big_Shield_Sprite.png'},
				{name : 'bigExplosionTilemap', srcs : 'plugins/ShootEmUp/assets/Big_Explosion_Sprite.png'},
				{name : 'medikitTilemap', srcs : 'plugins/ShootEmUp/assets/loots/Medikit_Sprite.png'},
				{name : 'weaponTilemap', srcs : 'plugins/ShootEmUp/assets/loots/Weapon_Sprite.png'}
			]
		},
		{
			name : 'audio',
			assets : [
				{name : 'levelTheme', srcs : 'plugins/ShootEmUp/assets/audio/SpaceHarrierTheme_w_Blank.mp3', parser: 'sound'},
				{name : 'bossTheme', srcs : 'plugins/ShootEmUp/assets/audio/Sanxion.mp3'}
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
				PIXI.Assets.loadBundle('bosses'),
				// @ts-ignore
				PIXI.Assets.loadBundle('flames'),
				// @ts-ignore
				PIXI.Assets.loadBundle('audio')
			]).then(function(loadedAssets) {
				resolve(loadedAssets);
			});
		});
	});