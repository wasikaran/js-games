document.addEventListener('DOMContentLoaded', () => {
    const choiceBtns = document.querySelectorAll('.choice-btn');
    const playerChoiceIcon = document.querySelector('.player-choice .choice-icon');
    const computerChoiceIcon = document.querySelector('.computer-choice .choice-icon');
    const outcomeDisplay = document.querySelector('.outcome');
    const playerScoreDisplay = document.querySelector('.player-score');
    const computerScoreDisplay = document.querySelector('.computer-score');
    const resetBtn = document.querySelector('.reset-btn');
    
    let playerScore = 0;
    let computerScore = 0;
    let gameOver = false;
    
    // Game choices
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };
    
    // Computer makes random choice
    const computerPlay = () => {
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    };
    
    // Determine winner
    const playRound = (playerSelection, computerSelection) => {
        if (playerSelection === computerSelection) {
            return 'draw';
        }
        
        if (
            (playerSelection === 'rock' && computerSelection === 'scissors') ||
            (playerSelection === 'paper' && computerSelection === 'rock') ||
            (playerSelection === 'scissors' && computerSelection === 'paper')
        ) {
            return 'player';
        } else {
            return 'computer';
        }
    };
    
    // Update UI with choices and result
    const updateGame = (playerChoice, computerChoice, result) => {
        playerChoiceIcon.textContent = emojis[playerChoice];
        computerChoiceIcon.textContent = emojis[computerChoice];
        
        // Remove winner animation from previous round
        playerChoiceIcon.classList.remove('winner');
        computerChoiceIcon.classList.remove('winner');
        
        switch (result) {
            case 'player':
                playerScore++;
                outcomeDisplay.textContent = `You win! ${playerChoice} beats ${computerChoice}`;
                playerChoiceIcon.classList.add('winner');
                break;
            case 'computer':
                computerScore++;
                outcomeDisplay.textContent = `You lose! ${computerChoice} beats ${playerChoice}`;
                computerChoiceIcon.classList.add('winner');
                break;
            case 'draw':
                outcomeDisplay.textContent = `It's a draw! Both chose ${playerChoice}`;
                break;
        }
        
        playerScoreDisplay.textContent = `You: ${playerScore}`;
        computerScoreDisplay.textContent = `Computer: ${computerScore}`;
        
        // Check for game over (first to 5 wins)
        if (playerScore >= 5 || computerScore >= 5) {
            gameOver = true;
            const winner = playerScore >= 5 ? 'You' : 'Computer';
            outcomeDisplay.textContent = `Game Over! ${winner} wins the game!`;
            choiceBtns.forEach(btn => btn.disabled = true);
        }
    };
    
    // Handle player choice
    const handlePlayerChoice = (e) => {
        if (gameOver) return;
        
        const playerChoice = e.target.dataset.choice;
        const computerChoice = computerPlay();
        const result = playRound(playerChoice, computerChoice);
        
        updateGame(playerChoice, computerChoice, result);
    };
    
    // Reset game
    const resetGame = () => {
        playerScore = 0;
        computerScore = 0;
        gameOver = false;
        
        playerChoiceIcon.textContent = '?';
        computerChoiceIcon.textContent = '?';
        outcomeDisplay.textContent = 'Choose your move!';
        playerScoreDisplay.textContent = `You: ${playerScore}`;
        computerScoreDisplay.textContent = `Computer: ${computerScore}`;
        
        choiceBtns.forEach(btn => btn.disabled = false);
        
        // Remove winner animation
        playerChoiceIcon.classList.remove('winner');
        computerChoiceIcon.classList.remove('winner');
    };
    
    // Event listeners
    choiceBtns.forEach(btn => {
        btn.addEventListener('click', handlePlayerChoice);
    });
    
    resetBtn.addEventListener('click', resetGame);
});