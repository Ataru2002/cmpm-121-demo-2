import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Nhan's game";

document.title = gameName;

const header = document.createElement("h1");
const br = document.createElement("br");
const canvas = document.createElement("canvas");
const clrbt = document.createElement("button");
const undobt = document.createElement("button");
const redobt = document.createElement("button");
const thinbt = document.createElement("button");
const thickbt = document.createElement("button");
const chocobt = document.createElement("button");
const honeybt = document.createElement("button");
const candybt = document.createElement("button");

const bus = new EventTarget();
//let currentPath: [number, number][] | null = null;
const paths: (Lines | Stickers)[] = [];
const redos: (Lines | Stickers)[] = [];
let insert: Lines | Stickers | undefined;
let currentLineCmd: Lines | null = null;
let cursorCmd: Cursors | null = null;
let stickerCmd: Stickers | null = null;
const defthick = 1;
const modthick = 10;
let thickness: number = defthick;
const choco = "🍫";
const honey = "🍯";
const candy = "🍬";
let currenticon: string | null = null;

canvas.style.cursor = "none";
clrbt.innerHTML = "clear";
undobt.innerHTML = "undo";
redobt.innerHTML = "redo";
thinbt.innerHTML = "thin";
thickbt.innerHTML = "thick";
chocobt.innerHTML = choco;
honeybt.innerHTML = honey;
candybt.innerHTML = candy;

canvas.id = "canvas";
canvas.height = 256;
canvas.width = 256;
const ctx = canvas.getContext("2d");

bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("tool-moved", redraw);

canvas.addEventListener("mousedown", (current) => {
  if (currenticon) {
    stickerCmd = new Stickers(current.offsetX, current.offsetY, currenticon);
    paths.push(stickerCmd);
  } else {
    currentLineCmd = new Lines(current.offsetX, current.offsetY, thickness);
    paths.push(currentLineCmd);
  }
  const startIndex = 0;
  redos.splice(startIndex, redos.length);
  notify(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (current) => {
  if (currenticon) {
    cursorCmd = new Cursors(current.offsetX, current.offsetY, currenticon);
  } else {
    cursorCmd = new Cursors(current.offsetX, current.offsetY, ".");
  }
  notify(new Event("tool-moved"));

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
  currenticon = null;
  ctx?.clearRect(startPos, startPos, canvas.width, canvas.height);
  currenticon = null;
  paths.splice(startPos, paths.length);
});

undobt.addEventListener("click", () => {
  currenticon = null;
  if (paths.length) {
    insert = paths.pop();
    if (insert) {
      redos.push(insert);
    }
    notify(new Event("drawing-changed"));
  }
});

redobt.addEventListener("click", () => {
  currenticon = null;
  if (redos.length) {
    insert = redos.pop();
    if (insert) {
      paths.push(insert);
    }
    notify(new Event("drawing-changed"));
  }
});

thinbt.addEventListener("click", () => {
  currenticon = null;
  const thick = defthick;
  thickness = thick;
  notify(new Event("drawing-changed"));
});

thickbt.addEventListener("click", () => {
  currenticon = null;
  const thick = modthick;
  thickness = thick;
  notify(new Event("drawing-changed"));
});

chocobt.addEventListener("click", () => {
  currenticon = choco;
});

honeybt.addEventListener("click", () => {
  currenticon = honey;
});

candybt.addEventListener("click", () => {
  currenticon = candy;
});

header.innerHTML = gameName;
app.append(header);
app.append(canvas);
app.append(br);
app.append(clrbt);
app.append(undobt);
app.append(redobt);
app.append(thinbt);
app.append(thickbt);
//app.append(br);
app.append(chocobt);
app.append(honeybt);
app.append(candybt);

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
  thickness: number;
  constructor(x: number, y: number, thickness: number) {
    this.points = [[x, y]];
    this.thickness = thickness;
  }
  execute() {
    const firstIndex = 0;
    const secondIndex = 1;
    ctx?.beginPath();
    ctx!.strokeStyle = "Black";
    ctx!.lineWidth = this.thickness;
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

class Stickers {
  x: number;
  y: number;
  type: string;
  constructor(x: number, y: number, type: string) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  execute() {
    ctx?.fillText(this.type, this.x, this.y);
  }
  drag(x: number, y: number) {
    ctx?.translate(x, y);
  }
  reset() {
    ctx?.resetTransform();
  }
}

class Cursors {
  x: number;
  y: number;
  type: string;
  constructor(x: number, y: number, type: string) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  execute() {
    if (currenticon) {
      ctx!.font = "32px monospace";
      const fixerx = 8;
      ctx?.fillText(this.type, this.x - fixerx, this.y);
    } else if (thickness == defthick) {
      ctx!.font = "32px monospace";
      const fixerx = 8;
      ctx?.fillText(this.type, this.x - fixerx, this.y);
    } else {
      ctx!.font = "100px monospace";
      const fixerx = 30;
      const fixery = 8;
      ctx?.fillText(this.type, this.x - fixerx, this.y + fixery);
    }
  }
}
