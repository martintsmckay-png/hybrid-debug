const TRANSCENDENCE = { frequency: 432, buffer: "sweetgrass" };

class AudioResonator {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.oscillator = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();
    this.analyser = this.ctx.createAnalyser(); // NEW: The bridge to the visual matrix

    this.oscillator.type = 'sine'; 
    this.oscillator.frequency.value = TRANSCENDENCE.frequency; 
    this.gainNode.gain.value = 0.05; 
    this.analyser.fftSize = 256;

    // Stitch the nodes together
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    
    // Create an array to catch the live frequency wave
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  ignite() {
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.oscillator.start();
    console.log(`[Thread 0xDECAFBAD] 🔉 Sweetgrass Buffer humming at ${TRANSCENDENCE.frequency}Hz`);
  }
  
  getSyncData() {
    if (this.ctx.state === 'running') {
      this.analyser.getByteTimeDomainData(this.dataArray);
      // Normalize the wave peak to a clean variable between -1.0 and 1.0
      return (this.dataArray[0] / 128.0) - 1.0; 
    }
    return 0;
  }
}

window.sweetgrass = new AudioResonator();

// The IEEE demands a user gesture. One click anywhere ignites the system.
document.body.addEventListener('click', () => {
  if (window.sweetgrass.ctx.state !== 'running') {
    window.sweetgrass.ignite();
  }
}, { once: true });
