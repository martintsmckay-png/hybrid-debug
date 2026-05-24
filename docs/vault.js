// ======================================================
// FROZEN VAULT PANEL SYSTEM
// ======================================================
// Panels:
// 1. Harvest Target
// 2. Sublimation Vector
// 3. Resonance Mode
// Includes:
// - Funny sound effects
// - Frosted glass UI
// - Integration with sweetgrass (432/216Hz)
// ======================================================

// ------------------------------------------------------
// FUNNY SOUND ENGINE
// ------------------------------------------------------
function playFunnySound(type) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  gain.gain.value = 0.2;

  osc.connect(gain);
  gain.connect(ctx.destination);

  const freqMap = {
    ghost: 620,      // bo
cd ~/hybrid-debug || { echo "❌ Repo not found at ~/hybrid-debug"; exit; }

mkdir -p docs

# ======================================================
# FROZEN VAULT PANELS + FUNNY SOUND ENGINE
# ======================================================
cat > docs/vault.js << 'EOF'
// ======================================================
// FROZEN VAULT PANEL SYSTEM
// ======================================================
// Panels:
// 1. Harvest Target
// 2. Sublimation Vector
// 3. Resonance Mode
// Includes:
// - Funny sound effects
// - Frosted glass UI
// - Integration with sweetgrass (432/216Hz)
// ======================================================

// ------------------------------------------------------
// FUNNY SOUND ENGINE
// ------------------------------------------------------
function playFunnySound(type) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  gain.gain.value = 0.2;

  osc.connect(gain);
  gain.connect(ctx.destination);

  const freqMap = {
    ghost: 620,      // boing-boing
    crystal: 120,    // crunch
    l2: 880,         // ding-ding
    void: 40,        // whomp
    f432: 432,       // chant
    f216: 216        // freeze
  };

  osc.frequency.value = freqMap[type] || 300;
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// ------------------------------------------------------
// PANEL CREATION HELPER
// ------------------------------------------------------
function createPanel(title) {
  const panel = document.createElement("div");
  panel.className = "frozen-panel";
  panel.style.cssText = `
    position: fixed;
    right: 20px;
    top: 20px;
    padding: 15px;
    border-radius: 12px;
    background: rgba(180, 220, 255, 0.12);
    border: 1px solid rgba(200, 240, 255, 0.25);
    backdrop-filter: blur(12px) brightness(1.2);
    box-shadow: 0 0 12px rgba(120, 200, 255, 0.2);
    font-family: monospace;
    margin-bottom: 12px;
    z-index: 9999;
  `;

  const header = document.createElement("div");
  header.innerText = title;
  header.style.cssText = `
    font-weight: bold;
    margin-bottom: 10px;
    color: #dff;
  `;
  panel.appendChild(header);

  return panel;
}

// ------------------------------------------------------
// BUTTON CREATION
// ------------------------------------------------------
function createButton(label, color, soundType, onClick) {
  const btn = document.createElement("button");
  btn.innerText = label;
  btn.style.cssText = `
    margin: 6px 0;
    padding: 8px 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid ${color};
    color: ${color};
    cursor: pointer;
    border-radius: 6px;
    width: 100%;
  `;
  btn.addEventListener("click", () => {
    playFunnySound(soundType);
    onClick();
  });
  return btn;
}

// ------------------------------------------------------
// PANEL 1: HARVEST TARGET
// ------------------------------------------------------
const harvestPanel = createPanel("❄️ Harvest Target");

harvestPanel.appendChild(
  createButton("🛍️ Reanimate Liquidity Ghosts", "#FFD782", "ghost", () => {
    console.log("[Vault] Liquidity Ghosts selected.");
  })
);

harvestPanel.appendChild(
  createButton("🫙 Shatter Debt Crystals", "#FFAAAA", "crystal", () => {
    console.log("[Vault] Debt Crystals selected.");
  })
);

document.body.appendChild(harvestPanel);

// ------------------------------------------------------
// PANEL 2: SUBLIMATION VECTOR
// ------------------------------------------------------
const vectorPanel = createPanel("🧊 Sublimation Vector");
vectorPanel.style.top = "180px";

vectorPanel.appendChild(
  createButton("L2: Ethereal Ledger", "#AAFFEE", "l2", () => {
    console.log("[Vault] Sublimation → Layer 2");
  })
);

vectorPanel.appendChild(
  createButton("Deep Cold-Storage Void", "#88CCFF", "void", () => {
    console.log("[Vault] Sublimation → The Void");
  })
);

document.body.appendChild(vectorPanel);

// ------------------------------------------------------
// PANEL 3: RESONANCE MODE
// ------------------------------------------------------
const resonancePanel = createPanel("🔮 Resonance Mode");
resonancePanel.style.top = "340px";

resonancePanel.appendChild(
  createButton("432Hz Harmonize", "#FFD782", "f432", () => {
    if (window.sweetgrass) window.sweetgrass.toggleInversion(false);
    console.log("[Vault] Resonance → 432Hz");
  })
);

resonancePanel.appendChild(
  createButton("216Hz Freeze-Lock", "#00FFFF", "f216", () => {
    if (window.sweetgrass) window.sweetgrass.toggleInversion(true);
    console.log("[Vault] Resonance → 216Hz");
  })
);

document.body.appendChild(resonancePanel);

