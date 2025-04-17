const userName = async () => {
  const res = await fetch("/player/name");
  return `${await res.text()}!`;
};

const data = async () => {
  const res = await fetch("/game/status");
  const data = await res.json();

  if (data.gameStatus === "matched") {
    globalThis.location.href = "/player_wonder.html";
  }
};

const displayUserName = async () => {
  const name = await userName();
  console.log(name);
  const location = document.querySelector(".name");
  location.innerText = `${location.innerText}  ${name}`;
  return setInterval(() => {
    data();
  }, 1000);
};

globalThis.onload = displayUserName;
