const taskInput = document.querySelector(".task-input input"),
      filters = document.querySelectorAll(".filters span"),
      clearAll = document.querySelector(".clear-btn"),
      taskBox = document.querySelector(".task-box");
let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list")) || [];

const dataList = document.createElement("datalist");
dataList.id = "taskList";
taskInput.setAttribute("list", "taskList");
document.body.appendChild(dataList);

function updateDataList() {
    dataList.innerHTML = '';
    todos.forEach(todo => {
        let option = document.createElement("option");
        option.value = todo.name;
        dataList.appendChild(option);
    });
}

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = "";
    todos.forEach((todo, id) => {
        let completed = todo.status === "completed" ? "checked" : "";
        if (filter === todo.status || filter === "all") {
            liTag += `<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                    <p class="${completed}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                        <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`;
        }
    });
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    updateDataList();
}
showTodo("all");

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
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

function deleteTask(deleteId, filter) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    todos = [];
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});

taskInput.addEventListener("keyup", e => {
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
        showTodo(document.querySelector("span.active").id);
    }
});
