let score = 0;
let timeLeft = 60;
let correctButton;
let gameActive = false;
let streak = 0;
let highestStreak = 0;
let correctCount = 0;
let wrongCount = 0;
let difficulty = 'easy';
let moveInterval;
let movementSpeed = 2000; // Default speed (easy)

const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
const buttons = [document.getElementById("btn1"), document.getElementById("btn2"), document.getElementById("btn3")];
const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const resultDisplay = document.getElementById("result");
const gameScreen = document.getElementById("game");
const endScreen = document.getElementById("endScreen");
const finalScoreDisplay = document.getElementById("finalScore");
const scoreForm = document.getElementById("scoreForm");
const viewRankingsButton = document.getElementById("viewRankings");
const rankingsScreen = document.getElementById("rankings");
const rankingsBody = document.getElementById("rankingsBody");
const playAgainButton = document.getElementById("playAgain");
const streakDisplay = document.getElementById("streak");
const correctCountDisplay = document.getElementById("correctCount");
const wrongCountDisplay = document.getElementById("wrongCount");
const accuracyDisplay = document.getElementById("accuracy");
const highestStreakDisplay = document.getElementById("highestStreak");
const totalCorrectDisplay = document.getElementById("totalCorrect");
const totalWrongDisplay = document.getElementById("totalWrong");
const difficultyButtons = document.querySelectorAll(".difficulty-button");
const modeButtons = document.querySelectorAll(".mode-btn");

// Replace with your Google Apps Script Web App URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzcvxRIQ3Lf4e7iKxSBJohXnhOIjQ0AsK79zJr0Oe_IsALemCu72R6VEqzYjWFanl4Z/exec";

// Create play button
function createPlayButton() {
  // Hide the circle and color name initially
  circle.style.display = "none";
  document.getElementById("colorName").style.display = "none";
  document.getElementById("buttons").style.display = "none";
  
  // Create play button
  const playButton = document.createElement("button");
  playButton.id = "playButton";
  playButton.className = "game-btn";
  playButton.innerHTML = '<span class="btn-effect"></span><span class="btn-text">PLAY GAME</span>';
  playButton.style.fontSize = "24px";
  playButton.style.padding = "15px 30px";
  playButton.style.marginTop = "30px";
  
  // Add event listener to play button
  playButton.addEventListener("click", function() {
    // Show the game elements
    circle.style.display = "block";
    document.getElementById("colorName").style.display = "block";
    document.getElementById("buttons").style.display = "flex";
    
    // Remove play button
    playButton.remove();
    
    // Start the game
    startGame();
  });
  
  // Add the play button after the difficulty selector
  const difficultySelector = document.querySelector(".difficulty-selector");
  difficultySelector.after(playButton);
}

