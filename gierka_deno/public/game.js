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
    this.load.image('sky', 'public/assets/sky.png');
    this.load.image('ground', 'public/assets/platform.png');
    this.load.image('star', 'public/assets/star.png');
    this.load.image('bomb', 'public/assets/bomb.png');
    this.load.spritesheet('dude', 
        'public/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create() {
    this.add.image(400, 300, 'sky');

}