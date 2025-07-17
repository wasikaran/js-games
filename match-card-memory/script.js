document.addEventListener('DOMContentLoaded', () => {
    const cardGrid = document.getElementById('card-grid');
    const movesDisplay = document.querySelector('.moves');
    const timerDisplay = document.querySelector('.timer');
    const matchesDisplay = document.querySelector('.matches');
    const startBtn = document.querySelector('.start-btn');
    
    // Card symbols (2 of each for matching pairs)
    const symbols = ['🍎', '🍌', '🍒', '🍓', '🍊', '🍋', '🍐', '🍉'];
    let cards = [...symbols, ...symbols];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = 0;
    let timerInterval;
    let gameStarted = false;
    
    // Shuffle cards using Fisher-Yates algorithm
    const shuffleCards = () => {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    };
    
    // Create card element
    const createCard = (symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = symbol;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        return card;
    };
    
    // Initialize game board
    const initGame = () => {
        cardGrid.innerHTML = '';
        shuffleCards();
        
        cards.forEach((symbol, index) => {
            const card = createCard(symbol, index);
            card.addEventListener('click', flipCard);
            cardGrid.appendChild(card);
        });
        
        moves = 0;
        matchedPairs = 0;
        timer = 0;
        flippedCards = [];
        gameStarted = false;
        
        movesDisplay.textContent = `Moves: ${moves}`;
        matchesDisplay.textContent = `Matches: ${matchedPairs}/${symbols.length}`;
        timerDisplay.textContent = `Time: ${timer}s`;
        
        clearInterval(timerInterval);
        startBtn.textContent = 'Start Game';
    };
    
    // Flip card
    const flipCard = (e) => {
        if (!gameStarted) {
            startGame();
        }
        
        const selectedCard = e.currentTarget;
        
        // Don't allow flipping if:
        // - Card is already flipped
        // - Two cards are already flipped
        // - Card is already matched
        if (
            selectedCard.classList.contains('flipped') ||
            flippedCards.length === 2 ||
            selectedCard.classList.contains('matched')
        ) {
            return;
        }
        
        selectedCard.classList.add('flipped');
        flippedCards.push(selectedCard);
        
        // Check for match when two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `Moves: ${moves}`;
            
            const [firstCard, secondCard] = flippedCards;
            const firstSymbol = cards[firstCard.dataset.index];
            const secondSymbol = cards[secondCard.dataset.index];
            
            if (firstSymbol === secondSymbol) {
                // Match found
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                matchedPairs++;
                matchesDisplay.textContent = `Matches: ${matchedPairs}/${symbols.length}`;
                flippedCards = [];
                
                // Check if all pairs matched
                if (matchedPairs === symbols.length) {
                    endGame();
                }
            } else {
                // No match - flip cards back after delay
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }
    };
    
    // Start game timer
    const startGame = () => {
        gameStarted = true;
        startBtn.textContent = 'Restart Game';
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `Time: ${timer}s`;
        }, 1000);
    };
    
    // End game
    const endGame = () => {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`Congratulations! You won in ${moves} moves and ${timer} seconds!`);
        }, 500);
    };
    
    // Event listeners
    startBtn.addEventListener('click', initGame);
    
    // Initialize game on load
    initGame();
});