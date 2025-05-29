const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Add task on Enter key press
inputBox.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const task = inputBox.value.trim();
  if (!task) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <div class="task-content">
      <label>
        <input type="checkbox">
      </label>
      <input type="text" class="task-input" value="${task}" readonly>
    </div>
    <div class="task-actions">
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">❌</button>
    </div>
  `;

  const checkbox = li.querySelector("input[type='checkbox']");
  const taskInput = li.querySelector(".task-input");
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");

  // Checkbox event
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasks();
  });

  // Edit functionality - inline editing
  editBtn.addEventListener("click", function () {
    if (taskInput.readOnly) {
      taskInput.readOnly = false;
      taskInput.focus();
      taskInput.select();
      editBtn.textContent = "💾"; // Save icon
    } else {
      taskInput.readOnly = true;
      editBtn.textContent = "✏️"; // Edit icon
      checkbox.checked = false;
      li.classList.remove("completed");
      updateCounters();
      saveTasks();
    }
  });

  // Save on Enter key while editing
  taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      taskInput.readOnly = true;
      editBtn.textContent = "✏️";
      saveTasks();
    }
  });

  // Delete functionality
  deleteBtn.addEventListener("click", function () {
    li.remove();
    updateCounters();
    saveTasks();
  });

  listContainer.appendChild(li);
  inputBox.value = "";
  updateCounters();
  saveTasks();
}

const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function updateCounters() {
  const completedTasks = document.querySelectorAll("li.completed").length;
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;
  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

new Sortable(listContainer, {
  animation: 150,
  ghostClass: 'dragging',
});

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    const taskInput = li.querySelector(".task-input");
    const checkbox = li.querySelector("input[type='checkbox']");
    tasks.push({
      text: taskInput.value,
      completed: checkbox.checked
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(taskData => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="task-content">
        <label>
          <input type="checkbox" ${taskData.completed ? 'checked' : ''}>
        </label>
        <input type="text" class="task-input" value="${taskData.text}" readonly>
      </div>
      <div class="task-actions">
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">❌</button>
      </div>
    `;
    if (taskData.completed) li.classList.add('completed');

    const checkbox = li.querySelector("input[type='checkbox']");
    const taskInput = li.querySelector(".task-input");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    checkbox.addEventListener("click", function () {
      li.classList.toggle("completed", checkbox.checked);
      updateCounters();
      saveTasks();
    });

    editBtn.addEventListener("click", function () {
      if (taskInput.readOnly) {
        taskInput.readOnly = false;
        taskInput.focus();
        taskInput.select();
        editBtn.textContent = "💾";
      } else {
        taskInput.readOnly = true;
        editBtn.textContent = "✏️";
        checkbox.checked = false;
        li.classList.remove("completed");
        updateCounters();
        saveTasks();
      }
    });

    taskInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        taskInput.readOnly = true;
        editBtn.textContent = "✏️";
        saveTasks();
      }
    });

    deleteBtn.addEventListener("click", function () {
      li.remove();
      updateCounters();
      saveTasks();
    });

    listContainer.appendChild(li);
  });
  updateCounters();
}

window.addEventListener("load", loadTasks);
