// --- Личный кабинет ---
const nameForm = document.getElementById("nameForm");
const usernameInput = document.getElementById("username");
const saveNameBtn = document.getElementById("saveName");
const welcomePanel = document.getElementById("welcomePanel");

let username = localStorage.getItem("username");

function showWelcome() {
  if(username) {
    welcomePanel.textContent = `Привет, ${username}!`;
    nameForm.style.opacity = 0;
    setTimeout(()=>{ nameForm.style.display="none"; }, 500);
  } else {
    nameForm.style.display = "block";
    setTimeout(()=>{ nameForm.style.opacity=1; }, 50);
  }
}

saveNameBtn.onclick = () => {
  const val = usernameInput.value.trim();
  if(val) {
    username = val;
    localStorage.setItem("username", username);
    showWelcome();
    renderMatches();
    renderLeaderboard();
  }
}

showWelcome();

// --- Новости ---
const newsPanel = document.getElementById("newsPanel");
const newsData = [
  {text:"Спартак выиграл последний матч!", important:true},
  {text:"Трансферный рынок открыт."},
  {text:"Билеты на следующий матч распроданы!", important:true},
  {text:"Тренировка команды сегодня в 18:00."}
];

function renderNews() {
  newsPanel.innerHTML="";
  newsData.forEach(n=>{
    const div = document.createElement("div");
    div.textContent = n.text;
    div.className="news-item";
    if(n.important) div.classList.add("important");
    newsPanel.appendChild(div);
  });
}
renderNews();
setInterval(renderNews, 30000);

// --- Данные матчей ---
const matchesData = [
  {id:1, team1:"Спартак", team2:"ЦСКА"},
  {id:2, team1:"Зенит", team2:"Локомотив"},
  {id:3, team1:"Динамо", team2:"Краснодар"}
];

// --- Рендер матчей ---
function renderMatches() {
  const container = document.getElementById("matches");
  container.innerHTML = "";

  matchesData.forEach(match=>{
    const div = document.createElement("div");
    div.className="card match";
    div.innerHTML=`<div class="teams">${match.team1} — ${match.team2}</div>`;
    
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className="buttons";

    ["Победа первой команды","Ничья","Победа второй команды"].forEach(choice=>{
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.className = "btn";

      const savedChoice = localStorage.getItem(`match_${match.id}`);
      if(savedChoice) btn.disabled = true;
      if(savedChoice === choice) {
        btn.classList.add("selected");
        div.classList.add("selected");
      }

      btn.onclick = ()=>{
        if(!localStorage.getItem(`match_${match.id}`)) {
          localStorage.setItem(`match_${match.id}`, choice);
          buttonsDiv.querySelectorAll('button').forEach(b=>{
            b.disabled=true;
            if(b===btn) b.classList.add("selected");
          });
          div.classList.add("selected");
          updateLeaderboard(username);
        }
      }

      buttonsDiv.appendChild(btn);
    });

    div.appendChild(buttonsDiv);
    container.appendChild(div);
  });
}

if(username) renderMatches();

// --- Таблица лидеров ---
function getLeaderboard() {
  return JSON.parse(localStorage.getItem("leaderboard")||"{}");
}

function updateLeaderboard(name){
  const data = getLeaderboard();
  if(!data[name]) data[name]=0;
  data[name]+=1;
  localStorage.setItem("leaderboard", JSON.stringify(data));
  renderLeaderboard();
}

function renderLeaderboard(){
  const table = document.getElementById("leaderboard");
  table.innerHTML="<tr><th>Имя</th><th>Очки</th></tr>";
  const data = getLeaderboard();
  Object.keys(data).sort((a,b)=>data[b]-data[a]).forEach(name=>{
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${name}</td><td>${data[name]}</td>`;
    table.appendChild(tr);
  });
}

renderLeaderboard();

// --- Админка ---
const modal = document.createElement("div");
modal.id="adminModal";
modal.style.display="none";
modal.innerHTML=`<div class="card" style="text-align:center; max-width:300px; animation:cardGlow 1.6s infinite;">
<h3>Админ панель</h3>
<input type="password" id="adminPass" placeholder="Пароль" style="width:80%; padding:8px; margin:10px 0;">
<button id="loginAdmin" class="btn" style="margin-bottom:10px;">Войти</button>
<div id="adminControls" style="display:none;">
  <button id="resetMatches" class="btn" style="margin-bottom:8px;">Сброс всех прогнозов</button>
  <button id="resetLeaderboard" class="btn">Сброс таблицы лидеров</button>
</div>
</div>`;
document.body.appendChild(modal);

const openAdmin = document.getElementById("openAdmin");
openAdmin.onclick = ()=>modal.style.display="flex";

modal.onclick = e => { if(e.target===modal) modal.style.display="none"; };

document.getElementById("loginAdmin").onclick = ()=>{
  const pass = document.getElementById("adminPass").value;
  if(pass==="admin123"){
    document.getElementById("adminControls").style.display="block";
    modal.querySelector("h3").textContent="Вы вошли как админ ✅";
    alert("Вы вошли как админ. Теперь можете сбросить прогнозы и таблицу лидеров через кнопки ниже.");
  } else {
    alert("Неверный пароль");
  }
}

// --- Кнопки админа ---
document.getElementById("resetMatches").onclick = ()=>{
  Object.keys(localStorage).forEach(k=>{
    if(k.startsWith("match_")) localStorage.removeItem(k);
  });
  renderMatches();
  alert("Все прогнозы сброшены!");
}

document.getElementById("resetLeaderboard").onclick = ()=>{
  localStorage.removeItem("leaderboard");
  renderLeaderboard();
  alert("Таблица лидеров сброшена!");
}
