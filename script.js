let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess() {
    const userGuess = parseInt(document.getElementById('guess').value);
    const messageElement = document.getElementById('message');
    attempts++;

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        messageElement.textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }

    if (userGuess === secretNumber) {
        messageElement.textContent = 'Congratulations! You guessed the number. You won x3 of your amount.';
        setTimeout(resetGame, 3000);  // Reset the game after 3 seconds
    } else if (userGuess < secretNumber) {
        messageElement.textContent = 'Too low! Try again.';
    } else {
        messageElement.textContent = 'Too high! Try again.';
    }
}

function resetGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('guess').value = '';
    document.getElementById('message').textContent = '';
}

document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
});
