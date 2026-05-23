const STORAGE_KEY_TASKS = "hybrid_debug_tasks";
const STORAGE_KEY_XP    = "hybrid_debug_xp";
const STORAGE_KEY_UNDO  = "hybrid_debug_undo";

let tasks = [];
let xp = { points: 0, level: 1 };
let undoStack = [];

// --- PERSISTENCE ---

function saveState() {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  localStorage.setItem(STORAGE_KEY_XP, JSON.stringify(xp));
}

function loadState() {
  const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
  const savedXP    = localStorage.getItem(STORAGE_KEY_XP);

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  if (savedXP) {
    xp = JSON.parse(savedXP);
  }
}

// --- UNDO (single-step) ---

function snapshotForUndo() {
  const snapshot = {
    tasks: JSON.stringify(tasks),
    xp: JSON.stringify(xp),
  };
  localStorage.setItem(STORAGE_KEY_UNDO, JSON.stringify(snapshot));
}

function undoLast() {
  const raw = localStorage.getItem(STORAGE_KEY_UNDO);
  if (!raw) {
    updateNarrative("No undo snapshot available.");
    return;
  }
  try {
    const snapshot = JSON.parse(raw);
    tasks = JSON.parse(snapshot.tasks);
    xp    = JSON.parse(snapshot.xp);
    renderTasks();
    renderXP();
    saveState();
    updateNarrative("Undo applied. State restored.");
  } catch (e) {
    console.error("Undo failed:", e);
    updateNarrative("Undo failed. Snapshot corrupted.");
  }
}

// --- LOAD INITIAL DATA ---

async function loadTasks() {
  try {
    loadState();
    if (tasks.length === 0) {
      const res = await fetch("tasks.json");
      tasks = await res.json();
      updateNarrative("Seed tasks loaded. Persistence will remember changes.");
    } else {
      updateNarrative("Persistent state restored from storage.");
    }
    renderTasks();
  } catch (err) {
    console.error("Error loading tasks:", err);
    updateNarrative("Error loading tasks. Check JSON or storage.");
  }
}

// --- TASK EDITOR (CRUD) ---

function addTask(title) {
  if (!title.trim()) return;
  snapshotForUndo();
  tasks.push({ title, completed: false });
  renderTasks();
  saveState();
  updateNarrative(`Task added: "${title}"`);
}

function deleteTask(index) {
  if (!tasks[index]) return;
  snapshotForUndo();
  const [removed] = tasks.splice(index, 1);
  renderTasks();
  saveState();
  updateNarrative(`Task removed: "${removed?.title || "Unknown"}"`);
}

function toggleComplete(index) {
  const task = tasks[index];
  if (!task) return;
  snapshotForUndo();
  task.completed = !task.completed;
  if (task.completed) {
    gainXP(10);
    updateNarrative(`Task completed: "${task.title}" (+10 XP)`);
  } else {
    updateNarrative(`Task marked incomplete: "${task.title}"`);
  }
  renderTasks();
  saveState();
}

// --- RENDERING ---

function renderTasks() {
  const container = document.getElementById("task-container");
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";

    const span = document.createElement("span");
    span.textContent = task.title + (task.completed ? " ✅" : "");
    div.appendChild(span);

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.className = "complete-btn";
    completeBtn.onclick = () => toggleComplete(index);
    div.appendChild(completeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteTask(index);
    div.appendChild(deleteBtn);

    container.appendChild(div);
  });
}

// --- XP SYSTEM ---

function gainXP(amount) {
  xp.points += amount;
  while (xp.points >= xp.level * 50) {
    xp.points -= xp.level * 50;
    xp.level += 1;
    updateNarrative(`Level up! Now level ${xp.level}.`);
  }
  renderXP();
  saveState();
}

function renderXP() {
  document.getElementById("xp-level").textContent = `Level ${xp.level}`;
  document.getElementById("xp-points").textContent = `${xp.points} XP`;
}

// --- NARRATIVE LAYER ---

function updateNarrative(message) {
  const el = document.getElementById("narrative-text");
  if (!el) return;
  el.textContent = message;
}

// --- EVENT WIRING ---

function setupEditor() {
  const input = document.getElementById("new-task-input");
  const btn = document.getElementById("add-task-btn");

  btn.addEventListener("click", () => {
    addTask(input.value);
    input.value = "";
    input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask(input.value);
      input.value = "";
    }
  });

  // Simple keyboard undo: Ctrl+Z
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "z") {
      undoLast();
    }
  });
}

