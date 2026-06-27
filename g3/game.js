const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0a0a2a', // Deep space black/blue
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
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
let cursors;
let fireButton;
let score = 0;
let scoreText;
let isGameOver = false;
let lastFired = 0;

function preload() {
    let graphics = this.add.graphics();
    
    // Create Rocket Graphic (A sleek upwards triangle)
    graphics.fillStyle(0x38bdf8, 1);
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(20, 0);   // Top point
    graphics.lineTo(40, 40);  // Bottom right
    graphics.lineTo(0, 40);   // Bottom left
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
    graphics.generateTexture('rocket', 40, 40);
    graphics.clear();

    // Create Laser Graphic (Neon Green Line)
    graphics.fillStyle(0x22c55e, 1);
    graphics.fillRect(0, 0, 4, 20);
    graphics.generateTexture('laser', 4, 20);
    graphics.clear();

    // Create Asteroid Graphic (Red/Orange block)
    graphics.fillStyle(0xef4444, 1);
    graphics.fillRect(0, 0, 35, 35);
    graphics.generateTexture('asteroid', 35, 35);
    graphics.clear();
}

function create() {
    isGameOver = false;
    score = 0;

    // Add Player Rocket at the bottom center
    rocket = this.physics.add.sprite(400, 500, 'rocket');
    rocket.setCollideWorldBounds(true);

    // Create Lasers Group
    lasers = this.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
        maxSize: 30,
        runChildUpdate: true
    });

    // Create Asteroids Group
    asteroids = this.physics.add.group();

    // Spawn asteroids every second
    this.time.addEvent({
        delay: 1000,
        callback: spawnAsteroid,
        callbackScope: this,
        loop: true
    });

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // UI
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff', fontFamily: 'Arial' });

    // Collisions
    this.physics.add.overlap(lasers, asteroids, destroyAsteroid, null, this);
    this.physics.add.overlap(rocket, asteroids, hitAsteroid, null, this);
}

function update(time) {
    if (isGameOver) return;

    // Rocket Movement (Left/Right)
    if (cursors.left.isDown) {
        rocket.setVelocityX(-400);
    } else if (cursors.right.isDown) {
        rocket.setVelocityX(400);
    } else {
        rocket.setVelocityX(0);
    }

    // Firing Mechanics (Spacebar)
    if (fireButton.isDown && time > lastFired) {
        let laser = lasers.get();
        if (laser) {
            laser.setActive(true).setVisible(true);
            // Fire from the nose of the rocket
            laser.setPosition(rocket.x, rocket.y - 20); 
            laser.setVelocityY(-600); // Move straight up
            lastFired = time + 150; // Fire rate delay (150ms)
        }
    }

    // Clean up lasers that go off screen
    lasers.children.iterate(function (laser) {
        if (laser && laser.y < -20) {
            laser.setActive(false).setVisible(false);
        }
    });

    // Clean up asteroids that go off screen (missed by player)
    asteroids.children.iterate(function (asteroid) {
        if (asteroid && asteroid.y > 650) {
            asteroid.destroy();
        }
    });
}

function spawnAsteroid() {
    if (isGameOver) return;
    let randomX = Phaser.Math.Between(30, 770);
    let asteroid = asteroids.create(randomX, -50, 'asteroid');
    // Randomize falling speed to make it exciting
    asteroid.setVelocityY(Phaser.Math.Between(150, 400));
}

function destroyAsteroid(laser, asteroid) {
    laser.setActive(false).setVisible(false);
    asteroid.destroy();
    
    score += 50;
    scoreText.setText('Score: ' + score);
}

function hitAsteroid(rocket, asteroid) {
    isGameOver = true;
    rocket.setTint(0xff0000); // Turn rocket red
    rocket.setVelocityX(0);
    
    // Log the final score ensuring specific formatting requirements
    console.log("Game Over. Final score submited: " + score);
    scoreText.setText('GAME OVER! Score: ' + score);
    
    // Restart after 2 seconds
    rocket.scene.time.delayedCall(2000, () => {
        rocket.scene.scene.restart();
    });
}