// Start the game
function startGame() {
  gameActive = true;
  score = 0;
  streak = 0;
  correctCount = 0;
  wrongCount = 0;
  scoreDisplay.textContent = score;
  streakDisplay.textContent = streak;
  correctCountDisplay.textContent = correctCount;
  wrongCountDisplay.textContent = wrongCount;
  accuracyDisplay.textContent = "0%";
  
  // Disable difficulty buttons
  difficultyButtons.forEach(btn => {
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";
  });
  
  nextRound();
  startButtonsMovement();
  
  const timer = setInterval(() => {
    if (!gameActive) {
      clearInterval(timer);
      return;
    }
    
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// Start buttons movement based on difficulty
function startButtonsMovement() {
  if (moveInterval) {
    clearInterval(moveInterval);
  }
  
  // Set initial positions for buttons
  const buttonsContainer = document.getElementById("buttons");
  buttonsContainer.style.position = "relative";
  
  buttons.forEach(btn => {
    btn.style.position = "relative";
    btn.style.left = "0px";
    btn.style.top = "0px";
    btn.style.transition = "all 0.5s ease-in-out";
  });
  
  moveInterval = setInterval(() => {
    if (!gameActive) return;
    
    // Get the buttons container dimensions
    const gameContainer = document.getElementById("game");
    const gameRect = gameContainer.getBoundingClientRect();
    const buttonsContainer = document.getElementById("buttons");
    const containerRect = buttonsContainer.getBoundingClientRect();
    
    // Calculate available space for movement within container
    const maxX = 100; // max pixels to move left/right
    const maxY = 30;  // max pixels to move up/down
    
    // Move each button to a random position
    buttons.forEach(btn => {
      const randomX = Math.floor(Math.random() * maxX * 2) - maxX;
      const randomY = Math.floor(Math.random() * maxY * 2) - maxY;
      
      btn.style.left = `${randomX}px`;
      btn.style.top = `${randomY}px`;
    });
    
    // Randomize the order of buttons
    const buttonsArray = Array.from(buttons);
    buttonsArray.sort(() => Math.random() - 0.5);
    
    // Rearrange buttons in DOM
    buttonsContainer.innerHTML = '';
    buttonsArray.forEach(btn => {
      buttonsContainer.appendChild(btn);
    });
    
  }, movementSpeed);
}

// Set difficulty
function setDifficulty(level) {
  difficulty = level;
  
  // Update movement speed based on difficulty
  switch (level) {
    case 'easy':
      movementSpeed = 2000; // 2 seconds
      break;
    case 'medium':
      movementSpeed = 1500; // 1.5 seconds
      break;
    case 'hard':
      movementSpeed = 1000; // 1 second
      break;
  }
  
  // Update active class on buttons
  difficultyButtons.forEach(btn => {
    if (btn.dataset.difficulty === level) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Set game mode
function setGameMode(mode) {
  const body = document.body;
  
  // Remove all mode classes
  body.classList.remove('disco-mode', 'retro-mode');
  document.getElementById('game').classList.remove('retro-mode');
  
  // Apply selected mode
  switch (mode) {
    case 'disco':
      body.classList.add('disco-mode');
      break;
    case 'retro':
      body.classList.add('retro-mode');
      document.getElementById('game').classList.add('retro-mode');
      break;
    default:
      // Default mode requires no additional classes
      break;
  }
  
  // Update active class on buttons
  modeButtons.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Show a new round
function nextRound() {
  resultDisplay.textContent = "";

  // Choose a random color for the circle
  const circleColor = colors[Math.floor(Math.random() * colors.length)];
  circle.style.backgroundColor = circleColor;

  // Reset circle position to center
  circle.style.position = "relative";
  circle.style.left = "0px";
  circle.style.top = "0px";

  // Remove previous glow classes
  colors.forEach(color => {
    circle.classList.remove(`${color}-glow`);
  });

  // Add current color glow
  circle.classList.add(`${circleColor}-glow`);

  // Update the color name - deliberately choose a different color name
  const colorName = document.getElementById("colorName");
  let displayedColorName;
  do {
    displayedColorName = colors[Math.floor(Math.random() * colors.length)];
  } while (displayedColorName === circleColor); // Make sure it's different from the circle color
  colorName.textContent = displayedColorName.toUpperCase();
  colorName.style.color = circleColor; // Keep the text in the same color as the circle

  // Get all available colors for the buttons
  let availableColors = [...colors];

  // Choose which button will be the correct one (matching the circle's color with text color)
  correctButton = Math.floor(Math.random() * 3);

  // Set up buttons
  for (let i = 0; i < 3; i++) {
    // Reset button styling
    buttons[i].style.background = "";
    buttons[i].style.color = ""; // Reset text color

    let buttonTextColor;
    if (i === correctButton) {
      // This is the correct button - set its text color to match the circle's color
      buttonTextColor = circleColor;
      buttons[i].dataset.correct = "true";
    } else {
      // For other buttons, choose a random text color different from the circle's color
      do {
        buttonTextColor = colors[Math.floor(Math.random() * colors.length)];
      } while (buttonTextColor === circleColor);
      buttons[i].dataset.correct = "false";
    }

    // Set a random color name for the button text
    let buttonColorName;
    do {
      buttonColorName = colors[Math.floor(Math.random() * colors.length)];
    } while (buttonColorName === circleColor); // Ensure it's different from circle color for variety
    buttons[i].querySelector('.btn-text').textContent = buttonColorName.toUpperCase();

    // Apply the determined text color to the button
    buttons[i].style.color = buttonTextColor;

    // Apply gradient styling to the button
    applyButtonStyle(buttons[i]);
  }
}

// Check player's tap
function checkAnswer(buttonIndex) {
  if (timeLeft <= 0 || !gameActive) return;
  
  if (buttons[buttonIndex].dataset.correct === "true") {
    // Correct answer
    score++;
    streak++;
    correctCount++;
    
    // Update highest streak
    if (streak > highestStreak) {
      highestStreak = streak;
    }
    
    // Update displays
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    correctCountDisplay.textContent = correctCount;
    
    // Show correct feedback
    resultDisplay.textContent = "Correct!";
    resultDisplay.style.color = "#00ff00";
    
    // Add celebration effect
    circle.classList.add("celebrate");
    setTimeout(() => {
      circle.classList.remove("celebrate");
    }, 500);
    
    nextRound();
  } else {
    // Wrong answer
    wrongCount++;
    streak = 0;
    
    // Update displays
    streakDisplay.textContent = streak;
    wrongCountDisplay.textContent = wrongCount;
    
    // Show wrong feedback
    resultDisplay.textContent = "Wrong!";
    resultDisplay.style.color = "#ff0000";
    
    // Add shake effect
    circle.classList.add("shake");
    setTimeout(() => {
      circle.classList.remove("shake");
    }, 500);
  }
  
  // Update accuracy
  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
  accuracyDisplay.textContent = `${accuracy}%`;
}

// End the game
function endGame() {
  gameActive = false;
  
  if (moveInterval) {
    clearInterval(moveInterval);
  }
  
  circle.style.backgroundColor = "";
  buttons.forEach(btn => btn.disabled = true);
  
  // Update end screen stats
  finalScoreDisplay.textContent = score;
  highestStreakDisplay.textContent = highestStreak;
  totalCorrectDisplay.textContent = correctCount;
  totalWrongDisplay.textContent = wrongCount;
  
  gameScreen.style.display = "none";
  endScreen.style.display = "block";
}

// Save score to Google Sheets
function saveScore(name, email, score) {
  const data = { name, email, score };
  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors", // Required for CodePen due to CORS restrictions
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(() => {
      console.log("Score saved successfully");
    })
    .catch(error => {
      console.error("Error saving score:", error);
    });
}

// Show rankings
function showRankings() {
  fetch(WEB_APP_URL, {
    method: "GET",
    mode: "cors" // Adjust based on your setup
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        rankingsBody.innerHTML = ""; // Clear previous rankings
        data.rankings.forEach(entry => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${entry.rank}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td> <!-- Removed email column -->
          `;
          rankingsBody.appendChild(row);
        });
        viewRankingsButton.style.display = "none";
        rankingsScreen.style.display = "block";
      } else {
        console.error("Error fetching rankings:", data.message);
      }
    })
    .catch(error => {
      console.error("Error fetching rankings:", error);
    });
}

// Handle form submission
scoreForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const playerName = document.getElementById("playerName").value;
  const playerEmail = document.getElementById("playerEmail").value;
  const playerScore = score;

  // Save the score to Google Sheets
  saveScore(playerName, playerEmail, playerScore);

  // Show the "View Rankings" button
  scoreForm.style.display = "none";
  viewRankingsButton.style.display = "block";
});

// Handle view rankings button
viewRankingsButton.addEventListener("click", showRankings);

// Handle difficulty buttons
difficultyButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    if (gameActive) return; // Don't change difficulty during game
    setDifficulty(this.dataset.difficulty);
  });
});

// Handle mode buttons
modeButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    setGameMode(this.dataset.mode);
  });
});

// Handle play again
playAgainButton.addEventListener("click", function() {
  // Reset game state
  score = 0;
  timeLeft = 60;
  streak = 0;
  correctCount = 0;
  wrongCount = 0;
  
  // Update displays
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  streakDisplay.textContent = streak;
  correctCountDisplay.textContent = correctCount;
  wrongCountDisplay.textContent = wrongCount;
  accuracyDisplay.textContent = "0%";
  
  // Reset button positions
  buttons.forEach(btn => {
    btn.style.position = "";
    btn.style.left = "";
    btn.style.top = "";
  });
  
  // Reset circle position
  circle.style.position = "";
  circle.style.left = "";
  circle.style.top = "";
  
  // Enable difficulty buttons
  difficultyButtons.forEach(btn => {
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
  });
  
  // Reset game screens
  rankingsScreen.style.display = "none";
  endScreen.style.display = "none";
  scoreForm.style.display = "block";
  viewRankingsButton.style.display = "none";
  gameScreen.style.display = "block";
  
  // Re-enable game buttons
  buttons.forEach(btn => btn.disabled = false);
  
  // Show play button instead of starting game immediately
  createPlayButton();
});

// Initialize game
document.addEventListener("DOMContentLoaded", function() {
  // Set initial difficulty
  setDifficulty('easy');
  
  // Create play button to start the game
  createPlayButton();
});

// Updated applyButtonStyle to match the button appearance in the image
function applyButtonStyle(button) {
  // Apply the same gradient background to all buttons (purple to cyan)
  button.style.background = "linear-gradient(to right, #FF00FF, #00FFFF)";

  // Additional styling to match the rounded shape and glow
  button.style.border = "none";
  button.style.borderRadius = "25px";
  button.style.padding = "10px 20px";
  button.style.fontSize = "18px";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.3)";
  button.style.cursor = "pointer";
}