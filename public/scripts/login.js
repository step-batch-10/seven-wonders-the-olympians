const login = async (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const name = data.get("username");

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (res.redirected) {
    globalThis.location.href = res.url;
  }
};

const main = () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", login);
};
globalThis.onload = main;
