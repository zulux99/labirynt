const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    parent: 'phaser-example',
    pixelArt: true,
    backgroundColor: '#1a1a2d',
    plugins: {
        scene: [{
            key: "gridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
          }],
      },
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', 'public/tile/drawtiles-spaced.png');
    // this.load.spritesheet('postac', 'public/tile/postackopia.png', {
    //     frameWidth: 32,
    //     frameHeight: 32,
    //   });
    this.load.image('postac', 'public/assets/super_mario.png')
      this.load.tilemapTiledJSON("map", "assets/super_mario.json");
    // this.load.tilemapCSV('map', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tilemaps/csv/grid.csv');
}

function create() {
    const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
    layer = map.createStaticLayer(0, tileset, 0, 0);
    // player = this.add.sprite(32 + 16, 32 + 16, 'postac');
    // layer.setCollisionBetween(1, 50);
    player = this.physics.add.sprite(48, 48, "postac");
    player.setScale(.95);
    this.physics.add.collider(player, layer);
    this.cameras.main.startFollow(player, true);
    this.cameras.main.setFollowOffset(-player.width, -player.height);
    const gridEngineConfig = {
        characters: [
          {
            id: "postac",
            sprite: player,
            walkingAnimationMapping: 6,
            walkingAnimationEnabled: true,
            startPosition: { x: 8, y: 8 },
          },
        ],
      };
    this.gridEngine.create(map, gridEngineConfig);
}
function update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move("player", "left");
    } else if (cursors.right.isDown) {
      this.gridEngine.move("player", "right");
    } else if (cursors.up.isDown) {
      this.gridEngine.move("player", "up");
    } else if (cursors.down.isDown) {
      this.gridEngine.move("player", "down");
    }
  }