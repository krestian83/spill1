const elements = {
  first: document.getElementById("first"),
  second: document.getElementById("second"),
  operator: document.getElementById("operator"),
  answer: document.getElementById("answer"),
  check: document.getElementById("check"),
  feedback: document.getElementById("feedback"),
  score: document.getElementById("score"),
  streak: document.getElementById("streak"),
  stars: document.getElementById("stars"),
  tip: document.getElementById("tip"),
};

const state = {
  range: 10,
  operation: "add",
  score: 0,
  streak: 0,
  stars: 0,
  currentAnswer: 0,
};

const tips = [
  "Try counting on your fingers or jump along the number line.",
  "Break it into tens and ones to make it easier.",
  "Say the numbers out loud and count forward or backward.",
  "Use small objects like blocks or coins to help you see it.",
];

const updateStars = () => {
  const fullStars = "★ ".repeat(state.stars).trim();
  const emptyStars = "☆ ".repeat(5 - state.stars).trim();
  elements.stars.textContent = `${fullStars}${fullStars && emptyStars ? " " : ""}${emptyStars}`.trim();
};

const updateStats = () => {
  elements.score.textContent = state.score;
  elements.streak.textContent = state.streak;
  updateStars();
};

const randomNumber = (max) => Math.floor(Math.random() * (max + 1));

const pickOperation = () => {
  if (state.operation === "mix") {
    return Math.random() > 0.5 ? "add" : "subtract";
  }
  return state.operation;
};

const generateProblem = () => {
  const operation = pickOperation();
  let first = randomNumber(state.range);
  let second = randomNumber(state.range);

  if (operation === "subtract" && second > first) {
    [first, second] = [second, first];
  }

  state.currentAnswer = operation === "add" ? first + second : first - second;
  elements.first.textContent = first;
  elements.second.textContent = second;
  elements.operator.textContent = operation === "add" ? "+" : "−";
  elements.answer.value = "";
  elements.answer.focus();

  elements.tip.textContent = tips[Math.floor(Math.random() * tips.length)];
};

const celebrate = () => {
  elements.feedback.textContent = "Great job! You nailed it!";
  elements.feedback.classList.remove("error");
  elements.feedback.classList.add("success");
};

const encourage = () => {
  elements.feedback.textContent = "Almost! Try again or count carefully.";
  elements.feedback.classList.remove("success");
  elements.feedback.classList.add("error");
};

const checkAnswer = () => {
  const guess = Number(elements.answer.value);
  if (!Number.isFinite(guess)) {
    elements.feedback.textContent = "Type a number, then press Check.";
    elements.feedback.classList.remove("success", "error");
    return;
  }

  if (guess === state.currentAnswer) {
    state.score += 10;
    state.streak += 1;
    if (state.streak % 3 === 0) {
      state.stars = Math.min(state.stars + 1, 5);
    }
    celebrate();
    updateStats();
    setTimeout(generateProblem, 700);
  } else {
    state.streak = 0;
    state.stars = Math.max(state.stars - 1, 0);
    encourage();
    updateStats();
  }
};

const handleChoiceButtons = (buttons, onSelect) => {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      onSelect(button);
    });
  });
};

const levelButtons = Array.from(document.querySelectorAll("[data-range]"));
const operationButtons = Array.from(document.querySelectorAll("[data-operation]"));

handleChoiceButtons(levelButtons, (button) => {
  state.range = Number(button.dataset.range);
  generateProblem();
});

handleChoiceButtons(operationButtons, (button) => {
  state.operation = button.dataset.operation;
  generateProblem();
});

elements.check.addEventListener("click", checkAnswer);

elements.answer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

updateStats();

generateProblem();
