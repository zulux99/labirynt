// deno-lint-ignore-file no-var
var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
    }
};
var game = new Phaser.Game(config);
function preload ()
{
    this.load.image('tiles', 'public/tile/dungeon.png')
}

function create() {
    const array = [[0, 1, 2], [0, 1, 2], [0, 1, 2]]
    const map = this.make.tilemap({ data: array, tileWidth: 64, tileHeight: 64});
    map.addTilesetImage('tiles');
    const layer = map.createLayer(0, "tiles", 0, 0);
}