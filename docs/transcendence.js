const TRANSCENDENCE = { freqBase: 432, freqInvert: 216 };
window.xp = window.xp || { level: 1 }; // XP Global Injection

class AudioResonator {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
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
    this.ctx.suspend();
  }
  togglePower() {
    if (this.ctx.state === "suspended") { this.ctx.resume(); this.isIgnited = true; } 
    else { this.ctx.suspend(); this.isIgnited = false; }
  }
  toggleInversion() {
    this.isInverted = !this.isInverted;
    this.oscillator.frequency.setTargetAtTime(this.isInverted ? 216 : 432, this.ctx.currentTime, 0.05);
  }
  getSyncData() {
    if (this.ctx.state === "running") { this.analyser.getByteTimeDomainData(this.dataArray); return this.dataArray[0] / 128.0 - 1.0; }
    return 0;
  }
}
window.sweetgrass = new AudioResonator();
