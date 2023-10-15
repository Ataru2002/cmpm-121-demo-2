import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Nhan's game";

document.title = gameName;

const header = document.createElement("h1");
const canvas = document.createElement("canvas");

canvas.id = "canvas";
const ctx = canvas.getContext("2d");
ctx!.fillStyle = "white";
ctx!.fillRect(0, 0, 1000, 1000);

header.innerHTML = gameName;
app.append(header);
app.append(canvas);
