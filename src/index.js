import './style.css';

const question = document.getElementById('question');
const options = document.querySelector('.quiz-options');
const correctScores = document.getElementById('correct-score');
const totalQn = document.getElementById('total-question');
const checkBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const results = document.getElementById('result');

let correctAnswer = '';
let correctScore = 0;
const totalQuestion = 15;
let askedCount = 0;

const eventListeners = () => {
  checkBtn.addEventListener('click', checkAnswer);
  playAgainBtn.addEventListener('click', restartQuiz);
};

document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
  eventListeners();
  totalQn.textContent = totalQuestion;
  correctScores.textContent = correctScore;
});

const loadQuestion = async () => {
  const APIUrl = 'https://opentdb.com/api.php?amount=1';
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  results.innerHTML = '';
  showQuestion(data.results[0]);
};

const selectOption = () => {
  options.querySelectorAll('li').forEach((option) => {
    option.addEventListener('click', () => {
      if (options.querySelector('.selected')) {
        const activeOption = options.querySelector('.selected');
        activeOption.classList.remove('selected');
      }

      option.classList.add('selected');
    });
  });
};

const showQuestion = (data) => {
  checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  const incorrectAnswer = data.incorrect_answers;
  const optionsList = incorrectAnswer;
  optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

  question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
  options.innerHTML = `
    ${optionsList.map((option) => `
      <li><span> ${option} </span></li>
    `).join('')}
  `;

  selectOption();
};

const checkAnswer = () => {
  checkBtn.disabled = true;

  if (options.querySelector('.selected')) {
    const selectedAnswer = options.querySelector('.selected span').textContent;

    if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
      correctScore += 1;
      results.innerHTML = `<p><i class='fas fa-check success'></i> Correct Answer!</p>`;
    } else {
      results.innerHTML = `<p><i class='fas fa-times fail'></i> Incorrect Answer!</p>`;
    }

    checkCount();
  } else {
    results.innerHTML = `<p><i class='fas fa-question'></i> Please select an option!</p>`;
    checkBtn.disabled = false;
  }
};

const HTMLDecode = (textString) => {
  const doc = new DOMParser().parseFromString(textString, 'text/html');
  return doc.documentElement.textContent;
};

const checkCount = () => {
  askedCount++;
  setCount();
  if(askedCount === totalQuestion) {
    results.innerHTML += `<p class="completed">Your score is ${correctScore}.</p>`;
    playAgainBtn.style.display = 'block';
    checkBtn.style.display = 'none';
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 500);
  }
};

const setCount = () => {
  totalQn.textContent = totalQuestion;
  correctScores.textContent = correctScore;
};

const restartQuiz = () => {
  correctScore = askedCount = 0;
  playAgainBtn.style.display = 'none';
  checkBtn.style.display = 'block';
  checkBtn.disabled = false;
  setCount();
  loadQuestion();
};