// --- DEBUG HELPER ---

window.debug = function () {
  return {
    threads: 3,
    frequency: 432,
    buffer: "sweetgrass",
    tasks,
    xp
  };
};

// --- INIT ---

setupEditor();
renderXP();
loadTasks();

// --- CYBER SHAMAN BEADWORKS (STARTER INGREDIENTS) ---

function initBeadworks() {
  const canvas = document.getElementById('beadware-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  
  // The 9 Main Virtues
  const virtues = [
    "Hope", "Faith", "Resolve", 
    "Joy", "Love", "Peace", 
    "Patience", "Acceptance", "Gratitude"
  ];
  
  let beads = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Seed the cyber-grid with virtue nodes
  for (let i = 0; i < 54; i++) { // 9 virtues * 6 sets
    beads.push({
      x: Math.random() * width,
      y: Math.random() * height,
      virtue: virtues[i % virtues.length],
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.4 + 0.1,
      color: `rgba(0, 255, 180, ${Math.random() * 0.5 + 0.2})` // Cyberpunk cyan/green
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    
    beads.forEach(bead => {
      // Drift mechanics
      bead.x += bead.speedX;
      bead.y += bead.speedY;
      
      // Infinite holocron loop (wrap around edges)
      if (bead.x > width) bead.x = 0;
      if (bead.x < 0) bead.x = width;
      if (bead.y > height) bead.y = 0;
      if (bead.y < 0) bead.y = height;
      
      // Draw the core bead
      ctx.beginPath();
      ctx.arc(bead.x, bead.y, bead.size, 0, Math.PI * 2);
      ctx.fillStyle = bead.color;
      ctx.fill();
      
      // Draw the floating virtue text (Ghost Mode)
      ctx.fillStyle = `rgba(120, 220, 255, ${bead.alpha})`;
      ctx.fillText(bead.virtue, bead.x, bead.y - 8);
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log("🧿 Beadworks loaded. Virtues flowing.");
}

// Boot the canvas slightly after the DOM settles
setTimeout(initBeadworks, 300);


// --- HOLY GHOST OFFLINE FILE SYSTEM ---
function initOfflineGhostFiles() {
  // 1. Inject the UI buttons dynamically
  const editorPanel = document.getElementById("task-editor");
  if (!editorPanel) return;

  const ghostPanel = document.createElement("section");
  ghostPanel.style.marginBottom = "15px";
  ghostPanel.innerHTML = `
    <button id="export-ghost-btn" style="background: #673ab7; color: white; padding: 6px 10px; border:none; border-radius:4px; margin-right: 5px; cursor: pointer; font-weight: bold;">💾 Export Ghost (.json)</button>
    <button id="import-ghost-btn" style="background: #009688; color: white; padding: 6px 10px; border:none; border-radius:4px; cursor: pointer; font-weight: bold;">📂 Resurrect Ghost</button>
    <input type="file" id="ghost-upload" accept=".json" style="display: none;" />
  `;
  
  editorPanel.parentNode.insertBefore(ghostPanel, editorPanel);

  // 2. Wire up the Export logic
  document.getElementById("export-ghost-btn").addEventListener("click", () => {
    const ghostData = { tasks, xp };
    const blob = new Blob([JSON.stringify(ghostData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `holy-ghost-state-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    updateNarrative("Ghost state physically manifested as an offline file. 💾");
  });

  // 3. Wire up the Import logic
  const uploadInput = document.getElementById("ghost-upload");
  document.getElementById("import-ghost-btn").addEventListener("click", () => uploadInput.click());

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const resurrected = JSON.parse(event.target.result);
        if (resurrected.tasks) tasks = resurrected.tasks;
        if (resurrected.xp) xp = resurrected.xp;
        
        saveState(); // Update localStorage with the resurrected data
        renderTasks();
        renderXP();
        updateNarrative("Ghost resurrected from offline file. 🧬");
      } catch (err) {
        console.error("Resurrection failed:", err);
        updateNarrative("Resurrection failed. Corrupt artifact.");
      }
    };
    reader.readAsText(file);
    uploadInput.value = ""; // Reset input
  });
}

// Boot the file system slightly after the DOM settles
setTimeout(initOfflineGhostFiles, 400);


// --- HOLY GHOST OFFLINE FILE SYSTEM ---
function initOfflineGhostFiles() {
  // 1. Inject the UI buttons dynamically
  const editorPanel = document.getElementById("task-editor");
  if (!editorPanel) return;

  const ghostPanel = document.createElement("section");
  ghostPanel.style.marginBottom = "15px";
  ghostPanel.innerHTML = `
    <button id="export-ghost-btn" style="background: #673ab7; color: white; padding: 6px 10px; border:none; border-radius:4px; margin-right: 5px; cursor: pointer; font-weight: bold;">💾 Export Ghost (.json)</button>
    <button id="import-ghost-btn" style="background: #009688; color: white; padding: 6px 10px; border:none; border-radius:4px; cursor: pointer; font-weight: bold;">📂 Resurrect Ghost</button>
    <input type="file" id="ghost-upload" accept=".json" style="display: none;" />
  `;
  
  editorPanel.parentNode.insertBefore(ghostPanel, editorPanel);

  // 2. Wire up the Export logic
  document.getElementById("export-ghost-btn").addEventListener("click", () => {
    const ghostData = { tasks, xp };
    const blob = new Blob([JSON.stringify(ghostData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `holy-ghost-state-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    updateNarrative("Ghost state physically manifested as an offline file. 💾");
  });

  // 3. Wire up the Import logic
  const uploadInput = document.getElementById("ghost-upload");
  document.getElementById("import-ghost-btn").addEventListener("click", () => uploadInput.click());

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const resurrected = JSON.parse(event.target.result);
        if (resurrected.tasks) tasks = resurrected.tasks;
        if (resurrected.xp) xp = resurrected.xp;
        
        saveState(); // Update localStorage with the resurrected data
        renderTasks();
        renderXP();
        updateNarrative("Ghost resurrected from offline file. 🧬");
      } catch (err) {
        console.error("Resurrection failed:", err);
        updateNarrative("Resurrection failed. Corrupt artifact.");
      }
    };
    reader.readAsText(file);
    uploadInput.value = ""; // Reset input
  });
}

// Boot the file system slightly after the DOM settles
setTimeout(initOfflineGhostFiles, 400);


// --- HOLY GHOST OFFLINE FILE SYSTEM ---
function initOfflineGhostFiles() {
  // 1. Inject the UI buttons dynamically
  const editorPanel = document.getElementById("task-editor");
  if (!editorPanel) return;

  const ghostPanel = document.createElement("section");
  ghostPanel.style.marginBottom = "15px";
  ghostPanel.innerHTML = `
    <button id="export-ghost-btn" style="background: #673ab7; color: white; padding: 6px 10px; border:none; border-radius:4px; margin-right: 5px; cursor: pointer; font-weight: bold;">💾 Export Ghost (.json)</button>
    <button id="import-ghost-btn" style="background: #009688; color: white; padding: 6px 10px; border:none; border-radius:4px; cursor: pointer; font-weight: bold;">📂 Resurrect Ghost</button>
    <input type="file" id="ghost-upload" accept=".json" style="display: none;" />
  `;
  
  editorPanel.parentNode.insertBefore(ghostPanel, editorPanel);

  // 2. Wire up the Export logic
  document.getElementById("export-ghost-btn").addEventListener("click", () => {
    const ghostData = { tasks, xp };
    const blob = new Blob([JSON.stringify(ghostData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `holy-ghost-state-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    updateNarrative("Ghost state physically manifested as an offline file. 💾");
  });

  // 3. Wire up the Import logic
  const uploadInput = document.getElementById("ghost-upload");
  document.getElementById("import-ghost-btn").addEventListener("click", () => uploadInput.click());

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const resurrected = JSON.parse(event.target.result);
        if (resurrected.tasks) tasks = resurrected.tasks;
        if (resurrected.xp) xp = resurrected.xp;
        
        saveState(); // Update localStorage with the resurrected data
        renderTasks();
        renderXP();
        updateNarrative("Ghost resurrected from offline file. 🧬");
      } catch (err) {
        console.error("Resurrection failed:", err);
        updateNarrative("Resurrection failed. Corrupt artifact.");
      }
    };
    reader.readAsText(file);
    uploadInput.value = ""; // Reset input
  });
}

// Boot the file system slightly after the DOM settles
setTimeout(initOfflineGhostFiles, 400);

