// deno-lint-ignore-file no-var
var cursors, map, player, tileset, layer, cien, keyW, keyA, keyS, keyD, loading, level, dimensionsx, dimensionsy, aaaaa = false, oko, graczX, graczY,
    difficulty, opis, idgame, actualX, actualY, player2, id;
let socket = new WebSocket('ws://25.89.121.208/join');
let socket = new WebSocket('ws://'+window.location.hostname+'/join');

class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }
    preload() {
        this.load.spritesheet("ladowanie", "assets/loading.png", {
            frameWidth: 500,
            frameHeight: 500
        });
    }
    create() {
        this.anims.create({
            key: 'loading',
            frames: this.anims.generateFrameNumbers('ladowanie', {
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
            }),
            frameRate: 15,
            repeat: -1,
        });

        function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }



        loading = this.add.sprite(0, 0, "loading");
        this.cameras.main.startFollow(loading, true);
        loading.play("loading", true);
        id = getCookie("id");
        let idgame = getCookie("idgame");
        console.log(id + " " + idgame)
        if (id === '' || idgame === '') {
            console.log(id + " " + idgame)
            window.location.href = ''+window.location.hostname+'/';
        }
        let temp = '{"type":"join","idGame":"' + idgame + '","idPlayer":"' + id + '"}';
        
        console.log("111111111111111111")
        socket.send(temp)
        socket.addEventListener('open', function (event) {
            console.log("??????????????????????????????")
            console.log(temp)
            socket.send(temp)
        });



    }
    update() {
        if (aaaaa == false) {

        }
        socket.onmessage = function (event) {
            console.log(event.data);
            if (aaaaa === false) {
                console.log(event.data);

                let jsn = JSON.parse(event.data)
                console.log(jsn.map + ' ======================')
                if (jsn.map != "") {
                    console.log("jsn.map" + jsn.map)
                    level = JSON.parse(JSON.parse(jsn.map))
                    dimensionsx = jsn.dimensionsx
                    dimensionsy = jsn.dimensionsy
                    opis = jsn.opis
                    idgame = jsn.idgame
                    difficulty = jsn.difficulty
                    aaaaa = true
                }
            }

        }

        if (aaaaa) {
            aaaaa = ""

            this.scene.start("Game");
        }
    }
}
class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    preload() {
        this.load.image("oko", "assets/eye.png");
        this.load.image("maczuga", "assets/6.png");
        this.load.image("goRight", "assets/arrow_right.png");
        this.load.image("goLeft", "assets/arrow_left.png");
        this.load.image("goUp", "assets/arrow_up.png");
        this.load.image("goDown", "assets/arrow_down.png");

        this.load.image("mask", "assets/mask.png");
        // ściany
        this.load.image("tiles", "assets/mapa.png");
        // postac
        this.load.spritesheet("postac", "assets/postac.png", {
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
        const level = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        //#region animacje

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('postac', {
                frames: [1]
            }),
            frameRate: 0,
            repeat: 1,
        });
        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('postac', {
                frames: [3, 4, 5]
            }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('postac', {
                frames: [6, 7, 8]
            }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_up',
            frames: this.anims.generateFrameNumbers('postac', {
                frames: [9, 10, 11]
            }),
            frameRate: 6,
            repeat: -1,
        });
        this.anims.create({
            key: 'walk_down',
            frames: this.anims.generateFrameNumbers('postac', {
                frames: [0, 1, 2]
            }),
            frameRate: 6,
            repeat: -1,
        });
        //#endregion
        //#region zdefiniowanie klawiszy do poruszania postacią
        cursors = this.input.keyboard.createCursorKeys();
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        //#endregion

        // kafelki, mapa, warstwy, kolizja

        map = this.make.tilemap({
            data: level,
            tileWidth: 32,
            tileHeight: 32
        });
        // map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
        tileset = map.addTilesetImage("tiles", null, 32, 32, 0, 0);
        layer = map.createStaticLayer(0, tileset, 0, 0);
        layer.setCollisionBetween(1, 2);

        // tworzenie postaci, ruchy kamery
        player2 = this.add.sprite(3 * 32 + 8, 1 * 32, "postac")
        player = this.physics.add.sprite(48, 40, "postac");
        player.body.setSize(16, 16).setOffset(8, 16);
        this.physics.add.collider(player, layer);
        this.cameras.main.startFollow(player, true);
        this.cameras.main.setFollowOffset(-player.width / 2, -player.height / 2);
        this.cameras.main.setDeadzone(64, 64);
        this.cameras.main.setZoom(1.5);

