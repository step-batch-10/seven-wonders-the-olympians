const initTypewriter = () => {
  const text = "Welcome to 7 wonders...";
  const speed = 70;
  let i = 0;

  const typeWriter = () => {
    const ele = document.getElementById("typewriter");
    if (i < text.length && ele) {
      ele.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  };

  typeWriter();
};

const setupPopupHandlers = () => {
  const popup = document.querySelector(".popUpWindow");
  const main = document.querySelector("main");
  const closeBtn = document.querySelector(".close");

  const closePop = () => {
    const sound = new Audio("audio/close-options.mp4");
    sound.currentTime = 0;
    sound.play();

    popup.style.transform = "scale(0)";

    main.style.backgroundImage = `
    linear-gradient(#00000030, #00000030),
    url("../img/lobby-page.png")
  `;
    document.getElementById("login-btn").style = "display: block";
  };

  const popOut = () => {
    const sound = new Audio("audio/options.mp4");
    sound.currentTime = 0;
    sound.play();
    popup.style.display = "flex";
    popup.style.transform = "scale(1)";
    main.style.backgroundImage = `
      linear-gradient(#0000009a, #0000009a),
      url("../img/lobby-page.png")
    `;
    document.getElementById("login-btn").style = "display: none";
  };

  document.getElementById("login-btn").addEventListener("click", popOut);
  closeBtn.addEventListener("click", closePop);
};

const initFireFlacks = () => {
  const fireCanvas = document.getElementById("fireCanvas");
  if (!fireCanvas) return;

  const ctx = fireCanvas.getContext("2d");
  fireCanvas.width = globalThis.innerWidth;
  fireCanvas.height = globalThis.innerHeight;

  const flacks = [];

  const createFlack = () => {
    return {
      x: Math.random() * fireCanvas.width,
      y: fireCanvas.height,
      size: Math.random() * 2 + 1,
      speedY: Math.random() * 1 + 0.5,
      alpha: Math.random() * 0.5 + 0.3,
    };
  };

  for (let i = 0; i < 100; i++) {
    flacks.push(createFlack());
  }

  const animateFlacks = () => {
    ctx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
    flacks.forEach((flack) => {
      flack.y -= flack.speedY;
      ctx.fillStyle = `rgba(255, 100, 0, ${flack.alpha})`;
      ctx.beginPath();
      ctx.arc(flack.x, flack.y, flack.size, 0, Math.PI * 2);
      ctx.fill();

      if (flack.y < 0) Object.assign(flack, createFlack());
    });
    requestAnimationFrame(animateFlacks);
  };

  animateFlacks();

  globalThis.addEventListener("resize", () => {
    fireCanvas.width = globalThis.innerWidth;
    fireCanvas.height = globalThis.innerHeight;
  });
};

const main = () => {
  initTypewriter();
  setupPopupHandlers();
  initFireFlacks();
};

globalThis.onload = main;
