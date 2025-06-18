document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    
    // Load tasks from localStorage
    loadTasks();
    
    // Add task when button is clicked
    addTaskBtn.addEventListener('click', addTask);
    
    // Add task when Enter key is pressed
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        
        taskInput.value = '';
        saveTasks();
        updateTaskCount();
    }
    
    function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li');
        li.className = 'task-item' + (isCompleted ? ' completed' : '');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;
        checkbox.className = 'complete-checkbox';
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        
        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        completeBtn.className = 'complete-btn';
        completeBtn.title = 'Complete';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete';
        
        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(actionsDiv);
        
        // Toggle completion
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed');
            saveTasks();
            updateTaskCount();
        });
        
        // Also allow clicking the complete button
        completeBtn.addEventListener('click', function() {
            checkbox.checked = !checkbox.checked;
            li.classList.toggle('completed');
            saveTasks();
            updateTaskCount();
        });
        
        // Delete task
        deleteBtn.addEventListener('click', function() {
            li.remove();
            saveTasks();
            updateTaskCount();
        });
        
        return li;
    }
    
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').textContent,
                completed: task.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => {
                const taskItem = createTaskElement(task.text, task.completed);
                taskList.appendChild(taskItem);
            });
            updateTaskCount();
        }
    }
    
    function clearCompletedTasks() {
        document.querySelectorAll('.task-item.completed').forEach(task => {
            task.remove();
        });
        saveTasks();
        updateTaskCount();
    }
    
    function updateTaskCount() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        const remainingTasks = totalTasks - completedTasks;
        
        if (totalTasks === 0) {
            taskCount.textContent = 'No tasks';
        } else {
            taskCount.textContent = `${remainingTasks} ${remainingTasks === 1 ? 'task' : 'tasks'} remaining`;
        }
    }
});