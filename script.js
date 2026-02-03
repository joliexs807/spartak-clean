const nameForm = document.getElementById("nameForm");
const usernameInput = document.getElementById("username");
const saveNameBtn = document.getElementById("saveName");
const welcomePanel = document.getElementById("welcomePanel");

let username = localStorage.getItem("username");

function showWelcome() {
  if(username) {
    welcomePanel.textContent = `Привет, ${username}!`;
    nameForm.style.opacity = 0;
    setTimeout(() => { nameForm.style.display = "none"; }, 500);
  } else {
    nameForm.style.display = "block";
    setTimeout(()=>{ nameForm.style.opacity = 1; }, 50);
  }
}

saveNameBtn.onclick = () => {
  const val = usernameInput.value.trim();
  if(val) {
    username = val;
    localStorage.setItem("username", username);
    showWelcome();
  }
}

showWelcome();

// Держим кнопки матча как в старом коде
const buttons = document.querySelectorAll('.match .btn');
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.disabled = true);
    btn.style.opacity = '1';
  });
});
