async function loadTasks() {
  try {
    const res = await fetch("tasks.json");
    const tasks = await res.json();

    const container = document.getElementById("task-container");
    container.innerHTML = "";

    tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task";
      div.textContent = task.title;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

loadTasks();
