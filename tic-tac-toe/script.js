document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');
    const gameContainer = document.getElementById('game-container');
    const playerForm = document.getElementById('player-form');
    const playerXName = document.getElementById('player-x-name');
    const playerOName = document.getElementById('player-o-name');
    const statusDisplay = document.getElementById('status');
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const restartBtn = document.querySelector('.restart-btn');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let playerNames = {
        X: 'Player X',
        O: 'Player O'
    };
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    // Handle form submission
    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        playerNames.X = document.getElementById('player-x').value || 'Player X';
        playerNames.O = document.getElementById('player-o').value || 'Player O';
        
        playerXName.textContent = playerNames.X;
        playerOName.textContent = playerNames.O;
        
        formContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        
        updateStatus();
    });
    
    // Update game status display
    const updateStatus = () => {
        statusDisplay.textContent = `${playerNames[currentPlayer]}'s turn (${currentPlayer})`;
    };
    
    // Handle cell click
    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell already filled or game not active, ignore click
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;
        
        // Update game state and UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        checkResult();
    };
    
    // Check if current player won or game is a draw
    const checkResult = () => {
        let roundWon = false;
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                highlightWinningCells([a, b, c]);
                break;
            }
        }
        
        // If won, update status and end game
        if (roundWon) {
            statusDisplay.textContent = `${playerNames[currentPlayer]} wins!`;
            gameActive = false;
            return;
        }
        
        // If no winner and board is full, it's a draw
        if (!gameState.includes('')) {
            statusDisplay.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }
        
        // If game continues, switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    };
    
    // Highlight winning cells with animation
    const highlightWinningCells = (cells) => {
        cells.forEach(index => {
            document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
        });
    };
    
    // Restart game
    const restartGame = () => {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        updateStatus();
    };
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    restartBtn.addEventListener('click', restartGame);
    
    // Initialize status display
    updateStatus();
});