let osc, playing, scale, delay, reverb;

let woop;
let grin;
let mouf;
let mouf_w;
let mouf_h;
let woop_x;
let woop_y;

let song;
let vocals;
let amp;
let playing_song = false;

// get note frequencies here https://pages.mtu.edu/~suits/notefreqs.html
const waveform = ['sine', 'sawtooth', 'triangle', 'square'];
const diatonic = [27.50, 30.87, 32.70, 36.71, 41.20, 43.65, 49.00, 55.00, 61.74, 65.41, 73.42, 82.41, 87.31, 98.00, 110.00, 123.47, 130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
const chromatic = [27.50, 29.14, 30.87, 32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00, 51.91, 55.00, 58.27, 61.74, 65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.83, 110.00, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77, 1046.50];

// Preload all images
function preload() {
  song = loadSound('boba.mp3');
  vocals = loadSound('vocals.mp3');
  woop = loadImage('wooper.png');
  grin = loadImage('grin.png');
  mouf = loadImage('mouf.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  osc = new p5.Oscillator(waveform[0]);
  delay = new p5.Delay();
  delay.process(osc, 0.7, .7, 1500);
  delay.drywet(0);
  reverb = new p5.Reverb();
  reverb.process(osc, 3, 2);
  reverb.drywet(0);
  scale = diatonic;

  mouf_w = mouf.width;
  mouf_h = mouf.height;
  woop_x = windowWidth / 2 - woop.width / 2;
  woop_y = windowHeight / 2 - woop.height / 2;

  amp = new p5.Amplitude();
  amp.setInput(vocals);
  vocals.setVolume(0.1);
}

function mousePressed() {
  osc.start();
  osc.amp(0);
  playing = true;
}

function mouseReleased() {
  osc.amp(0, 0.1);
  playing = false;
}

function keyPressed() {
  switch (key) {
    case '1':
      osc.setType('sine');
      break;
    case '2':
      osc.setType('sawtooth');
      break;
    case '3':
      osc.setType('triangle');
      break;
    case '4':
      osc.setType('square');
      break;
    case ' ':
      togglePlay();
    default:
  }
}

function draw() {
  background(255, 175, 140)
  image(woop, woop_x, woop_y);

  textSize(32);
  fill(70);
  text("Click and drag mouse to make him sing", 20, 50);
  text("\nPress Keys 1-4 for different sounds", 20, 50);
  text("\n\nPress space to hear wooper sing!", 20, 50);
  text("\n\n[royalty free BGM] boba date | prod. by stream cafe", width - 750, height - 120);
  if (!playing_song) {
    if (!playing) {
      image(grin, woop_x + 175, woop_y + 110, grin.width / 2, grin.height / 2);
    }
    if (playing) {
      let f = map(mouseX, 0, width, 27.5, 1046.5, true);

      let a = map(mouseY, 0, height, 1, 0, true);
      osc.freq(f, 0.1);
      osc.amp(a, 0.1);
      let targetMoufH = map(mouseY, 0, height, mouf.height * 2, mouf.height / 2);
      let targetMoufW = map(mouseX, 0, width, mouf.width / 2, mouf.width * 2);

      mouf_w = lerp(mouf_w, targetMoufW, 0.1);
      mouf_h = lerp(mouf_h, targetMoufH, 0.1);

      image(mouf, woop_x + 240, woop_y + 100, mouf_w, mouf_h);
    }
    if (mouseX > width || mouseX < 0) {
      osc.amp(0, 0.1);
      playing = false;
    }
    if (mouseY > height || mouseY < 0) {
      osc.amp(0, 0.1);
      playing = false;
    }
  }
  else if (playing_song) {
    let volume = amp.getLevel();

    if (volume > .012) {
      image(mouf, woop_x + 240, woop_y + 100, mouf_w, mouf_h);
    }
    else {
      image(grin, woop_x + 175, woop_y + 110, grin.width / 2, grin.height / 2);
    }
    image(dance, woop_x + woop.width, woop_y);
  }
}
function togglePlay() {
  if (song.isPlaying() || vocals.isPlaying()) {
    song.pause();
    vocals.pause();
    playing_song = false;
  } else {
    song.play();
    vocals.play();
    playing_song = true;
  }
}
