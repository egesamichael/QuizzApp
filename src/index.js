import './style.css';

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer = "", correctScore = 0, totalQuestion = 15;
let askedCount = 0;

const eventListeners = () => {
  _checkBtn.addEventListener('click', checkAnswer);
  _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

const loadQuestion = async () => {
  const APIUrl = 'https://opentdb.com/api.php?amount=1';
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  _result.innerHTML = "";
  showQuestion(data.results[0]);
}

const showQuestion = (data) => {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

  _question.innerHTML = `${data.question}`;
  _options.innerHTML = `
    ${optionsList.map((option, index) => `
      <li>${index + 1}. <span> ${option} </span></li>
    `).join('')}
  `;

  selectOption();
}

const selectOption = () => {
  _options.querySelectorAll('li').forEach((option) => {
    option.addEventListener('click', () => {
      if(_options.querySelector('.selected')) {
        const activeOption = _options.querySelector('.selected');
        activeOption.classList.remove('selected');
      }

      option.classList.add('selected');
    });
  });
}

const checkAnswer = () => {
  _checkBtn.disabled = true;

  if(_options.querySelector('.selected')) {
    let selectedAnswer = _options.querySelector('.selected span').textContent;
    
    if(selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = `<p><i class="fas fa-check success"></i> Correct Answer!</p>`;
    } else {
      _result.innerHTML = `<p><i class="fas fa-times fail"></i> Incorrect Answer!</p>`;
    }

    checkCount();
  } else {
    _result.innerHTML = `<p><i class="fas fa-question"></i> Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
}

function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

const checkCount = () => {
  askedCount++;
  setCount();
  if(askedCount == totalQuestion) {
    _result.innerHTML += `<p class="completed">Your score is ${correctScore}.</p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 500);
  }
}

const setCount = () => {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

const restartQuiz = () => {
  correctScore = askedCount = 0;
  _playAgainBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}