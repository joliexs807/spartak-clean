const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.disabled = true);
    btn.style.opacity = '1';
  });
});
