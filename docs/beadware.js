(function() {
  const canvas = document.getElementById("beadware-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const beads = Array.from({length: 40}, () => ({
    x: Math.random() * window.innerWidth, y: 50 + Math.random() * 50,
    baseR: 3 + Math.random() * 4, phase: Math.random() * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.02
  }));

  function draw() {
    const sync = window.sweetgrass ? window.sweetgrass.getSyncData() : 0;
    const inv = window.sweetgrass ? window.sweetgrass.isInverted : false;
    const lvl = (window.xp && window.xp.level) || 1;
    const factor = 1 + (lvl - 1) * 0.15;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    beads.forEach(b => {
      const y = b.y + Math.sin(b.phase + (sync * 4)) * (8 * factor);
      ctx.fillStyle = inv ? `rgba(0, 255, 255, 0.8)` : `rgba(255, 215, 130, 0.8)`;
      ctx.beginPath();
      ctx.arc(b.x, y, (b.baseR + sync * 3) * factor, 0, Math.PI * 2);
      ctx.fill();
      b.phase += b.speed * factor;
      b.x += 0.15 * factor;
      if (b.x > canvas.width) b.x = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
