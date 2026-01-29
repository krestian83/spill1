const COLORS = [
  "var(--yellow)",
  "var(--pink)",
  "var(--blue)",
  "var(--purple)",
  "var(--green)",
];

const stage = document.getElementById("stage");
const scoreLabel = document.getElementById("score");
const timeLabel = document.getElementById("time");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

let score = 0;
let timeRemaining = 30;
let bubbleTimer = null;
let countdownTimer = null;
let isPaused = false;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const updateScore = (value) => {
  score = value;
  scoreLabel.textContent = score.toString();
};

const updateTime = (value) => {
  timeRemaining = value;
  timeLabel.textContent = timeRemaining.toString();
};

const clearStage = () => {
  stage.innerHTML = "";
};

const createBubble = () => {
  if (isPaused) {
    return;
  }

  const bubble = document.createElement("button");
  bubble.type = "button";
  bubble.className = "bubble";

  const bubbleSize = stage.clientWidth < 500 ? 64 : 80;
  const maxX = stage.clientWidth - bubbleSize;
  const maxY = stage.clientHeight - bubbleSize;

  bubble.style.left = `${randomBetween(10, Math.max(10, maxX - 10))}px`;
  bubble.style.top = `${randomBetween(10, Math.max(10, maxY - 10))}px`;
  bubble.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
  bubble.textContent = "POP!";

  bubble.addEventListener("click", () => {
    bubble.remove();
    updateScore(score + 1);
  });

  stage.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 2600);
};

const startGame = () => {
  if (bubbleTimer || countdownTimer) {
    return;
  }

  isPaused = false;
  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;

  bubbleTimer = setInterval(createBubble, 700);
  countdownTimer = setInterval(() => {
    if (isPaused) {
      return;
    }

    updateTime(timeRemaining - 1);
    if (timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
};

const pauseGame = () => {
  if (!bubbleTimer && !countdownTimer) {
    return;
  }

  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "Resume" : "Pause";
};

const resetGame = () => {
  endGame();
  updateScore(0);
  updateTime(30);
  clearStage();
};

const endGame = () => {
  clearInterval(bubbleTimer);
  clearInterval(countdownTimer);
  bubbleTimer = null;
  countdownTimer = null;
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
  resetButton.disabled = false;
  isPaused = false;
};

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
resetButton.addEventListener("click", resetGame);

window.addEventListener("resize", () => {
  if (!bubbleTimer && !countdownTimer) {
    clearStage();
  }
});
