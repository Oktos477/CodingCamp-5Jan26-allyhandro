const form = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");

let todos = [];
let sortKey = 'index';
let sortAsc = true;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const task = todoInput.value.trim();
  const date = dateInput.value;

  // Input validation
  if (task === "" || date === "") {
    alert("Please fill in all fields!");
    return;
  }

  const id = Date.now();
  todos.push({ id, task, date });
  renderTodos();

  todoInput.value = "";
  dateInput.value = "";
});

function renderTodos() {
  todoList.innerHTML = "";

  // create a shallow copy and sort according to current settings
  const display = [...todos];
  if (sortKey === 'task') {
    display.sort((a, b) => {
      const A = a.task.toLowerCase();
      const B = b.task.toLowerCase();
      return (A > B ? 1 : A < B ? -1 : 0) * (sortAsc ? 1 : -1);
    });
  } else if (sortKey === 'date') {
    display.sort((a, b) => (new Date(a.date) - new Date(b.date)) * (sortAsc ? 1 : -1));
  } else if (sortKey === 'index') {
    display.sort((a, b) => (a.id - b.id) * (sortAsc ? 1 : -1));
  }

  display.forEach((todo, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>
        <button class="delete-btn" onclick="deleteTodoById(${todo.id})">
          Delete
        </button>
      </td>
    `;

    todoList.appendChild(row);
  });

  // update header sort indicators
  document.querySelectorAll('th.sortable').forEach(th => {
    th.classList.remove('asc', 'desc');
    if (th.dataset.key === sortKey) th.classList.add(sortAsc ? 'asc' : 'desc');
  });
}

function deleteTodoById(id) {
  const idx = todos.findIndex(t => t.id === id);
  if (idx > -1) {
    todos.splice(idx, 1);
    renderTodos();
  }
}

// attach sort handlers to headers
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortKey === key) sortAsc = !sortAsc; else { sortKey = key; sortAsc = true; }
      renderTodos();
    });
  });
});
