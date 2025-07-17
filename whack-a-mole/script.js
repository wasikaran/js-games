
document.addEventListener('DOMContentLoaded', () => {
    const holes = document.querySelectorAll('.hole');
    const moles = document.querySelectorAll('.mole');
    const scoreDisplay = document.querySelector('.score');
    const timeDisplay = document.querySelector('.time');
    const startBtn = document.querySelector('.start-btn');
    
    let score = 0;
    let timeLeft = 30;
    let timer;
    let moleTimer;
    let gameActive = false;
    let lastHole = null;
    
    // Random time between min and max
    const randomTime = (min, max) => {
        return Math.round(Math.random() * (max - min) + min);
    };
    
    // Random hole from available holes
    const randomHole = () => {
        const index = Math.floor(Math.random() * holes.length);
        const hole = holes[index];
        
        // Prevent same hole twice in a row
        if (hole === lastHole) {
            return randomHole();
        }
        
        lastHole = hole;
        return hole;
    };
    
    // Make a mole appear
    const peep = () => {
        if (!gameActive) return;
        
        const time = randomTime(500, 1500);
        const hole = randomHole();
        const mole = hole.querySelector('.mole');
        
        mole.classList.add('up');
        
        setTimeout(() => {
            mole.classList.remove('up');
            if (gameActive) peep();
        }, time);
    };
    
    // Whack the mole
    const whack = (e) => {
        if (!e.isTrusted || !gameActive) return; // Prevent fake clicks
        
        const mole = e.target;
        if (!mole.classList.contains('up')) return;
        
        mole.classList.remove('up');
        mole.classList.add('whacked');
        setTimeout(() => mole.classList.remove('whacked'), 200);
        
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    };
    
    // Update timer
    const updateTimer = () => {
        timeLeft--;
        timeDisplay.textContent = `Time: ${timeLeft}`;
        
        if (timeLeft <= 0) {
            endGame();
        }
    };
    
    // Start game
    const startGame = () => {
        if (gameActive) return;
        
        score = 0;
        timeLeft = 30;
        gameActive = true;
        
        scoreDisplay.textContent = `Score: ${score}`;
        timeDisplay.textContent = `Time: ${timeLeft}`;
        startBtn.textContent = 'Playing...';
        startBtn.disabled = true;
        
        // Start timers
        timer = setInterval(updateTimer, 1000);
        peep();
        
        // Auto-end after time runs out
        setTimeout(() => {
            if (gameActive) endGame();
        }, 30000);
    };
    
    // End game
    const endGame = () => {
        gameActive = false;
        clearInterval(timer);
        startBtn.textContent = 'Start Game';
        startBtn.disabled = false;
        
        // Hide all moles
        moles.forEach(mole => mole.classList.remove('up'));
        
        alert(`Game Over! Your score: ${score}`);
    };
    
    // Event listeners
    moles.forEach(mole => mole.addEventListener('click', whack));
    startBtn.addEventListener('click', startGame);
});