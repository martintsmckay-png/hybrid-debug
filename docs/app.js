let tasks = [];
let xp = { points: 0, level: 1 };

async function loadTasks() {
  try {
    const res = await fetch("tasks.json");
    tasks = await res.json();
    renderTasks();
    updateNarrative("System stable. Tasks loaded.");
  } catch (err) {
    console.error("Error loading tasks:", err);
    updateNarrative("Error loading tasks. Check JSON.");
  }
}

// --- TASK EDITOR (CRUD) ---

function addTask(title) {
  if (!title.trim()) return;
  tasks.push({ title, completed: false });
  renderTasks();
  updateNarrative(`Task added: "${title}"`);
}

function deleteTask(index) {
  const [removed] = tasks.splice(index, 1);
  renderTasks();
  updateNarrative(`Task removed: "${removed?.title || "Unknown"}"`);
}

function toggleComplete(index) {
  const task = tasks[index];
  if (!task) return;
  task.completed = !task.completed;
  if (task.completed) {
    gainXP(10);
    updateNarrative(`Task completed: "${task.title}" (+10 XP)`);
  } else {
    updateNarrative(`Task marked incomplete: "${task.title}"`);
  }
  renderTasks();
}

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
}

// --- INIT ---

setupEditor();
renderXP();
loadTasks();
