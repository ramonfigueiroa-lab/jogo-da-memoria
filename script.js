/* script.js - jogo da memoria modularizado */
const icons = [
  "https://i.imgur.com/xDZQ5dH.jpg",
  "https://i.imgur.com/9Pet8B3.jpg",
  "https://i.imgur.com/PDUWW9q.jpg",
  "https://i.imgur.com/pO3bFOn.jpg",
  "https://i.imgur.com/bwNt2Uv.jpg",
  "https://i.imgur.com/EYe3bmY.jpg",
  "https://i.imgur.com/OdzIlpf.jpg",
  "https://i.imgur.com/Qj50kbC.jpg"
];

const boardEl = document.getElementById('board');
const timeEl = document.getElementById('time');
const movesEl = document.getElementById('moves');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const rankTimeEl = document.getElementById('rank-time');
const rankMovesEl = document.getElementById('rank-moves');
const difficultySelect = document.getElementById('difficulty');

const modalBack = document.getElementById('modalBack');
const modalText = document.getElementById('modalText');
const playerNameInput = document.getElementById('playerName');
const saveBtn = document.getElementById('saveBtn');
const whichRank = document.getElementById('whichRank');

let first=null,second=null,lock=false;
let moves=0,seconds=0,timer=null,pairsFound=0;
let difficulty='3x4';

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function formatTime(s){const m=Math.floor(s/60);const sec=s%60;return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');}

function buildDeck(){
  if(difficulty==='3x4'){
    const chosen = icons.slice(0,6);
    return shuffle([...chosen,...chosen]); // 6 pairs = 12 cards
  }else{
    const chosen = icons.slice(0,8);
    return shuffle([...chosen,...chosen]); // 8 pairs = 16 cards
  }
}

function renderBoard(){
  boardEl.innerHTML='';
  const deck=buildDeck();
  boardEl.style.gridTemplateColumns = difficulty==='3x4' ? 'repeat(4,1fr)' : 'repeat(4,1fr)';
  deck.forEach((src)=>{
    const card=document.createElement('div');
    card.className='card';
    card.dataset.src=src;
    card.innerHTML=`
      <div class="inner">
        <div class="face front">?</div>
        <div class="face back"><img src="${src}" alt=""></div>
      </div>`;
    card.addEventListener('click',()=>onClick(card));
    boardEl.appendChild(card);
  });
  movesEl.textContent='0';
  timeEl.textContent='00:00';
}

function startTimer(){if(timer)return;timer=setInterval(()=>{seconds++;timeEl.textContent=formatTime(seconds);},1000);}
function stopTimer(){clearInterval(timer);timer=null;}

function onClick(card){
  if(lock || card.classList.contains('flipped'))return;
  if(seconds===0 && moves===0) startTimer();
  card.classList.add('flipped');
  if(!first){first=card;return;}
  second=card;lock=true;moves++;movesEl.textContent=moves;
  if(first.dataset.src===second.dataset.src){
    setTimeout(()=>{
      first.style.visibility='hidden';
      second.style.visibility='hidden';
      pairsFound++;
      reset();
      const totalPairs = difficulty==='3x4'?6:8;
      if(pairsFound===totalPairs) finishGame();
    },400);
  }else{
    setTimeout(()=>{
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      reset();
    },800);
  }
}
function reset(){first=null;second=null;lock=false;}

function finishGame(){
  stopTimer();
  modalText.textContent=`Você terminou em ${formatTime(seconds)} com ${moves} movimentos (${difficulty}).`;
  modalBack.classList.add('show');
  playerNameInput.focus();
}

function saveRanking(type,name,score){
  const key=(type==='time')?`ranking_time_${difficulty}`:`ranking_moves_${difficulty}`;
  const list=JSON.parse(localStorage.getItem(key))||[];
  list.push({name,score});
  list.sort((a,b)=>a.score-b.score);
  localStorage.setItem(key,JSON.stringify(list.slice(0,3)));
}

function renderRankings(){
  const tKey=`ranking_time_${difficulty}`;
  const mKey=`ranking_moves_${difficulty}`;
  const t=JSON.parse(localStorage.getItem(tKey))||[];
  const m=JSON.parse(localStorage.getItem(mKey))||[];
  rankTimeEl.innerHTML=''; rankMovesEl.innerHTML='';
  t.forEach((x,i)=>{
    const li=document.createElement('li');
    li.textContent=`${i+1}. ${x.name} — ${formatTime(x.score)}`;
    rankTimeEl.appendChild(li);
  });
  m.forEach((x,i)=>{
    const li=document.createElement('li');
    li.textContent=`${i+1}. ${x.name} — ${x.score} mov.`;
    rankMovesEl.appendChild(li);
  });
}

saveBtn.addEventListener('click',()=>{
  const name=playerNameInput.value.trim();
  if(!name){alert("Digite um nome!");playerNameInput.focus();return;}
  const choice=whichRank.value;
  if(choice==='both'||choice==='time')saveRanking('time',name,seconds);
  if(choice==='both'||choice==='moves')saveRanking('moves',name,moves);
  modalBack.classList.remove('show');
  renderRankings();
});

restartBtn.addEventListener('click',()=>restart());
startBtn.addEventListener('click',()=>{
  difficulty=difficultySelect.value;
  restart();
});

function restart(){
  stopTimer();seconds=0;moves=0;pairsFound=0;reset();renderBoard();renderRankings();
}

renderBoard();
renderRankings();
