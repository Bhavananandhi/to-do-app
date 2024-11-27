// Function to add a task
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: taskText }),
        });

        if (!response.ok) {
            throw new Error("Failed to add task");
        }

        const data = await response.json();
        if (data.message === 'Task added') {
            addTaskToDOM({ id: data.task.id, content: taskText });
            taskInput.value = ''; // Clear input field
        }
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Unable to add task. Please try again.");
    }
}

// Function to dynamically render a single task in the DOM
function renderTask(task) {
    return `
        <li id="task-${task.id}">
            ${task.content}
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="editTask(${task.id})">Edit</button>
        </li>`;
}

// Add task to DOM without reloading
function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    li.id = `task-${task.id}`;
    li.innerHTML = `
        ${task.content}
        <button onclick="deleteTask(${task.id})">Delete</button>
        <button onclick="editTask(${task.id})">Edit</button>
    `;
    taskList.appendChild(li);
}

// Function to load tasks from the server
async function loadTasks() {
    try {
        const response = await fetch('/tasks');
        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        const tasks = await response.json();
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ''; // Clear existing tasks

        tasks.forEach((task) => {
            taskList.innerHTML += renderTask(task); // Add tasks dynamically
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
        alert("Unable to load tasks. Please try again.");
    }
}

// Function to delete a task
function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
            loadTasks(); // Reload tasks after deletion
        })
        .catch((error) => console.error('Error:', error));
}
// Function to edit a task

function editTask(taskId) {
    const newContent = prompt("Edit your task:");
    if (newContent) {
        fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newContent }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                loadTasks(); // Reload tasks after editing
            })
            .catch((error) => console.error('Error:', error));
    }
}


// Load tasks when the page loads
window.onload = loadTasks;
