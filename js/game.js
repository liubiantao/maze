var game = new Phaser.Game('100%', '100%', Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var ball;
var keys;
var shadowTexture;
var LIGHT_RADIUS = 100;
var showDebug = true;
var map;
var home;

function preload() {

    // game.load.image('bg', 'assets/background.jpg');
    game.load.spritesheet('ball', 'assets/ball.png', 48, 48);
    game.load.tilemap('maze', 'assets/maze.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/maze.png');
    game.load.spritesheet('home', 'assets/home.png', 33, 33);
    // game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    // var world = new World(game);
    // world.resize(1000 , 1200);

}

function create() {
    // game.stage.backgroundColor = "#555555";
    // game.world.setBounds(0, 0, 2000, 2000);
    // game.world.resize(1000, 1000);
    // game.add.sprite(0, 0, 'bg');
    map = game.add.tilemap('maze');
    map.addTilesetImage('maze-tileset', 'tiles');
    map.setCollision(33);
    layer = map.createLayer('Background');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();


    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(game.world.width / 2, game.world.height / 2, 'ball');
    home = game.add.sprite(500, 10, 'home');
    game.physics.arcade.enable(ball);
    game.physics.arcade.enable(home);

    ball.body.bounce.y = 0.1;
    ball.body.gravity.y = 0;
    ball.body.collideWorldBounds = true;
    ball.animations.add('roll', [0, 1, 2, 3], 10, true);

    keys = game.input.keyboard.createCursorKeys();
    window.addEventListener("deviceorientation", handleOrientation, true);
    game.input.onDown.add(toggle, this);

    // Create the shadow texture
    shadowTexture = game.add.bitmapData(game.world.width, game.world.height);

    // Create an object that will use the bitmap as a texture
    var lightSprite = game.add.image(0, 0, shadowTexture);

    // Set the blend mode to MULTIPLY. will darken the colors of
    // everything below sprite.
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    // Simulate a pointer click/tap input at the center of the stage
    // when the example begins running.
    game.input.activePointer.x = game.width / 2;
    game.input.activePointer.y = game.height / 2;

    game.camera.follow(ball);
    // game.camera.deadzone = new Phaser.Rectangle(game.camera.width / 2 - 50, game.camera.height / 2 - 50,
    // game.camera.width / 2 + 50, game.camera.height / 2 + 50);
}



function update() {

    game.physics.arcade.collide(ball, layer);
    game.physics.arcade.overlap(ball, home, finishGame);

    updateShadowTexture();

    // var force = 200;

    // if (keys.left.isDown) {
    //     ball.body.velocity.x = -force;
    //     ball.animations.play('roll');
    // } else if (keys.right.isDown) {
    //     ball.animations.play('roll');
    //     ball.body.velocity.x = force;
    // } else if (keys.up.isDown) {
    //     ball.animations.play('roll');
    //     ball.body.velocity.y = -force;
    // } else if (keys.down.isDown) {
    //     ball.animations.play('roll');
    //     ball.body.velocity.y = force;
    // } else {
    //     ball.animations.stop();
    //     ball.body.velocity.x = 0;
    //     ball.body.velocity.y = 0;
    // }
    // ball.body.acceleration.x = 10;
    // ball.body.acceleration.y = 10;
    // game.camera.focusOn(ball);

    // game.camera.x = ball.body.x;
    // game.camera.y = ball.body.y;
}

function handleOrientation(e) {
    game.physics.arcade.collide(ball, layer);
    game.physics.arcade.overlap(ball, home, finishGame);
    updateShadowTexture();
    var x = e.gamma; // range [-90,90]
    var y = e.beta; // range [-180,180]
    if (Math.abs(ball.body.velocity.x) < 500) {
        ball.body.velocity.x += x * 3;
        ball.body.velocity.y += y * 3;
    }
    // console.log(Math.abs(x) + "," + Math.abs(y));
    if (Math.abs(ball.body.velocity.x) > 5 || Math.abs(ball.body.velocity.y) > 5) {
        ball.animations.play('roll');
    } else {
        ball.animations.stop();
    }

}

function updateShadowTexture() {
    // This function updates the shadow texture (this.shadowTexture).
    // First, it fills the entire texture with a dark shadow color.
    // Then it draws a white circle centered on the pointer position.
    // Because the texture is drawn to the screen using the MULTIPLY
    // blend mode, the dark areas of the texture make all of the colors
    // underneath it darker, while the white area is unaffected.

    // Draw shadow
    shadowTexture.context.fillStyle = '#0A1821';
    shadowTexture.context.fillRect(0, 0, game.world.width, game.world.height);

    // Draw circle of light with a soft edge
    var gradient = shadowTexture.context.createRadialGradient(
        ball.body.x + 20, ball.body.y + 20, LIGHT_RADIUS * 0.75,
        ball.body.x + 20, ball.body.y + 20, LIGHT_RADIUS);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradient;
    console.log(ball.body.x);
    shadowTexture.context.arc(ball.body.x + 20, ball.body.y + 20,
        LIGHT_RADIUS, 0, Math.PI * 2);
    shadowTexture.context.fill();

    // just tells the engine it should update the texture cache
    shadowTexture.dirty = true;
}

function toggle() {
    showDebug = (showDebug) ? false : true;
    if (!showDebug) {
        game.debug.reset();
    }
}

function finishGame() {
    console.log('ok');
    home.kill();
    window.location.href = "http://atmg.al/cv";
}

function render() {
    if (showDebug) {
        game.debug.bodyInfo(ball, 32, 32);
        game.debug.cameraInfo(game.camera, 32, game.world.height - 200);

    }
}
