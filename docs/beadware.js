(function () {
  const canvas = document.getElementById("beadware-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  resize();
  window.addEventListener("resize", resize);

  const beads = [];
  const beadCount = 40;

  for (let i = 0; i < beadCount; i++) {
    beads.push({
      x: (i / beadCount) * window.innerWidth,
      y: 40 + Math.random() * 60,
      baseR: 3 + Math.random() * 4, // Store the original radius
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02
    });
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Pull the real-time audio pulse from the transcendence engine
    const syncPulse = window.sweetgrass ? window.sweetgrass.getSyncData() : 0;

    // Draw the soft thread line, rippling with the audio wave
    ctx.strokeStyle = "rgba(255, 215, 130, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    beads.forEach((b, i) => {
      const y = b.y + Math.sin(b.phase + (syncPulse * 4)) * 8;
      if (i === 0) ctx.moveTo(b.x, y);
      else ctx.lineTo(b.x, y);
    });
    ctx.stroke();

    // Draw the beads, pulsing brightness and radius to the frequency
    beads.forEach((b) => {
      const y = b.y + Math.sin(b.phase + (syncPulse * 4)) * 8;
      
      // The bead physically breathes with the 432Hz sine wave
      const dynamicR = b.baseR + (syncPulse * 3); 
      const safeR = Math.max(0.1, dynamicR); 

      const gradient = ctx.createRadialGradient(b.x, y, 0, b.x, y, safeR * 2);
      
      // Core flashes slightly brighter when the wave hits a peak
      const alphaCore = 0.85 + (syncPulse * 0.15); 
      
      gradient.addColorStop(0, `rgba(255, 230, 180, ${alphaCore})`);
      gradient.addColorStop(0.4, "rgba(255, 200, 120, 0.7)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, y, safeR * 2, 0, Math.PI * 2);
      ctx.fill();

      b.phase += b.speed;
      b.x += 0.15;
      if (b.x > rect.width + 20) b.x = -20;
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
