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
