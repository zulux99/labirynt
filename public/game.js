const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    parent: "phaser-example",
    pixelArt: true,
    backgroundColor: "#1a1a2d",
    physics: {
        default: "arcade",
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

game = new Phaser.Game(config);

function preload() {
    this.load.image("tiles", "tile/drawtiles-spaced.png");
    this.load.spritesheet("postac", "tile/postackopia.png", {
        frameWidth: 32,
        frameHeight: 32,
    });
    this.load.tilemapCSV(
        "map",
        "https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tilemaps/csv/grid.csv",
    );
}

function create() {
    const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
    tileset = map.addTilesetImage("tiles", null, 32, 32, 1, 2);
    layer = map.createStaticLayer(0, tileset, 0, 0);
    layer.setCollisionBetween(1, 50);
    player = this.physics.add.sprite(48, 48, "postac");
    player.setScale(.95);
    this.physics.add.collider(player, layer);
    this.cameras.main.startFollow(player, true);
    this.cameras.main.setFollowOffset(-player.width, -player.height);
    cursors = this.input.keyboard.createCursorKeys();
}
function update(){
    if (cursors.left.isDown) 
        player.setVelocityX(-100);
    else if (cursors.right.isDown)
        player.setVelocityX(100);
    else 
        player.setVelocityX(0);
    if (cursors.down.isDown)
        player.setVelocityY(100);
    else if (cursors.up.isDown)
        player.setVelocityY(-100);
    else
        player.setVelocityY(0);
}