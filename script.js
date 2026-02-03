const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const result = document.getElementById("result");

noBtn.addEventListener("mouseenter", () => {
  const boxWidth = 80;
  const boxHeight = 20;

  const x = Math.random() * boxWidth;
  const y = Math.random() * boxHeight;

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
});

yesBtn.addEventListener("click", () => {
  result.textContent = "This was great 💖🥰";
});
