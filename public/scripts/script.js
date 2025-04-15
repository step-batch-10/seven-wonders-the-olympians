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
