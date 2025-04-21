const text = "7 wonders are under construction...";
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

const popOut = () => {
  document.querySelector("main").style = "filter: blur(5px)";
  const iframe = document.createElement("iframe");
  iframe.src = "login.html";
  iframe.width = "40%";
  iframe.height = "600";
  iframe.style.border = "none";
  const pop = document.querySelector(".popUpWindow");
  pop.style = "display:flex";

  pop.appendChild(iframe);
};

const main = () => {
  document.querySelector("button").addEventListener("click", popOut);
};

globalThis.onload = main;
