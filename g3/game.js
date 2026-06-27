const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#040b16', // Deep abyss blue
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let rocket;
let lasers;
let asteroids;
let stars;
let cursors;
let fireButton;
let score = 0;
let scoreText;
let gameOverText;
let isGameOver = false;
let lastFired = 0;

function preload() {
    let graphics = this.add.graphics();
    
    // 1. Sleek Rocket Texture
    graphics.fillStyle(0x38bdf8, 1);
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(20, 0);
    graphics.lineTo(40, 40);
    graphics.lineTo(20, 30); // Inner engine curve
    graphics.lineTo(0, 40);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
    graphics.generateTexture('rocket', 40, 40);
    graphics.clear();

    // 2. Neon Laser Texture
    graphics.fillStyle(0x00ffff, 1); // Cyan
    graphics.fillRect(0, 0, 4, 25);
    graphics.generateTexture('laser', 4, 25);
    graphics.clear();

    // 3. Asteroid Texture
    graphics.fillStyle(0x8b5cf6, 1); // Purple/Violet asteroid
    graphics.lineStyle(2, 0xc4b5fd, 1);
    graphics.strokeRect(0, 0, 35, 35);
    graphics.fillRect(0, 0, 35, 35);
    graphics.generateTexture('asteroid', 35, 35);
    graphics.clear();

    // 4. Engine Particle Texture
    graphics.fillStyle(0xf97316, 1); // Orange flame
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);
    graphics.clear();
}

function create() {
    isGameOver = false;
    score = 0;

    // Create a moving starfield for depth
    stars = this.add.group();
    for (let i = 0; i < 100; i++) {
        let x = Phaser.Math.Between(0, 800);
        let y = Phaser.Math.Between(0, 600);
        let star = this.add.rectangle(x, y, 2, 2, 0xffffff, Phaser.Math.FloatBetween(0.3, 0.8));
        stars.add(star);
    }

    // Add Player Rocket
    rocket = this.physics.add.sprite(400, 500, 'rocket');
    rocket.setCollideWorldBounds(true);
    rocket.setDepth(10); // Ensure rocket is on top

    // Engine Exhaust Particles
    let particles = this.add.particles('particle');
    let emitter = particles.createEmitter({
        speedY: { min: 200, max: 400 },
        speedX: { min: -20, max: 20 },
        scale: { start: 1, end: 0 },
        lifespan: 300,
        blendMode: 'ADD' // Creates a glowing neon effect
    });
    emitter.startFollow(rocket, 0, 20); // Attach to bottom of rocket

    // Groups
    lasers = this.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
        maxSize: 40,
        runChildUpdate: true
    });
    asteroids = this.physics.add.group();

    // Spawn Enemies
    this.time.addEvent({
        delay: 800,
        callback: spawnAsteroid,
        callbackScope: this,
        loop: true
    });

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // UI Formatting
    scoreText = this.add.text(20, 20, 'SCORE: 0', { 
        fontSize: '28px', 
        fill: '#38bdf8', 
        fontFamily: 'Courier New',
        fontStyle: 'bold'
    });
    scoreText.setShadow(0, 0, 'rgba(56, 189, 248, 0.8)', 10); // Glowing text

    gameOverText = this.add.text(400, 300, '', { 
        fontSize: '40px', 
        fill: '#ef4444', 
        fontFamily: 'Courier New',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    gameOverText.setShadow(0, 0, 'rgba(239, 68, 68, 0.8)', 15);

    // Collisions
    this.physics.add.overlap(lasers, asteroids, destroyAsteroid, null, this);
    this.physics.add.overlap(rocket, asteroids, hitAsteroid, null, this);
}

function update(time) {
    if (isGameOver) return;

    // Animate Starfield Background
    stars.children.iterate(function (star) {
        star.y += 2;
        if (star.y > 600) {
            star.y = 0;
            star.x = Phaser.Math.Between(0, 800);
        }
    });

    // Rocket Movement
    rocket.setVelocityX(0);
    if (cursors.left.isDown) {
        rocket.setVelocityX(-450);
        rocket.setAngle(-10); // Tilt left
    } else if (cursors.right.isDown) {
        rocket.setVelocityX(450);
        rocket.setAngle(10); // Tilt right
    } else {
        rocket.setAngle(0); // Level out
    }

    // Firing Mechanics
    if (fireButton.isDown && time > lastFired) {
        let laser = lasers.get();
        if (laser) {
            laser.setActive(true).setVisible(true);
            laser.setPosition(rocket.x, rocket.y - 20); 
            laser.setVelocityY(-800); 
            laser.setBlendMode('ADD'); // Glowing laser
            lastFired = time + 100; // Rapid fire
        }
    }

    // Clean up memory
    lasers.children.iterate(function (laser) {
        if (laser && laser.y < -20) {
            laser.setActive(false).setVisible(false);
        }
    });
    asteroids.children.iterate(function (asteroid) {
        if (asteroid && asteroid.y > 650) {
            asteroid.destroy();
        }
    });
}

function spawnAsteroid() {
    if (isGameOver) return;
    let randomX = Phaser.Math.Between(40, 760);
    let asteroid = asteroids.create(randomX, -50, 'asteroid');
    asteroid.setVelocityY(Phaser.Math.Between(200, 450));
    // Add rotation to make them feel alive
    asteroid.setAngularVelocity(Phaser.Math.Between(-100, 100)); 
}

function destroyAsteroid(laser, asteroid) {
    laser.setActive(false).setVisible(false);
    asteroid.destroy();
    
    score += 100;
    scoreText.setText('SCORE: ' + score);
}

function hitAsteroid(rocket, asteroid) {
    isGameOver = true;
    rocket.setTint(0xff0000); 
    rocket.setVelocityX(0);
    
    // Display the final status on the screen for the player
    gameOverText.setText('DATA SUBMITED\nFINAL SCORE: ' + score);
    
    // Restart after 3 seconds
    rocket.scene.time.delayedCall(3000, () => {
        rocket.scene.scene.restart();
    });
}

