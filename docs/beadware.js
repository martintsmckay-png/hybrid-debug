(function() {
  const canvas = document.getElementById("beadware-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const beads = Array.from({length: 40}, () => ({
    x: Math.random() * window.innerWidth, y: 50 + Math.random() * 50,
    baseR: 5, phase: Math.random() * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.02, rotation: 0
  }));

  function drawSkin(ctx, b, x, y, r, inv, lvl) {
    const skinType = lvl >= 7 ? "crystal" : (lvl >= 4 ? "flux" : "orb");
    ctx.save();
    ctx.translate(x, y);
    
    if (skinType === "crystal") {
      ctx.rotate(b.rotation += 0.05);
      ctx.strokeStyle = inv ? "#00FFFF" : "#FFD782";
      ctx.beginPath();
      for(let i=0; i<6; i++) {
        ctx.lineTo(Math.cos(i*Math.PI/3)*r, Math.sin(i*Math.PI/3)*r);
      }
      ctx.closePath(); ctx.stroke();
    } else if (skinType === "flux") {
      ctx.fillStyle = inv ? "rgba(0, 255, 255, 0.4)" : "rgba(255, 215, 130, 0.4)";
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.fillStyle = inv ? "#00FFFF" : "#FFD782";
    ctx.beginPath();
    ctx.arc(0, 0, r/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    const sync = window.sweetgrass ? window.sweetgrass.getSyncData() : 0;
    const inv = window.sweetgrass ? window.sweetgrass.isInverted : false;
    const lvl = (window.xp && window.xp.level) || 1;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    beads.forEach(b => {
      const y = b.y + Math.sin(b.phase + (sync * 4)) * (8 * (1 + (lvl-1)*0.1));
      drawSkin(ctx, b, b.x, y, (b.baseR + sync * 3), inv, lvl);
      b.phase += b.speed;
      b.x += 0.2;
      if (b.x > canvas.width) b.x = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
