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

      if(localStorage.getItem(`match_${match.id}`)) btn.disabled = true;
      if(localStorage.getItem(`match_${match.id}`) === choice) btn.classList.add("selected");

      btn.onclick = ()=>{
        if(!localStorage.getItem(`match_${match.id}`)) {
          localStorage.setItem(`match_${match.id}`, choice);
          buttonsDiv.querySelectorAll('button').forEach(b=>{
            b.disabled=true;
            if(b===btn) b.classList.add("selected");
          });
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
modal.innerHTML=`<div class="card">
<h3>Админ вход</h3>
<input type="password" id="adminPass" placeholder="Пароль">
<button id="loginAdmin" class="btn">Войти</button>
</div>`;
document.body.appendChild(modal);

document.getElementById("openAdmin").onclick=()=>modal.style.display="flex";
modal.onclick=e=>{if(e.target===modal) modal.style.display="none";};

document.getElementById("loginAdmin").onclick=()=>{
  const pass=document.getElementById("adminPass").value;
  if(pass==="admin123"){
    localStorage.setItem("isAdmin","true");
    alert("Вы вошли как админ. Для сброса всех прогнозов используйте DevTools → localStorage → удалить ключи match_ и leaderboard");
    modal.style.display="none";
  } else alert("Неверный пароль");
};
