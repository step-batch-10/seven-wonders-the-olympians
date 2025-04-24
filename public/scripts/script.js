const text = "Welcome to 7 wonders...";
const speed = 70;
let i = 0;

const typeWriter = () => {
  if (i < text.length) {
    document.getElementById("typewriter").textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
};

document.addEventListener("DOMContentLoaded", typeWriter);

const closePop = () => {
  const sound = new Audio("audio/close-options.mp4");
  sound.currentTime = 0;
  sound.play();
  const pop = document.querySelector(".popUpWindow");
  pop.style.transform = "scale(0)";
};

const popOut = () => {
  const sound = new Audio("audio/options.mp4");
  sound.currentTime = 0;
  sound.play();
  const pop = document.querySelector(".popUpWindow");
  pop.style = "display:flex";

  document.querySelector(".close").addEventListener("click", closePop);
};

const main = () => {
  document.getElementById("login-btn").addEventListener("click", popOut);
};

globalThis.onload = main;
