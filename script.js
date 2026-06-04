let questions = [];
let score = 0;
let currentIndex = 0;
let answeredCount = 0;

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const feedScreen = document.getElementById('feed-screen');
const resultScreen = document.getElementById('result-screen');
const cardFrame = document.getElementById('card-frame');
const scoreVal = document.getElementById('score-val');
const finalScore = document.getElementById('final-score');
const maxScore = document.getElementById('max-score');
const resultMsg = document.getElementById('result-msg');
// footer buttons removed; no DOM refs needed
const restartBtn = document.getElementById('restart-btn');
const answeredCountEl = document.getElementById('answered-count');
const totalCountEl = document.getElementById('total-count');
const pageTitle = document.getElementById('page-title');
const progressFill = document.getElementById('progress-fill');
const percentageEl = document.getElementById('percentage');

async function loadQuestions(){
  try{
    const res = await fetch('questions.json');
    const data = await res.json();
      questions = data.quiz.questions || [];
      totalCountEl.textContent = questions.length;
      // prepare and render first card
      currentIndex = 0;
      renderCard(currentIndex);
  }catch(e){
    feedEl.innerHTML = '<div class="card">Erro ao carregar perguntas.</div>';
    console.error(e);
  }
}

function startQuiz(){
  score = 0;
  scoreVal.textContent = score;
  answeredCountEl.textContent = 0;
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  feedScreen.classList.remove('hidden');
  pageTitle.classList.add('hidden');
  renderCard(currentIndex);
}

function renderCard(idx){
  cardFrame.innerHTML = '';
  if(!questions[idx]) return;
  const q = questions[idx];
  const card = document.createElement('article');
  card.className = 'card feed-card';
  card.dataset.idx = idx;

  const qText = document.createElement('h3');
  qText.className = 'feed-question';
  qText.textContent = q.question;

  const opts = document.createElement('div');
  opts.className = 'options';

  Object.entries(q.options || {}).forEach(([key, text]) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = key + '. ' + text;
    btn.dataset.key = key;
    btn.addEventListener('click', () => handleAnswer(card, q, btn));
    opts.appendChild(btn);
  });

  card.appendChild(qText);
  card.appendChild(opts);
  cardFrame.appendChild(card);
  // focus top
  window.scrollTo({top:0,behavior:'smooth'});
  // entrance animation
  requestAnimationFrame(()=> card.classList.add('visible'));
}

function handleAnswer(card, q, btn){
  if(card.classList.contains('answered')) return;
  const selected = btn.dataset.key;
  const correct = q.correctAnswer;
  // disable all options
  Array.from(card.querySelectorAll('.option')).forEach(b=>b.disabled=true);
  if(selected === correct){
    btn.classList.add('correct');
    score += 10;
    scoreVal.textContent = score;
  }else{
    btn.classList.add('wrong');
    const correctBtn = Array.from(card.querySelectorAll('.option')).find(b=>b.dataset.key===correct);
    if(correctBtn) correctBtn.classList.add('correct');
  }
  card.classList.add('answered');
  // update answered count
  answeredCount += 1;
  answeredCountEl.textContent = answeredCount;
  // auto advance after short delay
  setTimeout(() => {
    currentIndex++;
    if(currentIndex < questions.length){
      renderCard(currentIndex);
    } else {
      // all done -> show result
      showResult();
    }
  }, 600);
}

function showResult(){
  feedScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  pageTitle.classList.remove('hidden');
  finalScore.textContent = score;
  const maxPoints = questions.length * 10;
  maxScore.textContent = maxPoints;
  const pct = Math.round((score / maxPoints) * 100);
  
  // Animar a barra de progresso
  // Reset da animação
  progressFill.style.strokeDashoffset = '339.3';
  percentageEl.textContent = '0%';
  
  // Trigger animação
  setTimeout(() => {
    const offset = 339.3 - (339.3 * pct / 100);
    progressFill.style.strokeDashoffset = offset;
    percentageEl.textContent = pct + '%';
  }, 50);
  
  if(pct >= 80){
    resultMsg.textContent = 'Excelente! Você está no caminho certo. Continue buscando direção e propósito.';
  }else if(pct >= 50){
    resultMsg.textContent = 'Bom começo. Reflita sobre o que precisa ser guardado e amadurecido.';
  }else{
    resultMsg.textContent = 'Hora de colocar a casa em ordem — procure orientação e dedique-se ao secreto.';
  }
}

function resetQuiz(){
  // reset indexes and state
  score = 0;
  currentIndex = 0;
  scoreVal.textContent = score;
  answeredCountEl.textContent = 0;
  viewResultBtn.disabled = true;
  renderCard(currentIndex);
  startScreen.classList.remove('hidden');
  feedScreen.classList.add('hidden');
  pageTitle.classList.remove('hidden');
}

startBtn.addEventListener('click', startQuiz);
// footer buttons removed; only keep result and restart in result screen
restartBtn && restartBtn.addEventListener('click', () => location.reload());

// init
loadQuestions();
