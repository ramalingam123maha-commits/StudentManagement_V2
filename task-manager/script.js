// Task Manager - add & delete tasks by priority
// Tasks are persisted to localStorage so they survive page reloads.

const STORAGE_KEY = 'taskManager.tasks';

// Priority sort order: high first, then medium, then low.
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const inputError = document.getElementById('inputError');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const filterBar = document.getElementById('filterBar');

// App state
let tasks = loadTasks();
let currentFilter = 'all';

// ---- Persistence ----
function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---- Add task ----
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();

    if (!text) {
        showInputError('Please enter a task description.');
        return;
    }

    tasks.push({
        id: Date.now().toString(),
        text,
        priority: prioritySelect.value,
        completed: false
    });

    saveTasks();
    render();

    taskForm.reset();
    prioritySelect.value = 'medium';
    taskInput.focus();
});

taskInput.addEventListener('input', clearInputError);

function showInputError(message) {
    inputError.textContent = message;
    inputError.classList.add('show');
}

function clearInputError() {
    inputError.textContent = '';
    inputError.classList.remove('show');
}

// ---- Filters (event delegation) ----
filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
    });
    render();
});

// ---- Task actions (event delegation) ----
taskList.addEventListener('click', (e) => {
    const item = e.target.closest('.task-item');
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.matches('.delete-btn')) {
        deleteTask(id);
    } else if (e.target.matches('.task-checkbox')) {
        toggleTask(id);
    }
});

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
}

function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        render();
    }
}

// ---- Render ----
function render() {
    // Filter
    const visible = tasks.filter(
        (t) => currentFilter === 'all' || t.priority === currentFilter
    );

    // Sort by priority (high -> low), keeping completed tasks at the bottom.
    visible.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });

    taskList.innerHTML = '';

    visible.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority}${task.completed ? ' completed' : ''}`;
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Mark task complete');

        const content = document.createElement('div');
        content.className = 'task-content';

        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text; // textContent prevents HTML/script injection

        const badge = document.createElement('span');
        badge.className = `priority-badge ${task.priority}`;
        badge.textContent = task.priority;

        content.appendChild(text);
        content.appendChild(badge);

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    // Empty state + count
    emptyState.classList.toggle('hidden', visible.length > 0);
    const total = tasks.length;
    taskCount.textContent = `${total} ${total === 1 ? 'task' : 'tasks'}`;
}

render();
