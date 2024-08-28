document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const sortedTasks = [...tasks].sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        
        sortedTasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'active') return !task.completed;
        }).forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;
            if (task.completed) li.classList.add('completed');

            const prioritySpan = document.createElement('span');
            prioritySpan.classList.add('priority');
            prioritySpan.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
            li.appendChild(prioritySpan);

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit task:', task.text);
                if (newText !== null) {
                    task.text = newText.trim();
                    saveTasks();
                    renderTasks();
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks();
            });

            const finishBtn = document.createElement('button');
            finishBtn.textContent = 'Finish';
            finishBtn.classList.add('finish-btn');
            finishBtn.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            li.appendChild(finishBtn);

            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        tasks.push({ text: taskText, priority, completed: false });
        taskInput.value = '';
        prioritySelect.value = 'low';
        saveTasks();
        renderTasks();
    });

    filterAllBtn.addEventListener('click', () => {
        filterAllBtn.classList.add('active');
        filterActiveBtn.classList.remove('active');
        filterCompletedBtn.classList.remove('active');
        renderTasks('all');
    });

    filterActiveBtn.addEventListener('click', () => {
        filterAllBtn.classList.remove('active');
        filterActiveBtn.classList.add('active');
        filterCompletedBtn.classList.remove('active');
        renderTasks('active');
    });

    filterCompletedBtn.addEventListener('click', () => {
        filterAllBtn.classList.remove('active');
        filterActiveBtn.classList.remove('active');
        filterCompletedBtn.classList.add('active');
        renderTasks('completed');
    });

    renderTasks(); // Initial render
});
