import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string,
  title: string,
  completed: boolean,
  createdAt: Date,
}

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.querySelector<HTMLFormElement>('#task-form');
const input = document.querySelector<HTMLInputElement>('#task-input');

const tasks: Task[] = loadTasks();

tasks.forEach(addListItem);

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input?.value == '' || input?.value == null) return;

  const task: Task = {
    id: uuidv4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(task);
  saveTasks();

  addListItem(task);

  input.value = '';
})

function addListItem(task: Task) {
  const item = document.createElement('li');
  item.classList.add('task-item');

  if (task.completed) {
    item.classList.add('completed');
  }

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();

    if (checkbox.checked) {
      item.classList.add('completed');
    } else {
      item.classList.remove('completed');
    }
  });
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.addEventListener('click', () => {
    deleteTask(task.id);
    item.remove();
  });

  item.append(label, deleteButton);
  list?.append(item);
}

function deleteTask(taskId: string) {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex > -1) {
    tasks.splice(taskIndex, 1);
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem('tasks');
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}
