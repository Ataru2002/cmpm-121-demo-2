import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Nhan's paint";

document.title = gameName;

const header = document.createElement("h1");
const br = document.createElement("br");
const br2 = document.createElement("br");
const br3 = document.createElement("br");
const canvas = document.createElement("canvas");

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
let cmds: string[] = [
  "clear",
  "undo",
  "redo",
  "thin",
  "thick",
  "custom stickers",
  "export",
];
let icons: string[] = ["🍫", "🍯", "🍬"];
let iconbts: HTMLButtonElement[] = [
  document.createElement("button"),
  document.createElement("button"),
  document.createElement("button"),
];
let cmdbts: HTMLButtonElement[] = [
  document.createElement("button"),
  document.createElement("button"),
  document.createElement("button"),
  document.createElement("button"),
  document.createElement("button"),
  document.createElement("button"),
  document.createElement("button"),
];
let currenticon: string | null = null;

canvas.style.cursor = "none";
let lengthi = 3;
let lengthc = 7;
for (let i = 0; i < lengthc; i++) {
  cmdbts[i].innerHTML = cmds[i];
}
for (let i = 0; i < lengthi; i++) {
  iconbts[i].innerHTML = icons[i];
}

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

cmdbts[0].addEventListener("click", () => {
  const startPos = 0;
  currenticon = null;
  ctx?.clearRect(startPos, startPos, canvas.width, canvas.height);
  paths.splice(startPos, paths.length);
});

cmdbts[1].addEventListener("click", () => {
  currenticon = null;
  if (paths.length) {
    insert = paths.pop();
    if (insert) {
      redos.push(insert);
    }
    notify(new Event("drawing-changed"));
  }
});

cmdbts[2].addEventListener("click", () => {
  currenticon = null;
  if (redos.length) {
    insert = redos.pop();
    if (insert) {
      paths.push(insert);
    }
    notify(new Event("drawing-changed"));
  }
});

cmdbts[3].addEventListener("click", () => {
  currenticon = null;
  cursorCmd?.changeIcon(".", ctx!);
  const thick = defthick;
  thickness = thick;

  notify(new Event("tool-moved"));
});

cmdbts[4].addEventListener("click", () => {
  currenticon = null;
  cursorCmd?.changeIcon(".", ctx!);
  const thick = modthick;
  thickness = thick;

  notify(new Event("tool-moved"));
});

cmdbts[5].addEventListener("click", () => {
  currenticon = prompt("Add your custom sticker");
  if (currenticon) {
    const newbt = document.createElement("button");
    cursorCmd?.changeIcon(currenticon, ctx!);
    icons.push(currenticon);
    iconbts.push(newbt);
    newbt.innerHTML = currenticon;
    lengthi++;

    newbt.addEventListener("click", () => {
      currenticon = icons[lengthi - 1];
      cursorCmd?.changeIcon(currenticon, ctx!);

      notify(new Event("tool-moved"));
    });

    app.append(newbt);
  }
  notify(new Event("tool-moved"));
});

cmdbts[6].addEventListener("click", () => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.id = "canvas";
  tempCanvas.height = 1024;
  tempCanvas.width = 1024;
  const ctx2 = tempCanvas.getContext("2d");

  const starter = 0;
  ctx2?.clearRect(starter, starter, tempCanvas.width, tempCanvas.height);
  ctx2?.scale(4, 4);
  paths.forEach((cmd) => cmd.execute(ctx2!));

  const anchor = document.createElement("a");
  anchor.href = tempCanvas.toDataURL("image/png");
  anchor.download = "sketchpad.png";
  anchor.click();
});

for (let i = 0; i < lengthi; i++) {
  iconbts[i].addEventListener("click", () => {
    currenticon = icons[i];
    cursorCmd?.changeIcon(currenticon, ctx!);

    notify(new Event("tool-moved"));
  });
}

header.innerHTML = gameName;
app.append(header);
app.append(canvas);
app.append(br);
const firsts = 5;
for (let i = 0; i < firsts; i++) {
  app.append(cmdbts[i]);
}
app.append(br2);
for (let i = 5; i < lengthc; i++) {
  app.append(cmdbts[i]);
}
app.append(br3);
for (let i = 0; i < lengthi; i++) {
  app.append(iconbts[i]);
}

function notify(name: Event) {
  bus.dispatchEvent(name);
}

function redraw() {
  const starter = 0;
  ctx?.clearRect(starter, starter, canvas.width, canvas.height);

  paths.forEach((cmd) => cmd.execute(ctx!));
  if (cursorCmd) {
    cursorCmd.execute(ctx!);
  }
}

class Lines {
  points: [number, number][];
  thickness: number;
  constructor(x: number, y: number, thickness: number) {
    this.points = [[x, y]];
    this.thickness = thickness;
  }
  execute(context: CanvasRenderingContext2D) {
    const firstIndex = 0;
    const secondIndex = 1;
    context?.beginPath();
    context!.strokeStyle = "Black";
    context!.lineWidth = this.thickness;
    const cur = this.points[firstIndex];
    context?.moveTo(cur[firstIndex], cur[secondIndex]);
    for (const curcor of this.points) {
      context?.lineTo(curcor[firstIndex], curcor[secondIndex]);
    }
    context?.stroke();
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
  execute(context: CanvasRenderingContext2D) {
    context!.font = "32px monospace";
    context?.fillText(this.type, this.x, this.y);
  }
  drag(x: number, y: number, context: CanvasRenderingContext2D) {
    context?.translate(x, y);
  }
  reset(context: CanvasRenderingContext2D) {
    context?.resetTransform();
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
  execute(context: CanvasRenderingContext2D) {
    if (this.type != ".") {
      context!.font = "32px monospace";
      const fixerx = 0;
      context?.fillText(this.type, this.x - fixerx, this.y);
    } else {
      if (thickness == defthick) {
        context!.font = "32px monospace";
        const fixerx = 8;
        context?.fillText(this.type, this.x - fixerx, this.y);
      } else {
        context!.font = "100px monospace";
        const fixerx = 30;
        const fixery = 8;
        context?.fillText(this.type, this.x - fixerx, this.y + fixery);
      }
    }
  }
  changeIcon(type: string, context: CanvasRenderingContext2D) {
    if (this.type != ".") context!.font = "32px monospace";
    this.type = type;
  }
}
