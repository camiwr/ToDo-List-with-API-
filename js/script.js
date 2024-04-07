document.addEventListener('DOMContentLoaded', function() {
    const TODOIST_API_URL = 'https://api.todoist.com/rest/v2/tasks';
    const TODOIST_TOKEN = '669c4a81526b760af90703a2a710f1fa557b88e9';

    const addButton = document.getElementById('add-task');
    const taskInput = document.getElementById('task-input');
    const taskDateInput = document.getElementById('task-date');
    const taskTagInput = document.getElementById('task-tag');
    const taskList = document.getElementById('task-list');
    const createdCount = document.getElementById('created-count');
    const completedCount = document.getElementById('completed-count');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-card ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                <span class="task-text">${task.text}</span>
                <span class="task-date">${task.date}</span>
                <span class="task-tag" style="background-color: ${task.tagColor};">${task.tag}</span>
                <i id="Editar" class="fa-regular fa-pen-to-square" alt="Editar" onclick="editTask(${index})"></i>
                <i id="Deletar" class="fa-solid fa-trash" alt="Deletar" onclick="removeTask(${index})"></i>
            `;
            taskList.appendChild(taskElement);
        });
        updateCounters();
    }

    function addTaskToTodoist(taskText, taskDate) {
        return fetch(TODOIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TODOIST_TOKEN}`
            },
            body: JSON.stringify({
                content: taskText,
                due_string: taskDate
            })
        })
        .then(response => response.json())
        .then(data => data.id) 
        .catch(error => console.error('Erro ao adicionar tarefa ao Todoist:', error));
    }

    async function addTask() {
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskTag = taskTagInput.value.trim();
        const taskTagColor = document.getElementById('task-tag-color').value; 
        
        if (taskText) {
            const todoistId = await addTaskToTodoist(taskText, taskDate);
            tasks.push({ text: taskText, date: taskDate, tag: taskTag, tagColor: taskTagColor, completed: false, todoistId: todoistId });
            taskInput.value = '';
            taskDateInput.value = '';
            taskTagInput.value = '';
            document.getElementById('task-tag-color').value = '#db4242'; 
            updateLocalStorage();
            renderTasks();
        }
    }
    
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        updateLocalStorage();
        renderTasks();
    }

    function removeTaskFromTodoist(taskId) {
        return fetch(`${TODOIST_API_URL}/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${TODOIST_TOKEN}`
            }
        })
        .then(response => response.ok)
        .catch(error => console.error('Erro ao remover tarefa do Todoist:', error));
    }

    async function removeTask(index) {
        if (tasks[index].todoistId) {
            const removed = await removeTaskFromTodoist(tasks[index].todoistId);
            if (!removed) return;
        }
        tasks.splice(index, 1);
        updateLocalStorage();
        renderTasks();
    }

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateCounters();
    }

    function updateCounters() {
        createdCount.textContent = `Criadas: ${tasks.length}`;
        completedCount.textContent = `Concluídas: ${tasks.filter(task => task.completed).length}`;
    }

    addButton.addEventListener('click', addTask);
    renderTasks();
    
    let currentEditIndex = null;

    function editTask(index) {
        currentEditIndex = index;
        document.getElementById('edit-task-text').value = tasks[index].text;
        document.getElementById('edit-task-date').value = tasks[index].date;
        document.getElementById('edit-task-tag').value = tasks[index].tag;
        document.getElementById('edit-modal').style.display = 'block';
    }

    function closeEditModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    function saveEditedTask() {
        const editedText = document.getElementById('edit-task-text').value.trim();
        const editedDate = document.getElementById('edit-task-date').value;
        const editedTag = document.getElementById('edit-task-tag').value.trim();
        if (editedText && currentEditIndex !== null) {
            tasks[currentEditIndex].text = editedText;
            tasks[currentEditIndex].date = editedDate;
            tasks[currentEditIndex].tag = editedTag;
            updateLocalStorage();
            renderTasks();
            closeEditModal();
        }
    }

    window.toggleTask = toggleTask;
    window.removeTask = removeTask;
    window.editTask = editTask;
    window.closeEditModal = closeEditModal;
    window.saveEditedTask = saveEditedTask;
});


// ------ Script para Mudar os temas ------

    const changeThemeToDark = () => {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("data-theme", "dark");
    }

    const changeThemeToLight = () => {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("data-theme", 'light');
    }
    let theme = localStorage.getItem('data-theme');
    if (theme == 'dark') changeThemeToDark();


    // Pega o checkbox
    const botaoDark = document.getElementById('cbx');

    // Verifica se tem no localStorage seleção do dark theme
    if (localStorage.getItem('data-theme') == 'dark') {
    botaoDark.checked = true;
    }

    // Liga a função ao checkbox
    botaoDark.addEventListener('change', () => {
        let theme = localStorage.getItem('data-theme'); 
        if (!botaoDark.checked){
            changeThemeToLight()
        }else{
            changeThemeToDark()
        }
    });