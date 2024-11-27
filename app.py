from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# In-memory task list (for simplicity)
tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def tasks_endpoint():
    if request.method == 'POST':
        task = request.json.get('task')
        if task:
            tasks.append(task)
            return jsonify({'message': 'Task added'}), 201
    return jsonify(tasks)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
