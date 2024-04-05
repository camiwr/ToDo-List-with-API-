document.addEventListener('DOMContentLoaded', function() {
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
                <span class="task-tag">${task.tag}</span>
                <i id="Editar" class="fa-regular fa-pen-to-square" alt="Editar" onclick="editTask(${index})"></i>
                <i id="Deletar" class="fa-solid fa-trash"alt="Deletar" onclick="removeTask(${index})"></i>
                `;
                taskList.appendChild(taskElement);
            });
            updateCounters();
        }
        
    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskTag = taskTagInput.value.trim();

        if (taskText) {
            tasks.push({ text: taskText, date: taskDate, tag: taskTag, completed: false });
            taskInput.value = '';
            taskDateInput.value = '';
            taskTagInput.value = '';
            updateLocalStorage();
            renderTasks();
        }
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        updateLocalStorage();
        renderTasks();
    }

    function removeTask(index) {
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
    
    // Salva as alterações da tarefa editada
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


// ------ Script para Modo DARK ------

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