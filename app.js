const body = document.querySelector("body");
const backgroundImage = document.querySelector(".background-image");
const todoList = document.querySelector(".todo-main__list");
const todoForm = document.querySelector("form");
let todos = JSON.parse(localStorage.getItem("todoList")) || [];
body.dataset.theme = localStorage.getItem("theme") || "dark";
backgroundImage.src = `images/bg-desktop-${body.dataset.theme}.jpg`;

const filters = {
  all: () => false,
  active: (checked) => checked,
  completed: (checked) => !checked,
};
let isFiltered = filters.all;

const addTodo = (title, checkmark) => {
  if (todoExists(title)) return;
  const todoObject = { title, checkmark };

  todos.push(todoObject);
  renderTodo(todoObject);
  updateData();
};

const getTodo = (todoNode) => {
  const todoTitle = todoNode
    .querySelector(".todo-list__todo-title")
    .innerText.trim();

  const todoIndex = todos.findIndex((todo) => todo.title === todoTitle);
  return todos[todoIndex];
};

const removeTodo = (todoNode) => {
  const todoItem = getTodo(todoNode);

  todos = todos.filter((todo) => todo !== todoItem);
  todoNode.remove();
  updateData();
};

const todoExists = (title) => {
  return todos.some((todo) => todo.title === title);
};

const toggleCheckmark = (todoNode) => {
  const todoCheckbox = todoNode.querySelector("input[type='checkbox']");
  const todo = getTodo(todoNode);

  todoNode.classList.toggle("checked");
  todoCheckbox.toggleAttribute("checked");
  todo.checkmark = !todo.checkmark;

  updateData();
  toggleVisibility(todoNode, todo.checkmark);
};

const updateData = () => {
  localStorage.setItem("todoList", JSON.stringify(todos));
  updateItemsCount();
};

const generateTodoHtml = (todo) => {
  return `
    <div class="${todo.checkmark ? "todo-item checked" : "todo-item"} ${isFiltered(todo.checkmark) ? "hidden" : ""}">
      <input type="checkbox" ${todo.checkmark ? "checked" : ""} onchange=toggleCheckmark(this.parentNode)>
      <p class="todo-list__todo-title">
        ${todo.title}
      </p>
      <button class="interface-icon" onclick=removeTodo(this.parentNode)>
        <img src="images/icon-cross.svg" />
      </button>
    </div>
  `;
};

const renderTodo = (todo) => {
  const todoHtml = generateTodoHtml(todo);
  todoList.innerHTML += todoHtml;
};

const updateItemsCount = () => {
  const itemsLabel = document.querySelector("#items-count");
  const itemsLeft = todos.filter((todoObject) => todoObject.checkmark !== true);

  itemsLabel.innerText = `${itemsLeft.length} items left`;
};

const toggleVisibility = (todoNode, checkmark) => {
  if (isFiltered(checkmark)) {
    todoNode.classList.add("hidden");
  } else {
    todoNode.classList.remove("hidden");
  }
};

const changeFilter = (filter) => {
  const todoItems = document.querySelector(".todo-main__list").children;
  const activeFilter = document.querySelector(".active");
  const filterName = filter.innerText.toLowerCase();
  isFiltered = filters[filterName];

  for (const [_, todoNode] of Object.entries(todoItems)) {
    const todo = getTodo(todoNode);
    toggleVisibility(todoNode, todo.checkmark);
  }

  activeFilter.classList.remove("active");
  filter.classList.add("active");
};

const clearCompleted = () => {
  const todoItems = todoList.children;

  for (const [_, todoNode] of Object.entries(todoItems)) {
    const todo = getTodo(todoNode);
    if (todo.checkmark) removeTodo(todoNode);
  }
};

const toggleTheme = () => {
  const currentTheme = body.dataset.theme;
  
  body.dataset.theme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", body.dataset.theme);
  backgroundImage.src = `images/bg-desktop-${body.dataset.theme}.jpg`;
};

todoForm.onsubmit = (event) => {
  event.preventDefault();
  const todoTitle = document.querySelector("#todo-title").value;
  const todoCheckmark = document.querySelector("#todo-checkmark").checked;

  addTodo(todoTitle, todoCheckmark);
};

// Lifecycle
todos.forEach((todo) => {
  renderTodo(todo);
  updateItemsCount();
});
