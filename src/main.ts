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
//let currentPath: [number, number][] | null = null;
const paths: Lines[] = [];
const redos: Lines[] = [];
let insert: Lines | undefined;
let currentLineCmd: Lines | null = null;
let cursorCmd: Cursors | null = null;

canvas.style.cursor = "none";
clrbt.innerHTML = "clear";
undobt.innerHTML = "undo";
redobt.innerHTML = "redo";
canvas.id = "canvas";
canvas.height = 256;
canvas.width = 256;
const ctx = canvas.getContext("2d");

//const cursor = { active: false, x: 0, y: 0 };

bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("cursor-changed", redraw);

canvas.addEventListener("mousedown", (current) => {
  //cursor.active = true;
  currentLineCmd = new Lines(current.offsetX, current.offsetY);
  paths.push(currentLineCmd);
  const startIndex = 0;
  redos.splice(startIndex, redos.length);
  //currentPath?.push([current.offsetX, current.offsetY]);
  notify(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (current) => {
  cursorCmd = new Cursors(current.offsetX, current.offsetY);
  notify(new Event("cursor-changed"));

  const btrequire = 1;
  if (current.buttons == btrequire) {
    currentLineCmd?.points.push([current.offsetX, current.offsetY]);
    notify(new Event("drawing-changed"));
  }
});

canvas.addEventListener("mouseup", () => {
  currentLineCmd = null;
  notify(new Event("drawing-changed"));
});

clrbt.addEventListener("click", () => {
  const startPos = 0;
  ctx?.clearRect(startPos, startPos, canvas.width, canvas.height);
  paths.splice(startPos, paths.length);
});

undobt.addEventListener("click", () => {
  if (paths.length) {
    insert = paths.pop();
    if (insert) {
      redos.push(insert);
    }
    notify(new Event("drawing-changed"));
  }
});

redobt.addEventListener("click", () => {
  if (redos.length) {
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
  const starter = 0;
  ctx?.clearRect(starter, starter, canvas.width, canvas.height);

  paths.forEach((cmd) => cmd.execute());
  if (cursorCmd) {
    cursorCmd.execute();
  }
}

class Lines {
  points: [number, number][];
  constructor(x: number, y: number) {
    this.points = [[x, y]];
  }
  execute() {
    const firstIndex = 0;
    const secondIndex = 1;
    ctx!.strokeStyle = "Black";
    ctx?.beginPath();
    const cur = this.points[firstIndex];
    ctx?.moveTo(cur[firstIndex], cur[secondIndex]);
    for (const curcor of this.points) {
      ctx?.lineTo(curcor[firstIndex], curcor[secondIndex]);
    }
    ctx?.stroke();
  }
  drag(x: number, y: number) {
    this.points.push([x, y]);
  }
}

class Cursors {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  execute() {
    const fixerx = 8;
    ctx!.font = "32px monospace";
    ctx?.fillText(".", this.x - fixerx, this.y);
  }
}
