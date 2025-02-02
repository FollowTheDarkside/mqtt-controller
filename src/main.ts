// import mqtt from 'https://unpkg.com/mqtt/dist/mqtt.min.js';
// import * as mqtt from 'https://unpkg.com/mqtt/dist/mqtt.min.js';
import './style.scss'
import {MqttManager} from './mqtt'
import {dist, degToRad, normalizePos, normalizeDistance} from './util'

// for MQTT
const protocol = "wss"
const host = "test.mosquitto.org"
const port = 8081  // 1883, 8081

let mqttManager:MqttManager;

let freqPicker: HTMLInputElement;  // UI to reduce publishing frequency

// for Drawing
let canvas: HTMLCanvasElement;
let width: number;
let height: number;
let ctx: CanvasRenderingContext2D;
let drawIndex: number;

const canvasColor = "rgb(125,125,125)";
const pointerColor = "rgb(240,125,50)";

// Mouse Info
let curX: number;
let curY: number;
let nx: number;
let ny: number;
let mousePressed = false;

window.addEventListener('load', init);

function init(){
  console.log("init...");
  mqttManager = new MqttManager(protocol, host, port, getTopic())
  mqttManager.connect();

  // function handleMessage(message: string) {
  //   console.log("Received:", message);
  // }
  // mqttManager.addMessageHandler(handleMessage);

  const btnPub = document.querySelector("#btn-pub");
  btnPub?.addEventListener("click", _ => {
    mqttManager.sendMessage(createMessage());
  });

  initCanvasInput();
  draw();
}

const getTopic = () => {
  let textBox = <HTMLInputElement>document.getElementById('topic-text-box');
  return textBox.value
};

function initCanvasInput(){
  console.log("init canvas...");
  freqPicker = <HTMLInputElement>document.querySelector('input[type="range"]');

  canvas = document.querySelector("#input-canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  resizeCanvas();

  curX = canvas.width / 2;
  curY = canvas.height / 2;

  drawIndex = 0;

  freqPicker.oninput = () => {
    const freqText = <HTMLSpanElement>document.getElementById('freq-text');
    freqText.textContent = freqPicker.value;
  };

  // Mouse events
  canvas.onmousemove = (e) => {
    curX = e.offsetX;
    curY = e.offsetY;
    // console.log("pos:", curX, curY)
  };
  canvas.onmousedown = () => {
    mousePressed = true;
  };
  canvas.onmouseup = () => {
    mousePressed = false;
  };

  // Touch events
  canvas.ontouchmove = (e) => {
    e.preventDefault();
    const clientRect = canvas.getBoundingClientRect();
    curX = e.touches[0].pageX - clientRect.left;
    curY = e.touches[0].pageY - clientRect.top;
    // console.log("pos:", curX, curY)
  };
  canvas.ontouchstart = (e) => {
    e.preventDefault();
    mousePressed = true;
  };
  canvas.ontouchend = (e) => {
    e.preventDefault();
    mousePressed = false;
  };

  window.onresize = () => {
    console.log("resized...");
    resizeCanvas();
  }
}

// Convert degrees to radians
function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

// Convert the coordinates to fit between 0 and 1
function normalizePos(x: number, y: number){
  // let clientRect = canvas.getBoundingClientRect();
  nx = x / canvas.clientWidth;
  ny = y / canvas.clientHeight;
  // console.log("nPos:", nx, ny);
}

function resizeCanvas(){
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight * 1.5;
  width = canvas.width;
  height = canvas.height;
  ctx.fillStyle = canvasColor;
  ctx.fillRect(0, 0, width, height);
}

function draw() {
  if (mousePressed) {
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = pointerColor;
    ctx.beginPath();
    ctx.arc(
      curX,
      curY,
      15,
      degToRad(0),
      degToRad(360),
      false,
    );
    ctx.fill();

    drawIndex += 1;

    // Reduce publishing frequency
    if(drawIndex % Number(freqPicker.value) == 0){
      //sendMessage(client, createMessage());
      mqttManager.sendMessage(createMessage());
    }
  }
  requestAnimationFrame(draw);
}

function createMessage(){
  let message: string = ""
  normalizePos(curX, curY);
  message = JSON.stringify({ x: nx, y: ny })
  // console.log("msg:", message)
  return message;
}
