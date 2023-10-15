import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Nhan's game";

document.title = gameName;

const header = document.createElement("h1");
const canvas = document.createElement("canvas");
const clrbt = document.createElement("button");

clrbt.innerHTML = "clear";
canvas.id = "canvas";
canvas.height = 256;
canvas.width = 256;
const ctx = canvas.getContext("2d");

const cursor = { active: false, x: 0, y: 0 };
canvas.addEventListener("mousedown", (current) => {
  cursor.active = true;
  cursor.x = current.offsetX;
  cursor.y = current.offsetY;
  console.log(
    cursor.x.toString() + " " + cursor.y.toString() + " " + cursor.active
  );
});
canvas.addEventListener("mousemove", (current) => {
  if (cursor.active) {
    ctx?.beginPath();
    ctx?.moveTo(cursor.x, cursor.y);
    ctx?.lineTo(current.offsetX, current.offsetY);
    ctx?.stroke();
    cursor.x = current.offsetX;
    cursor.y = current.offsetY;
  }
});
canvas.addEventListener("mouseup", () => {
  cursor.active = false;
});
clrbt.addEventListener("click", () => {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
});
header.innerHTML = gameName;
app.append(header);
app.append(canvas);
app.append(clrbt);
