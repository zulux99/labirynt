const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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

    this.load.image("mask", "assets/mask.png")
    // ściany
    this.load.image("tiles", "tile/drawtiles-spaced.png");
    // postac
    this.load.spritesheet("postac", "tile/postackopia.png", {
        frameWidth: 32,
        frameHeight: 32,
    });
    // mapa
    this.load.tilemapCSV(
        "map",
        "https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tilemaps/csv/grid.csv",
    );
}

function create() {
    //#region animacje
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('postac', { frames: [1] }),
        frameRate: 0,
        repeat: 1,
    });
    this.anims.create({
        key: 'walk_left',
        frames: this.anims.generateFrameNumbers('postac', { frames: [3, 4, 5] }),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_right',
        frames: this.anims.generateFrameNumbers('postac', { frames: [6, 7, 8] }),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'walk_up',
        frames: this.anims.generateFrameNumbers('postac', { frames: [9, 10, 11] }),
        frameRate: 6,
        repeat: -1,
    });
    this.anims.create({
        key: 'walk_down',
        frames: this.anims.generateFrameNumbers('postac', { frames: [0, 1, 2] }),
        frameRate: 6,
        repeat: -1,
    });
    //#endregion

    // kafelki, mapa, warstwy, kolizja
    const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
    tileset = map.addTilesetImage("tiles", null, 32, 32, 1, 2);
    layer = map.createStaticLayer(0, tileset, 0, 0);
    layer.setCollisionBetween(1, 50);


    // tworzenie postaci, ruchy kamery
    player = this.physics.add.sprite(48, 48, "postac");
    player.setScale(.8);
    this.physics.add.collider(player, layer);
    this.cameras.main.startFollow(player, true);
    this.cameras.main.setFollowOffset(-player.width / 2, -player.height / 2);
    this.cameras.main.setDeadzone(64, 64);
    this.cameras.main.setZoom(1.5);

    // dystans widzenia
    cien = this.make.sprite({
        x: 20,
        y: 20,
        key: 'mask',
        scale: 1.3,
        add: false,
    });
    layer.mask = cien.createBitmapMask();
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {

    //#region poruszanie się po mapie
    if (cursors.left.isDown) {
        player.play("walk_left", true);
        player.setVelocity(-100, 0);
    }
    else if (cursors.right.isDown) {
        player.play("walk_right", true);
        player.setVelocity(100, 0);
    }
    else if (cursors.down.isDown) {
        player.play("walk_down", true);
        player.setVelocity(0, 100);
    }
    else if (cursors.up.isDown) {
        player.play("walk_up", true);
        player.setVelocity(0, -100);
    }
    else {
        player.setVelocity(0, 0);
        player.play("idle");
    }
    //#endregion
    // dystans widzenia porusza się z graczem
    cien.x = player.body.position.x + 14;
    cien.y = player.body.position.y + 14;
}