// Add task to backend
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value;
    if (taskText.trim() !== "") {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: taskText }),
        });
        const data = await response.json();
        if (data.message === 'Task added') {
            const taskList = document.getElementById('taskList');
            const li = document.createElement('li');
            li.innerText = taskText;
            taskList.appendChild(li);
            taskInput.value = '';  // Clear input field
        }
    }
}