        actualX = player.body.position.x
        actualY = player.body.position.y
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
        // oko = this.physics.add.sprite(6 * 32 + 16, 3 * 32 + 16, "oko");
        player = this.physics.add.sprite(40, 32, "postac");
        player.body.setSize(16, 16).setOffset(8, 16);
        this.physics.add.collider(player, layer);
        this.cameras.main.startFollow(player, true);
        this.cameras.main.setFollowOffset(-player.width / 2, -player.height / 2);
        this.cameras.main.setDeadzone(64, 64);
        this.cameras.main.setZoom(1.7);
        layer.mask = cien.createBitmapMask();
        this.scene.launch("Hud")

        // pętla zwracająca płytki z trzema ścianami dookoła
        layer.forEachTile(tile =>{
            if (tile.index == 0){
                if (layer.getTileAt(tile.x - 1, tile.y).index == 0
                && layer.getTileAt(tile.x + 1, tile.y).index == 1
                && layer.getTileAt(tile.x, tile.y + 1).index == 1
                && layer.getTileAt(tile.x, tile.y - 1).index == 1
                ||
                layer.getTileAt(tile.x - 1, tile.y).index == 1
                && layer.getTileAt(tile.x + 1, tile.y).index == 0
                && layer.getTileAt(tile.x, tile.y + 1).index == 1
                && layer.getTileAt(tile.x, tile.y - 1).index == 1
                ||
                layer.getTileAt(tile.x - 1, tile.y).index == 1
                && layer.getTileAt(tile.x + 1, tile.y).index == 1
                && layer.getTileAt(tile.x, tile.y + 1).index == 0
                && layer.getTileAt(tile.x, tile.y - 1).index == 1
                ||
                layer.getTileAt(tile.x - 1, tile.y).index == 1
                && layer.getTileAt(tile.x + 1, tile.y).index == 1
                && layer.getTileAt(tile.x, tile.y + 1).index == 1
                && layer.getTileAt(tile.x, tile.y - 1).index == 0)
                {
                    console.log(tile.x)
                    this.add.sprite(tile.x * 32 + 16, tile.y * 32 + 16, "oko")
                }
            }
        })
        player.setDepth(1);
    }

    update() {
        graczX = parseInt((player.body.position.x + 8) / 32)
        graczY = parseInt((player.body.position.y + 8) / 32)
        //#region poruszanie się po mapie
        if (cursors.left.isDown || keyA.isDown) {
            player.play("walk_left", true);
            player.setVelocity(-100, 0);
        } else if (cursors.right.isDown || keyD.isDown) {
            player.play("walk_right", true);
            player.setVelocity(100, 0);
        } else if (cursors.down.isDown || keyS.isDown) {
            player.play("walk_down", true);
            player.setVelocity(0, 100);
        } else if (cursors.up.isDown || keyW.isDown) {
            player.play("walk_up", true);
            player.setVelocity(0, -100);
        } else {
            player.setVelocity(0, 0);
            player.play("idle");
        }
        //#endregion
        // dystans widzenia porusza się z graczem
        cien.x = player.body.position.x + 8;
        cien.y = player.body.position.y + 8;
            
        
        // if (actualX != player.body.position.x || actualY != player.body.position.y)
        if ( Math.abs( actualX-player.body.position.x) > 16 || Math.abs( actualY-player.body.position.y) > 16 ) {
            let abc = '{"type":"changeposition","name":"' + idgame + '","id":"' + id + '","x":"' + player.body.position.x + '","y":"' + player.body.position.y + '"}'
            console.log(abc)
            socket.send(abc)
            actualX = player.body.position.x
            actualY = player.body.position.y
        }
        socket.onmessage = function (event) {
            // console.log("....................................");
            console.log(" dane wejsciopwe " + event.data);

            let changexyval = JSON.parse(event.data)

            console.log(" json ons " + changexyval);
            changexyval.forEach(element => {
                if (element.id != id) {
                    player2.setPosition(element.x, element.y);
                }
            });


        }
        socket.onclose = function (event) {
            window.location.href = "/";
        };
    }
}
class Hud extends Phaser.Scene {

    constructor() {
        super("Hud");
    }
    create() {
        //#region strzalki na telefonie
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
        //#endregion
    }
    update() {
        //#region poruszanie się na telefonie
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
        //#endregion

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
    scene: [LoadingScene, Game, Hud]
};

game = new Phaser.Game(config);