config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    backgroundColor: '#1a1a2d',
    scene: {
        preload: preload,
        create: create
    }
};

game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'public/tile/drawtiles-spaced.png');
    this.load.image('postac', 'public/tile/postac.png');
    this.load.tilemapCSV('map', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tilemaps/csv/grid.csv');
}

function create ()
{
    map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    tileset = map.addTilesetImage('tiles', null, 32, 32, 0, 0);
    layer = map.createStaticLayer(0, tileset, 0, 0);
    player = this.add.sprite(32+16, 32+16, 'postac');
    player.anchor.set(0.5);

    game.physics.arcade.enable(player);

    cursors = game.input.keyboard.createCursorKeys();

    //  Left
    this.input.keyboard.on('keydown_A', function (event) {
        tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.x -= 32;
        }

    });

    //  Right
    this.input.keyboard.on('keydown_D', function (event) {

        tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.x += 32;
        }

    });

    //  Up
    this.input.keyboard.on('keydown_W', function (event) {

        tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.y -= 32;
            player.angle = -90;
        }

    });

    //  Down
    this.input.keyboard.on('keydown_S', function (event) {

        tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
            player.y += 32;
            player.angle = 90;
        }

    });

}
