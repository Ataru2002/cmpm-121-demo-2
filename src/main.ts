import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Nhan's game";

document.title = gameName;

const header = document.createElement("h1");
const canvas = document.createElement("canvas");
const clrbt = document.createElement("button");
const undobt = document.createElement("button");
const redobt = document.createElement("button");

const bus = new EventTarget();
let currentPath: [number, number][] | null = null;
const paths: [number, number][][] = [];
const redos: [number, number][][] = [];
let insert: [number, number][] | undefined;

clrbt.innerHTML = "clear";
undobt.innerHTML = "undo";
redobt.innerHTML = "redo";
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
  redos.splice(0, redos.length);
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

undobt.addEventListener("click", () => {
  if (paths.length > 0) {
    insert = paths.pop();
    if (insert) {
      redos.push(insert);
    }
    notify(new Event("drawing-changed"));
  }
});

redobt.addEventListener("click", () => {
  if (redos.length > 0) {
    insert = redos.pop();
    if (insert) {
      paths.push(insert);
    }
    notify(new Event("drawing-changed"));
  }
});

header.innerHTML = gameName;
app.append(header);
app.append(canvas);
app.append(clrbt);
app.append(undobt);
app.append(redobt);

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
