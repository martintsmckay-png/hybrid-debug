const TRANSCENDENCE = { freqBase: 432, freqInvert: 216 };

class AudioResonator {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.oscillator = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();
    this.analyser = this.ctx.createAnalyser();

    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = TRANSCENDENCE.freqBase;
    this.gainNode.gain.value = 0.05;

    this.analyser.fftSize = 256;

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.isIgnited = false;
    this.isInverted = false;

    this.oscillator.start();
    this.ctx.suspend(); // wait for UI command
  }

  togglePower() {
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
      this.isIgnited = true;
      console.log(`[Thread 0xDECAFBAD] 🔉 Sweetgrass Buffer Online`);
    } else {
      this.ctx.suspend();
      this.isIgnited = false;
      console.log(`[Thread 0xDECAFBAD] 🔇 Sweetgrass Buffer Offline`);
    }
  }

  toggleInversion() {
    this.isInverted = !this.isInverted;
    const targetFreq = this.isInverted
      ? TRANSCENDENCE.freqInvert
      : TRANSCENDENCE.freqBase;

    this.oscillator.frequency.setTargetAtTime(
      targetFreq,
      this.ctx.currentTime,
      0.05
    );
    console.log(`[Thread 0xDECAFBAD] 🔄 Matrix shifted to ${targetFreq}Hz`);
  }

  getSyncData() {
    if (this.ctx.state === "running") {
      this.analyser.getByteTimeDomainData(this.dataArray);
      return this.dataArray[0] / 128.0 - 1.0;
    }
    return 0;
  }
}

window.sweetgrass = new AudioResonator();

// ------------------------------------------------------
// UI CONTROL PANEL
// ------------------------------------------------------
const uiPanel = document.createElement("div");
uiPanel.style.cssText = `
  position: fixed; bottom: 20px; right: 20px; z-index: 9999;
  background: rgba(10, 10, 15, 0.85); border: 1px solid rgba(255, 215, 130, 0.3);
  padding: 15px; border-radius: 8px; backdrop-filter: blur(10px);
  display: flex; gap: 10px; font-family: monospace;
`;

const btnPower = document.createElement("button");
btnPower.innerText = "⚡ IGNITE MATRIX";
btnPower.style.cssText = `
  background: transparent; color: #FFD782; border: 1px solid #FFD782;
  padding: 8px 12px; cursor: pointer; font-weight: bold; border-radius: 4px;
`;

const btnInvert = document.createElement("button");
btnInvert.innerText = "🔄 INVERT";
btnInvert.style.cssText = `
  background: transparent; color: #00FFFF; border: 1px solid #00FFFF;
  padding: 8px 12px; cursor: pointer; font-weight: bold; border-radius: 4px;
`;

btnPower.addEventListener("click", () => {
  window.sweetgrass.togglePower();
  btnPower.innerText = window.sweetgrass.isIgnited
    ? "🔇 SILENCE MATRIX"
    : "⚡ IGNITE MATRIX";
  btnPower.style.background = window.sweetgrass.isIgnited
    ? "rgba(255, 215, 130, 0.2)"
    : "transparent";
});

btnInvert.addEventListener("click", () => {
  window.sweetgrass.toggleInversion();
  btnInvert.style.background = window.sweetgrass.isInverted
    ? "rgba(0, 255, 255, 0.2)"
    : "transparent";
});

uiPanel.appendChild(btnPower);
uiPanel.appendChild(btnInvert);
document.body.appendChild(uiPanel);
