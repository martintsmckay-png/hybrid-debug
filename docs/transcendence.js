// ======================================================
// TRANSCENDENCE ENGINE: 3.5D Math & 432Hz Audio Layer
// ======================================================

const TRANSCENDENCE = {
  status: "HOLYGHOST_WORKER_ACTIVE",
  frequency: 432,
  buffer: "sweetgrass"
};

// ------------------------------------------------------
// 1. FRACTAL GEOMETRY (3.5D Vector Space)
// ------------------------------------------------------
class Vector3_5D {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = 0.5;
  }

  drift(boundaryX, boundaryY) {
    this.x = (this.x + Math.sin(this.w) * 2) % boundaryX;
    this.y = (this.y + Math.cos(this.w) * 2) % boundaryY;

    if (this.x < 0) this.x = boundaryX;
    if (this.y < 0) this.y = boundaryY;
  }
}

// ------------------------------------------------------
// 2. SWEETGRASS BUFFER (432Hz Audio)
// ------------------------------------------------------
class AudioResonator {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.oscillator = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();

    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = TRANSCENDENCE.frequency;
    this.gainNode.gain.value = 0.05;

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
  }

  ignite() {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.oscillator.start();
    console.log(`[Transcendence] Sweetgrass hum active at ${TRANSCENDENCE.frequency}Hz`);
  }

  silence() {
    this.gainNode.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 1);
    setTimeout(() => this.oscillator.stop(), 1000);
  }
}

// ------------------------------------------------------
// 3. INFINITE LOOP + DOM HOOK
// ------------------------------------------------------
function startTranscendenceLayer() {
  try {
    const resonator = new AudioResonator();
    const bead = new Vector3_5D(100, 100, 0);

    document.body.addEventListener(
      "click",
      () => {
        resonator.ignite();
        console.log("[Transcendence] Sweetgrass hum engaged.");
      },
      { once: true }
    );

    function loop() {
      bead.drift(window.innerWidth, window.innerHeight);
      requestAnimationFrame(loop);
    }

    loop();
  } catch (e) {
    console.warn("Transcendence layer failed gracefully:", e);
  }
}

startTranscendenceLayer();
