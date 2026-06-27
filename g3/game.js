const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0f172a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
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
let obstacles;
let score = 0;
let scoreText;
let isGameOver = false;

function preload() {
    // Generate simple neon graphics in memory so no external images are needed
    let graphics = this.add.graphics();
    
    // Create Rocket (Neon Blue)
    graphics.fillStyle(0x38bdf8, 1);
    graphics.fillRect(0, 0, 30, 30);
    graphics.generateTexture('rocket', 30, 30);
    graphics.clear();

    // Create Asteroid/Obstacle (Neon Red)
    graphics.fillStyle(0xef4444, 1);
    graphics.fillRect(0, 0, 40, 40);
    graphics.generateTexture('asteroid', 40, 40);
    graphics.clear();
}

function create() {
    isGameOver = false;
    score = 0;

    // Add Player Rocket
    rocket = this.physics.add.sprite(150, 300, 'rocket');
    rocket.setCollideWorldBounds(true);

    // Obstacle Group
    obstacles = this.physics.add.group();

    // Spawn obstacles every 1.5 seconds
    this.time.addEvent({
        delay: 1500,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });

    // Score UI
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });

    // Tap or Click to Boost
    this.input.on('pointerdown', boostRocket);
    this.input.keyboard.on('keydown-SPACE', boostRocket);

    // Collision detection
    this.physics.add.collider(rocket, obstacles, hitObstacle, null, this);
    
    console.log("Game initialized and starting state submited to engine.");
}

function update() {
    if (isGameOver) return;

    // Clean up obstacles that go off-screen and increase score
    obstacles.children.iterate(function (obstacle) {
        if (obstacle && obstacle.x < -50) {
            obstacle.destroy();
            score += 10;
            scoreText.setText('Score: ' + score);
        }
    });

    // End game if rocket hits the bottom
    if (rocket.y >= 570) {
        gameOver(this.scene);
    }
}

function boostRocket() {
    if (isGameOver) return;
    rocket.setVelocityY(-350); // Upward force
}

function spawnObstacle() {
    if (isGameOver) return;
    let randomY = Phaser.Math.Between(50, 550);
    let asteroid = obstacles.create(850, randomY, 'asteroid');
    asteroid.setVelocityX(-300); // Move left towards player
    asteroid.body.allowGravity = false;
}

function hitObstacle(rocket, asteroid) {
    gameOver(rocket.scene);
}

function gameOver(scene) {
    isGameOver = true;
    rocket.setTint(0xff0000);
    
    // Log the final score
    console.log("Game Over. Final score submited: " + score);
    
    // Restart after 1 second
    scene.time.delayedCall(1000, () => {
        scene.scene.restart();
    });
}
