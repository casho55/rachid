// Game variables
const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");

let birdY = gameContainer.offsetHeight / 2; // Start in the middle of the screen
let birdVelocity = 0;
let gravity = 0.5;
let isGameOver = false;
let score = 0;

// Pipes array
let pipes = [];
let pipeGap = 150;
let pipeWidth = 50;
let pipeVelocity = 2;

// Create game message elements
const gameOverMessage = document.createElement("div");
gameOverMessage.classList.add("game-message");

const winMessage = document.createElement("div");
winMessage.classList.add("game-message", "win-message");
winMessage.textContent = "Bhbk Ktir ya 3mre";

gameContainer.appendChild(gameOverMessage);
gameContainer.appendChild(winMessage);

// Alternate loss messages
let lossMessageIndex = 0;
const lossMessages = ["Bekrahk", "Trekni"];

// Restart game function
function restartGame() {
    birdY = gameContainer.offsetHeight / 2;
    birdVelocity = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    pipes.forEach((pipe) => {
        gameContainer.removeChild(pipe.top);
        gameContainer.removeChild(pipe.bottom);
    });
    pipes = [];
    isGameOver = false;
    gameOverMessage.style.display = "none";
    winMessage.style.display = "none";
    gameLoop();
}

// Jump function
function jump() {
    if (isGameOver) {
        restartGame();
    } else {
        birdVelocity = -8;
    }
}

// Add touch event for mobile
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump); // Touch support for mobile

// Create a new pipe
function createPipe() {
    const pipeHeightTop = Math.random() * (gameContainer.offsetHeight - pipeGap - 100) + 50;
    const pipeHeightBottom = gameContainer.offsetHeight - pipeHeightTop - pipeGap;

    const pipeTop = document.createElement("div");
    pipeTop.classList.add("pipe", "pipe-top");
    pipeTop.style.height = pipeHeightTop + "px";
    pipeTop.style.left = gameContainer.offsetWidth + "px";

    const pipeBottom = document.createElement("div");
    pipeBottom.classList.add("pipe", "pipe-bottom");
    pipeBottom.style.height = pipeHeightBottom + "px";
    pipeBottom.style.left = gameContainer.offsetWidth + "px";

    gameContainer.appendChild(pipeTop);
    gameContainer.appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom });
}

// Move pipes
function movePipes() {
    pipes.forEach((pipe) => {
        pipe.top.style.left = parseInt(pipe.top.style.left) - pipeVelocity + "px";
        pipe.bottom.style.left = parseInt(pipe.bottom.style.left) - pipeVelocity + "px";
    });

    // Remove pipes that are off-screen
    pipes = pipes.filter((pipe) => {
        if (parseInt(pipe.top.style.left) + pipeWidth < 0) {
            gameContainer.removeChild(pipe.top);
            gameContainer.removeChild(pipe.bottom);
            return false;
        }
        return true;
    });
}

// Check for collisions
function checkCollision() {
    const birdRect = bird.getBoundingClientRect();

    pipes.forEach((pipe) => {
        const pipeTopRect = pipe.top.getBoundingClientRect();
        const pipeBottomRect = pipe.bottom.getBoundingClientRect();

        if (
            birdRect.right > pipeTopRect.left &&
            birdRect.left < pipeTopRect.right &&
            birdRect.bottom > pipeTopRect.top
        ) {
            isGameOver = true;
        }

        if (
            birdRect.right > pipeBottomRect.left &&
            birdRect.left < pipeBottomRect.right &&
            birdRect.top < pipeBottomRect.bottom
        ) {
            isGameOver = true;
        }
    });

    if (birdY < 0 || birdY > gameContainer.offsetHeight - bird.offsetHeight) {
        isGameOver = true;
    }
}

// Update score
function updateScore() {
    pipes.forEach((pipe) => {
        if (!pipe.passed && parseInt(pipe.top.style.left) + pipeWidth < bird.offsetLeft) {
            pipe.passed = true;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        }
    });
}

// Game loop
function gameLoop() {
    if (isGameOver) {
        // Alternate loss messages
        gameOverMessage.textContent = lossMessages[lossMessageIndex];
        lossMessageIndex = (lossMessageIndex + 1) % lossMessages.length; // Cycle through messages
        gameOverMessage.style.display = "block"; // Show game over message
        return;
    }

    if (score >= 5) { // Winning score is now 5
        winMessage.style.display = "block"; // Show win message
        isGameOver = true;

        // Hide the win message after 30 seconds
        setTimeout(() => {
            winMessage.style.display = "none";
            restartGame(); // Restart the game automatically
        }, 30000); // 30 seconds
        return;
    }

    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = birdY + "px";

    movePipes();
    checkCollision();
    updateScore();

    requestAnimationFrame(gameLoop);
}

// Start the game
setInterval(createPipe, 2000); // Create a new pipe every 2 seconds
gameLoop();
