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
  circle.style.display = "none";
  document.getElementById("colorName").style.display = "none";
  document.getElementById("buttons").style.display = "none";
  
  const playButton = document.createElement("button");
  playButton.id = "playButton";
  playButton.className = "game-btn";
  playButton.innerHTML = '<span class="btn-effect"></span><span class="btn-text">PLAY GAME</span>';
  playButton.style.fontSize = "24px";
  playButton.style.padding = "15px 30px";
  playButton.style.marginTop = "30px";
  
  playButton.addEventListener("click", function() {
    circle.style.display = "block";
    document.getElementById("colorName").style.display = "block";
    document.getElementById("buttons").style.display = "flex";
    playButton.remove();
    startGame();
  });
  
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
  
  difficultyButtons.forEach(btn => {
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";
  });
  
  nextRound();
  // Removed startButtonsMovement() since we want static buttons
  
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

// Set difficulty (only updates speed, no movement)
function setDifficulty(level) {
  difficulty = level;
  
  switch (level) {
    case 'easy':
      movementSpeed = 2000; // Not used for movement now
      break;
    case 'medium':
      movementSpeed = 1500;
      break;
    case 'hard':
      movementSpeed = 1000;
      break;
  }
  
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
  
  body.classList.remove('disco-mode', 'retro-mode');
  document.getElementById('game').classList.remove('retro-mode');
  
  switch (mode) {
    case 'disco':
      body.classList.add('disco-mode');
      break;
    case 'retro':
      body.classList.add('retro-mode');
      document.getElementById('game').classList.add('retro-mode');
      break;
    default:
      break;
  }
  
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
  resultDisplay.textContent = ""; // Clear result text each round

  const circleColor = colors[Math.floor(Math.random() * colors.length)];
  circle.style.backgroundColor = circleColor;

  circle.style.position = "relative";
  circle.style.left = "0px";
  circle.style.top = "0px";

  colors.forEach(color => {
    circle.classList.remove(`${color}-glow`);
  });

  circle.classList.add(`${circleColor}-glow`);

  const colorName = document.getElementById("colorName");
  let displayedColorName;
  do {
    displayedColorName = colors[Math.floor(Math.random() * colors.length)];
  } while (displayedColorName === circleColor);
  colorName.textContent = displayedColorName.toUpperCase();
  colorName.style.color = circleColor;

  let availableColors = [...colors];
  correctButton = Math.floor(Math.random() * 3);

  for (let i = 0; i < 3; i++) {
    buttons[i].style.background = "";
    buttons[i].style.color = "";

    let buttonTextColor;
    if (i === correctButton) {
      buttonTextColor = circleColor;
      buttons[i].dataset.correct = "true";
    } else {
      do {
        buttonTextColor = colors[Math.floor(Math.random() * colors.length)];
      } while (buttonTextColor === circleColor);
      buttons[i].dataset.correct = "false";
    }

    let buttonColorName;
    do {
      buttonColorName = colors[Math.floor(Math.random() * colors.length)];
    } while (buttonColorName === circleColor);
    buttons[i].querySelector('.btn-text').textContent = buttonColorName.toUpperCase();

    buttons[i].style.color = buttonTextColor;
    applyButtonStyle(buttons[i]);
  }
}

// Check player's tap
function checkAnswer(buttonIndex) {
  if (timeLeft <= 0 || !gameActive) return;
  
  if (buttons[buttonIndex].dataset.correct === "true") {
    score++;
    streak++;
    correctCount++;
    
    if (streak > highestStreak) {
      highestStreak = streak;
    }
    
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    correctCountDisplay.textContent = correctCount;
    
    resultDisplay.textContent = "Correct!";
    resultDisplay.style.color = "#00ff00";
    
    circle.classList.add("celebrate");
    setTimeout(() => {
      circle.classList.remove("celebrate");
      resultDisplay.textContent = ""; // Clear result after animation
    }, 500);
    
    nextRound();
  } else {
    wrongCount++;
    streak = 0;
    
    streakDisplay.textContent = streak;
    wrongCountDisplay.textContent = wrongCount;
    
    resultDisplay.textContent = "Wrong!";
    resultDisplay.style.color = "#ff0000";
    
    circle.classList.add("shake");
    setTimeout(() => {
      circle.classList.remove("shake");
      resultDisplay.textContent = ""; // Clear result after animation
    }, 500);
  }
  
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
    mode: "no-cors",
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
    mode: "cors"
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        rankingsBody.innerHTML = "";
        data.rankings.forEach(entry => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${entry.rank}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
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

  saveScore(playerName, playerEmail, playerScore);

  scoreForm.style.display = "none";
  viewRankingsButton.style.display = "block";
});

// Handle view rankings button
viewRankingsButton.addEventListener("click", showRankings);

// Handle difficulty buttons
difficultyButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    if (gameActive) return;
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
  score = 0;
  timeLeft = 60;
  streak = 0;
  correctCount = 0;
  wrongCount = 0;
  
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  streakDisplay.textContent = streak;
  correctCountDisplay.textContent = correctCount;
  wrongCountDisplay.textContent = wrongCount;
  accuracyDisplay.textContent = "0%";
  
  buttons.forEach(btn => {
    btn.style.position = "";
    btn.style.left = "";
    btn.style.top = "";
  });
  
  circle.style.position = "";
  circle.style.left = "";
  circle.style.top = "";
  
  difficultyButtons.forEach(btn => {
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
  });
  
  rankingsScreen.style.display = "none";
  endScreen.style.display = "none";
  scoreForm.style.display = "block";
  viewRankingsButton.style.display = "none";
  gameScreen.style.display = "block";
  
  buttons.forEach(btn => btn.disabled = false);
  
  createPlayButton();
});

// Initialize game
document.addEventListener("DOMContentLoaded", function() {
  setDifficulty('easy');
  createPlayButton();
});

// Updated applyButtonStyle to match the button appearance
function applyButtonStyle(button) {
  button.style.background = "linear-gradient(to right, #FF00FF, #00FFFF)";
  button.style.border = "none";
  button.style.borderRadius = "25px";
  button.style.padding = "10px 20px";
  button.style.fontSize = "18px";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.3)";
  button.style.cursor = "pointer";
}
