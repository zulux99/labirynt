var cursors, map, player, tileset, layer, cien, keyW, keyA, keyS, keyD;
class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    preload() {

        this.load.image("mask", "assets/mask.png")
        // ściany
        this.load.image("tiles", "tile/test.png");
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

    create() {
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

        cursors = this.input.keyboard.createCursorKeys();
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        // kafelki, mapa, warstwy, kolizja
        map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
        tileset = map.addTilesetImage("tiles", null, 32, 32, 0, 0);
        layer = map.createStaticLayer(0, tileset, 0, 0);
        layer.setCollisionBetween(1, 50);


        // tworzenie postaci, ruchy kamery
        player = this.physics.add.sprite(48, 40, "postac");
        player.body.setSize(16, 16).setOffset(8, 16);
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
        // mobilne
        if (!this.sys.game.device.os.desktop) {
            this.cameras.main.y = -window.innerHeight * 0.2;
            this.cameras.main.setZoom(2.5);
        }
    }

    update() {
        //#region poruszanie się po mapie
        if (cursors.left.isDown || keyA.isDown) {
            player.play("walk_left", true);
            player.setVelocity(-100, 0);
        }
        else if (cursors.right.isDown || keyD.isDown) {
            player.play("walk_right", true);
            player.setVelocity(100, 0);
        }
        else if (cursors.down.isDown || keyS.isDown) {
            player.play("walk_down", true);
            player.setVelocity(0, 100);
        }
        else if (cursors.up.isDown || keyW.isDown) {
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
}
class Hud extends Phaser.Scene {

    constructor() {
        super({ key: 'Hud', active: true });
    }
    preload() {
        this.load.image("goRight", "assets/arrow_right.png");
        this.load.image("goLeft", "assets/arrow_left.png");
        this.load.image("goUp", "assets/arrow_up.png");
        this.load.image("goDown", "assets/arrow_down.png");
    }
    create() {
        this.scene.get("Game");
        if (!this.sys.game.device.os.desktop) {
            this.goLeft = this.add.image(window.innerWidth * 0.3, window.innerHeight * 0.7, 'goLeft').setInteractive();
            this.goLeft.setAlpha(0.5);
            this.goLeft.setScale(0.3);
            this.goRight = this.add.image(window.innerWidth * 0.7, window.innerHeight * 0.7, 'goRight').setInteractive();
            this.goRight.setAlpha(0.5);
            this.goRight.setScale(0.3);
            this.goDown = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.8, 'goDown').setInteractive();
            this.goDown.setAlpha(0.5);
            this.goDown.setScale(0.3);
            this.goUp = this.add.image(window.innerWidth * 0.5, window.innerHeight * 0.6, 'goUp').setInteractive();
            this.goUp.setAlpha(0.5);
            this.goUp.setScale(0.3);
        }
    }
    update() {

        if (!this.sys.game.device.os.desktop) {
            this.goLeft.on('pointerdown', function (pointer) {
                this.goLeft.setAlpha(1);
                cursors.left.isDown = true;
            }, this);
            this.goLeft.on('pointerup', function (pointer) {
                this.goLeft.setAlpha(0.5);
                cursors.left.isDown = false;
            }, this);
            this.goRight.on('pointerdown', function (pointer) {
                this.goRight.setAlpha(1);
                cursors.right.isDown = true;
            }, this);
            this.goRight.on('pointerup', function (pointer) {
                this.goRight.setAlpha(0.5);
                cursors.right.isDown = false;
            }, this);
            this.goDown.on('pointerdown', function (pointer) {
                this.goDown.setAlpha(1);
                cursors.down.isDown = true;
            }, this);
            this.goDown.on('pointerup', function (pointer) {
                this.goDown.setAlpha(0.5);
                cursors.down.isDown = false;
            }, this);
            this.goUp.on('pointerdown', function (pointer) {
                this.goUp.setAlpha(1);
                cursors.up.isDown = true;
            }, this);
            this.goUp.on('pointerup', function (pointer) {
                this.goUp.setAlpha(0.5);
                cursors.up.isDown = false;
            }, this);
        }

    }
}
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "phaser-example",
    pixelArt: true,
    backgroundColor: "#000",
    physics: {
        default: "arcade",
    },
    scene: [Game, Hud]
};

game = new Phaser.Game(config);