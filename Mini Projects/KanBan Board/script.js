let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];

let dragElement = null;
let editingTask = null; // গ্লোবাল ভেরিয়েবল: বর্তমানে এডিট হওয়া টাস্ক

// ---------------------------------------------
// Core Functions
// ---------------------------------------------

// Add New Task (Edit বাটন সহ আপডেট করা হয়েছে)
function addTask(title, description, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <div class="task-actions">
            <button class="edit-btn">Edit</button> 
            <button class="delete-btn">Delete</button>
        </div>
    `;

  column.appendChild(div);
  return div;
}

// Get tasks and Save to LocalStorage
function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").textContent,
        description: t.querySelector("p").textContent,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
    count.textContent = tasks.length;
  });
}

// Load Tasks from LocalStorage
function loadTasks() {
  if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
      const column = document.querySelector(`#${col}`);
      data[col].forEach((task) => {
        addTask(task.title, task.description, column);
      });
    }
  }
  updateTaskCount();
}
loadTasks();

// ---------------------------------------------
// Drag-and-Drop Functions
// ---------------------------------------------

// Dragover-এর সময় সঠিক ড্রপ পজিশন খুঁজে বের করা
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task:not(.is-dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: -Infinity }
  ).element;
}

// Column Drag Events
function setupDragEventsOnColumn(column) {
  // dragover: যখন টাস্কটি কলামের উপর দিয়ে টানা হয়
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(column, e.clientY);

    if (dragElement) {
      if (afterElement == null) {
        column.appendChild(dragElement);
      } else {
        column.insertBefore(dragElement, afterElement);
      }
    }
  });

  // dragenter
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  // dragleave
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();

    const rect = column.getBoundingClientRect();

    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      column.classList.remove("hover-over");
    }
  });

  // drop
  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
    updateTaskCount();
  });
}

columns.forEach(setupDragEventsOnColumn);

// ---------------------------------------------
// Event Delegation for Task Events (Delete & Drag, Edit)
// ---------------------------------------------

columns.forEach((col) => {
  col.addEventListener("click", (e) => {
    const target = e.target;

    // Delete লজিক
    if (target.classList.contains("delete-btn")) {
      const task = target.closest(".task");
      if (task) {
        task.remove();
        updateTaskCount();
      }
    }

    // Edit লজিক (নতুন)
    if (target.classList.contains("edit-btn")) {
      editingTask = target.closest(".task");

      // বর্তমান ডেটা ইনপুট ফিল্ডে লোড করা
      const title = editingTask.querySelector("h2").textContent;
      const description = editingTask.querySelector("p").textContent;

      taskTitleInput.value = title;
      taskDescriptionInput.value = description;

      // মোডাল চালু করা এবং এডিট মোড সেট করা
      toggleTaskModal(true, "Edit Task", "Save Changes");
    }
  });

  col.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task")) {
      dragElement = e.target;
      setTimeout(() => {
        dragElement.classList.add("is-dragging");
      }, 0);
    }
  });

  col.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("task")) {
      e.target.classList.remove("is-dragging");
      dragElement = null;
      columns.forEach((c) => c.classList.remove("hover-over"));
    }
  });
});

// ---------------------------------------------
// Modal Events
// ---------------------------------------------

const toggleModalBtn = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskBtn = document.querySelector("#add-new-task");
const taskTitleInput = modal.querySelector("#task-title-input");
const taskDescriptionInput = modal.querySelector("#task-description-input");

// মোডালের হেডিং ও বাটনের টেক্সট পরিবর্তন করার জন্য নতুন ফাংশন
function toggleTaskModal(
  isEditing = false,
  title = "Add New Task",
  buttonText = "Add Task"
) {
  modal.classList.add("active");
  modal.querySelector(".center h2")?.remove(); // যদি আগের কোনো হেডিং থাকে, তা মুছে ফেলা

  // মোডালে নতুন হেডিং যোগ করা
  const h2 = document.createElement("h2");
  h2.textContent = title;
  modal.querySelector(".center").prepend(h2);

  // বাটনের লেখা পরিবর্তন
  addTaskBtn.textContent = buttonText;

  // বাটনে মোড ডেটা সেট করা
  addTaskBtn.dataset.mode = isEditing ? "edit" : "add";
}

toggleModalBtn.addEventListener("click", () => {
  // Add মোডে মোডাল চালু করা
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  toggleTaskModal(false, "Add New Task", "Add Task");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
  editingTask = null; // এডিট মোড থেকে বের হলে রিসেট
});

// Add/Edit Task from Modal (পরিবর্তন করা হয়েছে)
addTaskBtn.addEventListener("click", () => {
  const mode = addTaskBtn.dataset.mode || "add";
  const taskTitle = taskTitleInput.value.trim();
  const taskDescription = taskDescriptionInput.value.trim();

  if (!taskTitle) {
    alert("Task Title cannot be empty!");
    return;
  }

  if (mode === "add") {
    // নতুন টাস্ক যোগ করা
    addTask(taskTitle, taskDescription, todo);
  } else if (mode === "edit" && editingTask) {
    // টাস্ক এডিট করা
    editingTask.querySelector("h2").textContent = taskTitle;
    editingTask.querySelector("p").textContent = taskDescription;
    editingTask = null; // এডিটিং শেষ, ভেরিয়েবল রিসেট
  }

  updateTaskCount();
  modal.classList.remove("active");

  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
});
