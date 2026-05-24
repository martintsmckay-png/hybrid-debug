(function () {
  const canvas = document.getElementById("beadware-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  const beads = [];
  const beadCount = 40;

  for (let i = 0; i < beadCount; i++) {
    beads.push({
      x: (i / beadCount) * window.innerWidth,
      y: 40 + Math.random() * 60,
      baseR: 3 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02
    });
  }

  function getXPLevelFactor() {
    // xp is defined in app.js; in browser globals it's accessible via window.xp
    const level = (window.xp && window.xp.level) || 1;
    // Level 1 = 1.0, Level 2 = 1.15, Level 3 = 1.30, etc.
    return 1 + (level - 1) * 0.15;
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const syncPulse = window.sweetgrass ? window.sweetgrass.getSyncData() : 0;
    const isInverted = window.sweetgrass ? window.sweetgrass.isInverted : false;
    const levelFactor = getXPLevelFactor();

    // Thread color
    ctx.strokeStyle = isInverted
      ? "rgba(0, 255, 255, 0.3)"
      : "rgba(255, 215, 130, 0.25)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    beads.forEach((b, i) => {
      const y =
        b.y +
        Math.sin(b.phase + syncPulse * 4) * 8 * levelFactor; // XP boosts wave amplitude
      if (i === 0) ctx.moveTo(b.x, y);
      else ctx.lineTo(b.x, y);
    });
    ctx.stroke();

    beads.forEach((b) => {
      const pulseImpact = isInverted ? -(syncPulse * 4) : syncPulse * 4;
      const y =
        b.y +
        Math.sin(b.phase + pulseImpact) * 8 * levelFactor; // XP affects bead wobble

      const dynamicR = b.baseR + syncPulse * 3 * levelFactor;
      const safeR = Math.max(0.5, dynamicR);
      const alphaCore = 0.85 + syncPulse * 0.15;

      const gradient = ctx.createRadialGradient(
        b.x,
        y,
        0,
        b.x,
        y,
        safeR * 2
      );

      if (isInverted) {
        gradient.addColorStop(0, `rgba(0, 255, 255, ${alphaCore})`);
        gradient.addColorStop(0.4, "rgba(0, 100, 255, 0.7)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        gradient.addColorStop(0, `rgba(255, 230, 180, ${alphaCore})`);
        gradient.addColorStop(0.4, "rgba(255, 200, 120, 0.7)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, y, safeR * 2, 0, Math.PI * 2);
      ctx.fill();

      b.phase += b.speed * levelFactor; // XP speeds up phase drift
      b.x += 0.15 * levelFactor;        // XP speeds horizontal drift
      if (b.x > rect.width + 20) b.x = -20;
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
