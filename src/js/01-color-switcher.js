const startBtn = document.querySelector('button[data-start]');
const stopBtn = document.querySelector('button[data-stop]');
stopBtn.disabled = true;
const body = document.querySelector('body');

let timerId = null;

startBtn.addEventListener('click', () => {
  timerId = setInterval(() => {
    const currentColor = getRandomHexColor();
    body.style.backgroundColor = currentColor;
  }, 1000);
  startBtn.setAttribute('disabled', true);
  stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
  clearInterval(timerId);
  startBtn.removeAttribute('disabled');
  stopBtn.disabled = true;
});

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
