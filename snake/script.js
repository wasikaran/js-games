document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.querySelector('.score');
    const highScoreDisplay = document.querySelector('.high-score');
    const startBtn = document.querySelector('.start-btn');
    const restartBtn = document.querySelector('.restart-btn');
    const mobileControls = {
        up: document.querySelector('.up-btn'),
        down: document.querySelector('.down-btn'),
        left: document.querySelector('.left-btn'),
        right: document.querySelector('.right-btn')
    };
    
    // Game settings
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;
    
    // Game variables
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameSpeed = 150;
    let gameInterval;
    let gameRunning = false;
    
    // Initialize game
    const initGame = () => {
        snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        generateFood();
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        updateScore();
    };
    
    // Generate food at random position
    const generateFood = () => {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Make sure food doesn't appear on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                return generateFood();
            }
        }
    };
    
    // Update score display
    const updateScore = () => {
        scoreDisplay.textContent = `Score: ${score}`;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    };
    
    // Game loop
    const gameLoop = () => {
        if (!gameRunning) return;
        
        // Update snake direction
        direction = nextDirection;
        
        // Calculate new head position
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Check collision with walls
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check collision with self
        for (let segment of snake) {
            if (segment.x === head.x && segment.y === head.y) {
                gameOver();
                return;
            }
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            score++;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
            }
            updateScore();
            generateFood();
            
            // Increase speed every 5 points
            if (score % 5 === 0 && gameSpeed > 50) {
                gameSpeed -= 10;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
        
        // Draw everything
        drawGame();
    };
    
    // Draw game elements
    const drawGame = () => {
        // Clear canvas
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#076d0bff' : '#45a049';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
        
        // Draw food
        ctx.fillStyle = '#ff4757';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    };
    
    // Game over
    const gameOver = () => {
        gameRunning = false;
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
    };
    
    // Start game
    const startGame = () => {
        if (gameRunning) return;
        initGame();
        gameRunning = true;
        gameSpeed = 150;
        gameInterval = setInterval(gameLoop, gameSpeed);
        startBtn.textContent = 'Pause';
    };
    
    // Pause game
    const pauseGame = () => {
        gameRunning = false;
        clearInterval(gameInterval);
        startBtn.textContent = 'Resume';
    };
    
    // Toggle game state
    const toggleGame = () => {
        if (gameRunning) {
            pauseGame();
        } else {
            startGame();
        }
    };
    
    // Handle keyboard input
    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case ' ':
                toggleGame();
                break;
        }
    };
    
    // Event listeners
    startBtn.addEventListener('click', toggleGame);
    restartBtn.addEventListener('click', () => {
        clearInterval(gameInterval);
        initGame();
        gameRunning = true;
        gameInterval = setInterval(gameLoop, gameSpeed);
        startBtn.textContent = 'Pause';
    });
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Mobile controls
    mobileControls.up.addEventListener('click', () => {
        if (direction !== 'down') nextDirection = 'up';
    });
    mobileControls.down.addEventListener('click', () => {
        if (direction !== 'up') nextDirection = 'down';
    });
    mobileControls.left.addEventListener('click', () => {
        if (direction !== 'right') nextDirection = 'left';
    });
    mobileControls.right.addEventListener('click', () => {
        if (direction !== 'left') nextDirection = 'right';
    });
    
    // Initialize display
    updateScore();
    initGame();
    drawGame();
});