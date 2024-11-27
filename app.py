from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# In-memory task list (for simplicity)
tasks = []
task_id_counter = 1  # Counter to generate unique task IDs

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def tasks_endpoint():
    global tasks, task_id_counter

    if request.method == 'POST':
        task_content = request.json.get('task')  # Fetch task content from request
        if task_content:
            new_task = {
                "id": task_id_counter,  # Assign a unique ID to the task
                "content": task_content
            }
            tasks.append(new_task)
            task_id_counter += 1
            return jsonify({'message': 'Task added', 'task': new_task}), 201

    return jsonify(tasks)  # Return the list of tasks for GET requests

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"message": "Task deleted successfully!"}), 200

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def edit_task(task_id):
    global tasks
    data = request.json
    for task in tasks:
        if task["id"] == task_id:
            task["content"] = data.get("content", task["content"])
            return jsonify({"message": "Task updated successfully!", "task": task}), 200
    return jsonify({"error": "Task not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
