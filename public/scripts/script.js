import { loginMain } from "./login.js";
const text = "Welcome to 7 wonders...";
const speed = 70;
let i = 0;

function typeWriter() {
  if (i < text.length) {
    document.getElementById("typewriter").textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

document.addEventListener("DOMContentLoaded", typeWriter);

const closePop = () => {
  const pop = document.querySelector(".popUpWindow");
  pop.style.transform = "scale(0)";
  // pop.style = "display:none";
};

const popOut = () => {
  const pop = document.querySelector(".popUpWindow");
  pop.style = "display:flex";

  document.querySelector(".close").addEventListener("click", closePop);
};

const main = () => {
  document.querySelector("button").addEventListener("click", popOut);
  loginMain();
};

globalThis.onload = main;
