document.addEventListener('DOMContentLoaded', () => {
  // === tsParticles ===
  tsParticles.load("tsparticules", {
    fpsLimit: 60,
    particles: {
      number: { value: 40 },
      color: { value: "#06b6d4" },
      shape: { type: "circle" },
      opacity: { value: 0.12 },
      size: { value: { min: 1, max: 4 } },
      move: { enable: true, speed: 0.7, outModes: "bounce" },
      links: { enable: true, distance: 120, color: "#0ea5a4", opacity: 0.6, width: 1 }
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" } }
    },
    detectRetina: true
  });

  // === Estrelas e Parallax Hero ===
  const hero = document.querySelector('.hero');
  const heroContent = hero.querySelector('.hero-content');

  const starsContainer = document.createElement('div');
  starsContainer.className = 'stars';
  hero.appendChild(starsContainer);

  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDuration = (3 + Math.random() * 5) + 's';
    star.style.animationDelay = Math.random() * 5 + 's';
    starsContainer.appendChild(star);
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    hero.style.backgroundPositionY = -(scrollTop * 0.3) + 'px';
    heroContent.style.transform = 'translateY(' + (scrollTop * 0.2) + 'px)';
  });

  // === Jogo da Velha ===
  initTicTacToe();

  // === Apps e CEP ===
  window.showApp = showApp;
  window.BuscarCep = BuscarCep;

  // === Gráfico ===
  initChart();
});

// === Funções Separadas ===
function initTicTacToe() {
  const boardElement = document.getElementById('board');
  const statusElement = document.getElementById('status');
  let board = [['','',''],['','',''],['','','']];
  let gameOver = false;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', onCellClick);
    boardElement.appendChild(cell);
  }

  function onCellClick(e) {
    if (gameOver) return;
    const index = e.target.dataset.index;
    const row = Math.floor(index / 3);
    const col = index % 3;
    if (board[row][col] !== '') return;
    board[row][col] = 'X';
    e.target.textContent = 'X';
    e.target.classList.add('taken');
    if (checkWinner('X')) { endGame('Você venceu!'); return; }
    if (getEmptyCells().length === 0) { endGame('Empate!'); return; }
    setTimeout(machinePlay, 500);
  }

  function machinePlay() {
    const move = getBestMove();
    if (!move) return;
    const [row, col] = move;
    board[row][col] = 'O';
    const cellIndex = row*3+col;
    const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
    cell.textContent = 'O';
    cell.classList.add('taken');
    if (checkWinner('O')) { endGame('A máquina venceu!'); return; }
    if (getEmptyCells().length === 0) { endGame('Empate!'); return; }
  }

  function checkWinner(player) {
    for (let i=0;i<3;i++)
      if (board[i][0]===player && board[i][1]===player && board[i][2]===player) return true;
    for (let i=0;i<3;i++)
      if (board[0][i]===player && board[1][i]===player && board[2][i]===player) return true;
    if (board[0][0]===player && board[1][1]===player && board[2][2]===player) return true;
    if (board[0][2]===player && board[1][1]===player && board[2][0]===player) return true;
    return false;
  }

  function getEmptyCells() {
    const cells=[];
    for (let r=0;r<3;r++)
      for (let c=0;c<3;c++)
        if (board[r][c]==='') cells.push([r,c]);
    return cells;
  }

  function simulateMove(player,row,col){
    board[row][col]=player;
    const win=checkWinner(player);
    board[row][col]='';
    return win;
  }

  function getBestMove(){
    const empty=getEmptyCells();
    for(const [r,c] of empty) if(simulateMove('O',r,c)) return [r,c];
    for(const [r,c] of empty) if(simulateMove('X',r,c)) return [r,c];
    return empty.length>0?empty[Math.floor(Math.random()*empty.length)]:null;
  }

  function endGame(msg){
    statusElement.textContent=msg;
    gameOver=true;
  }

  document.getElementById('resetBtn').addEventListener('click',()=>{
    board=[['','',''],['','',''],['','','']];
    gameOver=false;
    statusElement.textContent='';
    document.querySelectorAll('.cell').forEach(c=>{c.textContent='';c.classList.remove('taken');});
  });
}

// === Buscar CEP ===
async function BuscarCep(){
  const cep=document.getElementById('cep').value.trim();
  if(!cep) return alert('Digite um CEP');
  const res=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if(res.ok){
    const data=await res.json();
    if(data.erro) alert('CEP não encontrado');
    else{
      document.getElementById('logradouro').value=data.logradouro;
      document.getElementById('bairro').value=data.bairro;
      document.getElementById('cidade').value=data.localidade;
      document.getElementById('estado').value=data.uf;
    }
  }
}

// === Mostrar Apps ===
function showApp(app){
  document.querySelectorAll('.app-content').forEach(div=>{div.classList.remove('active');div.style.display='none';});
  const selected=document.getElementById(`app-${app}`);
  selected.classList.add('active'); selected.style.display='block';
}

// === Gráfico ===
function initChart(){
  const ctx=document.getElementById('languageChart').getContext('2d');
  const contributions={
    'JavaScript':{lines:1500,contributions:45,bestResult:98,icon:'🟨'},
    'Python':{lines:1200,contributions:38,bestResult:92,icon:'🐍'},
    'HTML':{lines:900,contributions:30,bestResult:90,icon:'🌐'},
    'CSS':{lines:700,contributions:25,bestResult:85,icon:'🎨'},
    'Java':{lines:500,contributions:18,bestResult:80,icon:'☕'}
  };
  const labels=Object.keys(contributions);
  const icons=labels.map(l=>contributions[l].icon);

  new Chart(ctx,{
    type:'bar',
    data:{
      labels:labels,
      datasets:[
        {label:'Linhas de Código',data:labels.map(l=>contributions[l].lines),backgroundColor:'rgba(0,255,234,0.8)',borderRadius:6},
        {label:'Contribuições',data:labels.map(l=>contributions[l].contributions),backgroundColor:'rgba(255,99,132,0.8)',borderRadius:6},
        {label:'Melhor Resultado',data:labels.map(l=>contributions[l].bestResult),backgroundColor:'rgba(54,162,235,0.8)',borderRadius:6}
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:true,
      plugins:{tooltip:{backgroundColor:'rgba(0,0,0,0.7)',titleColor:'#fff',bodyColor:'#fff'},legend:{labels:{color:'#fff'}}},
      scales:{
        y:{ticks:{color:'#fff'},grid:{color:'#444'}},
        x:{ticks:{color:'#fff',callback:(v,i)=>icons[i]+' '+labels[i],font:{size:12}},grid:{color:'#444'}}
      }
    }
  });
}
