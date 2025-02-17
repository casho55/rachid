// Game variables
const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const winningScreen = document.getElementById("winning-screen");

let birdY = gameContainer.offsetHeight / 2;
let birdVelocity = 0;
let gravity = 0.5;
let isGameOver = false;
let hasWon = false; // Track if the player has won
let score = 0;
let lossCount = 0; // Track the number of losses

// Pipes array
let pipes = [];
let pipeGap = 150;
let pipeWidth = 50;
let pipeVelocity = 2;

// Restart game function
function restartGame() {
    if (hasWon) return; // Prevent replay if the player has won

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
    gameLoop();
}

// Jump function
function jump() {
    if (isGameOver && !hasWon) {
        restartGame(); // Allow replay only if the player has lost
    } else if (!isGameOver) {
        birdVelocity = -8;
    }
}

// Add touch event for mobile
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

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

// Show winning screen
function showWinningScreen() {
    hasWon = true; // Mark the player as having won
    winningScreen.classList.remove("hidden");
    winningScreen.classList.add("show");

    // Add confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti-piece");
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        document.getElementById("confetti").appendChild(confetti);
    }

    // Add flowers
    for (let i = 0; i < 10; i++) {
        const flower = document.createElement("div");
        flower.classList.add("flower");
        flower.style.left = `${Math.random() * 100}%`;
        flower.style.top = `${Math.random() * 100}%`;
        flower.style.animationDuration = `${Math.random() * 5 + 3}s`;
        document.getElementById("flowers").appendChild(flower);
    }
}

// Game loop
function gameLoop() {
    if (isGameOver) {
        lossCount++; // Increment loss count
        if (lossCount >= 10) {
            // Trigger win after 10 losses
            isGameOver = true;
            showWinningScreen();
            return;
        }
        return;
    }

    if (score >= 5) { // Winning score is now 5
        isGameOver = true;
        showWinningScreen();
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
