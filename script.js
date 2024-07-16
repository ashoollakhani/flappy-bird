const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

// Set canvas dimensions
canvas.width = 320;
canvas.height = 480;

// Load images
const birdImg = new Image();
birdImg.src = 'images/bird.png';

const pipeTopImg = new Image();
pipeTopImg.src = 'images/top-pipe.png';

const pipeBottomImg = new Image();
pipeBottomImg.src = 'images/bottom-pipe.jpg';

// Load audio
const flapSound = new Audio('sounds/flap.wav');
const hitSound = new Audio('sounds/hit.wav');
const scoreSound = new Audio('sounds/score.wav');
const backgroundMusic = new Audio('sounds/background.mp3');
backgroundMusic.loop = true;

// Bird properties
const bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.3, // Reduced gravity
    lift: -5, // Decreased lift
    velocity: 0
};

// Pipe properties
const pipes = [];
const pipeWidth = 52;
const pipeGap = 150; // Increased gap between pipes
let frame = 0;
let score = 0;
let gameRunning = false;

// Controls
document.addEventListener('keydown', () => {
    if (gameRunning) {
        bird.velocity = bird.lift;
        flapSound.play();
    }
});

canvas.addEventListener('touchstart', () => {
    if (gameRunning) {
        bird.velocity = bird.lift;
        flapSound.play();
    }
});

function drawBird() {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        context.drawImage(pipeTopImg, pipe.x, pipe.top - pipeTopImg.height);
        context.drawImage(pipeBottomImg, pipe.x, canvas.height - pipe.bottom);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
}

function updatePipes() {
    if (frame % 120 === 0) { // Slower pipe generation
        const pipeTop = Math.random() * (canvas.height / 2) + 20;
        const pipeBottom = canvas.height - pipeTop - pipeGap;
        pipes.push({ x: canvas.width, top: pipeTop, bottom: pipeBottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 1.5; // Slower pipe speed

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
            scoreElement.textContent = `Score: ${score}`;
            scoreSound.play();
        }

        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            endGame();
        }
    });
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frame = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    gameRunning = true;
    gameOverElement.style.display = 'none';
    backgroundMusic.play();
}

function endGame() {
    gameRunning = false;
    gameOverElement.style.display = 'block';
    hitSound.play();
    backgroundMusic.pause();
}

function restartGame() {
    resetGame();
    gameLoop();
}

function startGame() {
    resetGame();
    gameRunning = true;
    gameLoop();
}

function gameLoop() {
    if (gameRunning) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawBird();
        drawPipes();
        updateBird();
        updatePipes();

        frame++;
        requestAnimationFrame(gameLoop);
    }
}

// Start game on load
window.onload = () => {
    startGame();
};
