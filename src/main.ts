import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Nhan's game";

document.title = gameName;

const header = document.createElement("h1");
const canvas = document.createElement("canvas");
const clrbt = document.createElement("button");
const bus = new EventTarget();
let currentPath: Array<[number, number]> | null = null;
const paths: Array<Array<[number, number]>> = [];

clrbt.innerHTML = "clear";
canvas.id = "canvas";
canvas.height = 256;
canvas.width = 256;
const ctx = canvas.getContext("2d");

const cursor = { active: false, x: 0, y: 0 };

bus.addEventListener("drawing-changed", redraw);

canvas.addEventListener("mousedown", (current) => {
  cursor.active = true;
  currentPath = [];
  paths.push(currentPath);
  currentPath?.push([current.offsetX, current.offsetY]);
  notify(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (current) => {
  if (cursor.active) {
    cursor.x = current.offsetX;
    cursor.y = current.offsetY;
    currentPath?.push([current.offsetX, current.offsetY]);
    notify(new Event("drawing-changed"));
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  currentPath = null;
  notify(new Event("drawing-changed"));
});
clrbt.addEventListener("click", () => {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  paths.splice(0, paths.length);
});
header.innerHTML = gameName;
app.append(header);
app.append(canvas);
app.append(clrbt);

function notify(name: Event) {
  bus.dispatchEvent(name);
}

function redraw() {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of paths) {
    if (line.length > 1) {
      ctx?.beginPath();
      const cur = line[0];
      ctx?.moveTo(cur[0], cur[1]);
      for (const curcor of line) {
        ctx?.lineTo(curcor[0], curcor[1]);
      }
      ctx?.stroke();
    }
  }
}
