const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  taskBox = document.querySelector(".task-box");

let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list")) || [];

const dataList = document.createElement("datalist");
dataList.id = "taskList";
taskInput.setAttribute("list", "taskList");
document.body.appendChild(dataList);

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo();
  });
});

function showMenu(element) {
  console.log("Menu icon clicked");
  let taskMenu = element.nextElementSibling;

  document.querySelectorAll(".task-menu").forEach((menu) => {
    if (menu !== taskMenu) menu.classList.remove("show");
  });

  taskMenu.classList.toggle("show");
}

function showTodo() {
  let liTag = "";
  const filter = document.querySelector("span.active").id;
  todos.forEach((todo, id) => {
    let completed = todo.status === "completed" ? "checked" : "";
    if (filter === "all" || filter === todo.status) {
      liTag += `<li class="task">
              <label for="${id}">
                  <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                  <p class="${completed}">${todo.name}</p>
              </label>
              <div class="settings">
                  <i class="uil uil-ellipsis-h"></i> <!-- Settings icon -->
                  <ul class="task-menu">
                      <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                      <li onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</li>
                  </ul>
              </div>
          </li>`;
    }
  });
  taskBox.innerHTML = liTag || `<span>You don't have any tasks here</span>`;
  updateDataList();
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
    new Audio("/audio/task-completed.mp3").play();
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
}

function deleteTask(deleteId) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
}

function adjustTaskBoxHeight() {
  const taskCount = taskBox.querySelectorAll(".task").length;
  if (taskCount <= 5) {
    taskBox.style.height = "auto";
  } else {
    taskBox.style.height = "80vh";
  }
}

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key === "Enter" && userTask) {
    if (!isEditTask) {
      todos.push({ name: userTask, status: "pending" });
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
  }
});

taskBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("uil-ellipsis-h")) {
    showMenu(e.target);
  }
});

showTodo();
