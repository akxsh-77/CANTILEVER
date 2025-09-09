class TaskManager {
    constructor() {
        this.currentUser = null;
        this.users = [
            {
                id: 1,
                username: "akash_dev",
                email: "akash@example.com",
                password: "password123",
                joinDate: "2024-01-15"
            },
            {
                id: 2,
                username: "project_manager",
                email: "pm@example.com",
                password: "manager123",
                joinDate: "2024-02-01"
            }
        ];
        this.tasks = [
            {
                id: 1,
                title: "Complete Blog Website Project",
                description: "Finish the blog website project for Cantilever internship with all CRUD operations and responsive design",
                category: "Development",
                priority: "High",
                status: "In Progress",
                dueDate: "2024-03-20",
                createdDate: "2024-03-01",
                assignedTo: "akash_dev",
                completedDate: null
            },
            {
                id: 2,
                title: "Task Management System",
                description: "Build a comprehensive task management system with filtering, sorting, and user authentication",
                category: "Development",
                priority: "High",
                status: "In Progress",
                dueDate: "2024-03-22",
                createdDate: "2024-03-01",
                assignedTo: "akash_dev",
                completedDate: null
            },
            {
                id: 3,
                title: "DSA Practice - Arrays",
                description: "Practice 10 array problems on LeetCode focusing on medium difficulty level",
                category: "Learning",
                priority: "Medium",
                status: "Completed",
                dueDate: "2024-03-15",
                createdDate: "2024-03-10",
                assignedTo: "akash_dev",
                completedDate: "2024-03-14"
            },
            {
                id: 4,
                title: "Prepare Resume Update",
                description: "Update resume with new projects and internship details for job applications",
                category: "Career",
                priority: "Medium",
                status: "Pending",
                dueDate: "2024-03-25",
                createdDate: "2024-03-05",
                assignedTo: "akash_dev",
                completedDate: null
            },
            {
                id: 5,
                title: "Research ML Project Ideas",
                description: "Find unique machine learning project ideas that can be built with ChatGPT assistance",
                category: "Research",
                priority: "Low",
                status: "Pending",
                dueDate: "2024-03-30",
                createdDate: "2024-03-08",
                assignedTo: "akash_dev",
                completedDate: null
            },
            {
                id: 6,
                title: "Deploy Applications",
                description: "Deploy both blog website and task management applications to hosting platforms",
                category: "Deployment",
                priority: "High",
                status: "Overdue",
                dueDate: "2024-03-12",
                createdDate: "2024-03-02",
                assignedTo: "akash_dev",
                completedDate: null
            }
        ];
        this.currentTaskId = null;
        this.init();
    }

    init() {
        // Show loading screen initially
        this.showLoading();
        
        // Simulate app initialization
        setTimeout(() => {
            this.bindEvents();
            this.updateTaskStatuses();
            this.hideLoading();
            this.showAuthContainer();
        }, 500);
    }

    showLoading() {
        document.getElementById('loading-screen').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-screen').classList.add('hidden');
    }

    bindEvents() {
        // Authentication events
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('show-register').addEventListener('click', (e) => this.showRegister(e));
        document.getElementById('show-login').addEventListener('click', (e) => this.showLogin(e));
        document.getElementById('logout-btn').addEventListener('click', (e) => this.handleLogout(e));

        // Navigation events
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // User menu
        document.getElementById('user-menu-btn').addEventListener('click', (e) => this.toggleUserMenu(e));
        document.addEventListener('click', (e) => this.closeUserMenu(e));

        // Task events
        document.getElementById('add-task-btn').addEventListener('click', () => this.showCreateTask());
        document.getElementById('task-form').addEventListener('submit', (e) => this.handleTaskForm(e));
        document.getElementById('cancel-task-btn').addEventListener('click', () => this.showView('tasks'));

        // Filter and search events
        document.getElementById('search-input').addEventListener('input', () => this.filterTasks());
        document.getElementById('status-filter').addEventListener('change', () => this.filterTasks());
        document.getElementById('priority-filter').addEventListener('change', () => this.filterTasks());
        document.getElementById('sort-select').addEventListener('change', () => this.filterTasks());

        // Modal events
        document.getElementById('close-modal').addEventListener('click', () => this.closeTaskModal());
        document.getElementById('edit-task-modal-btn').addEventListener('click', () => this.editTaskFromModal());
        document.getElementById('toggle-status-btn').addEventListener('click', () => this.toggleTaskStatus());
        
        // Delete modal events
        document.getElementById('close-delete-modal').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('cancel-delete-btn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirm-delete-btn').addEventListener('click', () => this.confirmDeleteTask());

        // Modal overlay clicks
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.parentElement.classList.add('hidden');
                }
            });
        });
    }

    // Authentication methods
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.showMainApp();
            this.clearError('login-error');
        } else {
            this.showError('login-error', 'Invalid username or password');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;

        // Validation
        if (this.users.some(u => u.username === username)) {
            this.showError('register-error', 'Username already exists');
            return;
        }

        if (this.users.some(u => u.email === email)) {
            this.showError('register-error', 'Email already exists');
            return;
        }

        if (password.length < 6) {
            this.showError('register-error', 'Password must be at least 6 characters');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            joinDate: new Date().toISOString().split('T')[0]
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        this.showMainApp();
        this.clearError('register-error');
    }

    showRegister(e) {
        e.preventDefault();
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('register-view').classList.remove('hidden');
    }

    showLogin(e) {
        e.preventDefault();
        document.getElementById('register-view').classList.add('hidden');
        document.getElementById('login-view').classList.remove('hidden');
    }

    handleLogout(e) {
        e.preventDefault();
        this.currentUser = null;
        this.showAuthContainer();
    }

    showAuthContainer() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('register-view').classList.add('hidden');
        this.clearForms();
    }

    showMainApp() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('current-username').textContent = this.currentUser.username;
        this.showView('dashboard');
        this.updateDashboard();
    }

    // Navigation methods
    handleNavigation(e) {
        e.preventDefault();
        const view = e.target.dataset.view;
        
        if (view === 'create-task') {
            this.showCreateTask();
        } else {
            this.showView(view);
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
    }

    showView(viewName) {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        document.getElementById(`${viewName}-view`).classList.add('active');

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        switch (viewName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'tasks':
                this.displayAllTasks();
                break;
            case 'profile':
                this.displayProfile();
                break;
        }
    }

    showCreateTask() {
        this.currentTaskId = null;
        document.getElementById('task-form-title').textContent = 'Create New Task';
        document.getElementById('task-form').reset();
        document.getElementById('task-id').value = '';
        this.showView('create-task');
        
        // Update nav - remove active from all
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    }

    // Task methods
    getUserTasks() {
        return this.tasks.filter(task => task.assignedTo === this.currentUser.username);
    }

    updateTaskStatuses() {
        const today = new Date().toISOString().split('T')[0];
        
        this.tasks.forEach(task => {
            if (task.status !== 'Completed' && task.dueDate < today) {
                task.status = 'Overdue';
            }
        });
    }

    handleTaskForm(e) {
        e.preventDefault();
        
        const taskData = {
            title: document.getElementById('task-title').value.trim(),
            description: document.getElementById('task-description').value.trim(),
            category: document.getElementById('task-category').value,
            priority: document.getElementById('task-priority').value,
            status: document.getElementById('task-status').value,
            dueDate: document.getElementById('task-due-date').value
        };

        // Validation
        if (!taskData.title || !taskData.category || !taskData.priority || !taskData.dueDate) {
            this.showError('task-form-error', 'Please fill in all required fields');
            return;
        }

        const taskId = document.getElementById('task-id').value;
        
        if (taskId) {
            // Update existing task
            const taskIndex = this.tasks.findIndex(t => t.id == taskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = {
                    ...this.tasks[taskIndex],
                    ...taskData,
                    completedDate: taskData.status === 'Completed' ? new Date().toISOString().split('T')[0] : null
                };
            }
        } else {
            // Create new task
            const newTask = {
                id: Date.now(),
                ...taskData,
                createdDate: new Date().toISOString().split('T')[0],
                assignedTo: this.currentUser.username,
                completedDate: taskData.status === 'Completed' ? new Date().toISOString().split('T')[0] : null
            };
            this.tasks.push(newTask);
        }

        this.updateTaskStatuses();
        this.showView('tasks');
        this.clearError('task-form-error');
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.currentTaskId = taskId;
        document.getElementById('task-form-title').textContent = 'Edit Task';
        document.getElementById('task-id').value = taskId;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-category').value = task.category;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-due-date').value = task.dueDate;

        this.showView('create-task');
    }

    deleteTask(taskId) {
        this.currentTaskId = taskId;
        document.getElementById('delete-modal').classList.remove('hidden');
    }

    confirmDeleteTask() {
        const taskIndex = this.tasks.findIndex(t => t.id === this.currentTaskId);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            this.updateTaskStatuses();
            this.displayAllTasks();
            this.updateDashboard();
        }
        this.closeDeleteModal();
    }

    toggleTaskStatus() {
        const task = this.tasks.find(t => t.id === this.currentTaskId);
        if (!task) return;

        if (task.status === 'Completed') {
            task.status = 'Pending';
            task.completedDate = null;
        } else {
            task.status = 'Completed';
            task.completedDate = new Date().toISOString().split('T')[0];
        }

        this.updateTaskStatuses();
        this.displayAllTasks();
        this.updateDashboard();
        this.closeTaskModal();
    }

    // Display methods
    updateDashboard() {
        const userTasks = this.getUserTasks();
        
        const stats = {
            total: userTasks.length,
            pending: userTasks.filter(t => t.status === 'Pending').length,
            completed: userTasks.filter(t => t.status === 'Completed').length,
            overdue: userTasks.filter(t => t.status === 'Overdue').length,
            inProgress: userTasks.filter(t => t.status === 'In Progress').length
        };

        stats.pending += stats.inProgress; // Combine pending and in progress for display

        document.getElementById('total-tasks').textContent = stats.total;
        document.getElementById('pending-tasks').textContent = stats.pending;
        document.getElementById('completed-tasks').textContent = stats.completed;
        document.getElementById('overdue-tasks').textContent = stats.overdue;

        // Display recent tasks (last 5)
        const recentTasks = userTasks
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 5);
        
        this.displayTaskList(recentTasks, 'recent-tasks-list');
    }

    displayAllTasks() {
        const userTasks = this.getUserTasks();
        this.filterTasks(); // Apply current filters
    }

    displayTaskList(tasks, containerId) {
        const container = document.getElementById(containerId);
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="no-tasks" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">No tasks found</div>';
            return;
        }

        container.innerHTML = tasks.map(task => this.createTaskHTML(task)).join('');
        
        // Add event listeners to task items and buttons
        container.querySelectorAll('.task-item').forEach(item => {
            const taskId = parseInt(item.dataset.taskId);
            
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.task-actions')) {
                    this.showTaskModal(taskId);
                }
            });
        });

        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = parseInt(e.target.closest('.task-item').dataset.taskId);
                this.editTask(taskId);
            });
        });

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = parseInt(e.target.closest('.task-item').dataset.taskId);
                this.deleteTask(taskId);
            });
        });
    }

    createTaskHTML(task) {
        const isOverdue = task.status !== 'Completed' && new Date(task.dueDate) < new Date();
        const priorityClass = task.priority.toLowerCase();
        const statusClass = task.status.toLowerCase().replace(' ', '-');
        
        return `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-header">
                    <h4 class="task-title">${task.title}</h4>
                    <div class="task-actions">
                        <button class="task-action-btn edit-btn" title="Edit">✏️</button>
                        <button class="task-action-btn delete-btn delete" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="task-meta">
                    <span class="priority-badge ${priorityClass}">${task.priority}</span>
                    <span class="status-badge ${statusClass}">${task.status}</span>
                    <span class="task-category">${task.category}</span>
                </div>
                <p class="task-description">${task.description || 'No description'}</p>
                <div class="task-footer">
                    <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                        Due: ${this.formatDate(task.dueDate)}
                    </span>
                    <span>Created: ${this.formatDate(task.createdDate)}</span>
                </div>
            </div>
        `;
    }

    filterTasks() {
        const search = document.getElementById('search-input').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const priorityFilter = document.getElementById('priority-filter').value;
        const sortBy = document.getElementById('sort-select').value;

        let filteredTasks = this.getUserTasks();

        // Apply filters
        if (search) {
            filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(search) ||
                task.description.toLowerCase().includes(search) ||
                task.category.toLowerCase().includes(search)
            );
        }

        if (statusFilter) {
            filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
        }

        if (priorityFilter) {
            filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
        }

        // Apply sorting
        filteredTasks.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'createdDate':
                    return new Date(b.createdDate) - new Date(a.createdDate);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        this.displayTaskList(filteredTasks, 'all-tasks-list');
    }

    displayProfile() {
        document.getElementById('profile-username').textContent = this.currentUser.username;
        document.getElementById('profile-email').textContent = this.currentUser.email;
        document.getElementById('profile-join-date').textContent = `Joined: ${this.formatDate(this.currentUser.joinDate)}`;
    }

    // Modal methods
    showTaskModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.currentTaskId = taskId;
        
        document.getElementById('modal-task-title').textContent = task.title;
        document.getElementById('modal-task-description').textContent = task.description || 'No description';
        document.getElementById('modal-task-category').textContent = task.category;
        document.getElementById('modal-task-priority').textContent = task.priority;
        document.getElementById('modal-task-priority').className = `priority-badge ${task.priority.toLowerCase()}`;
        document.getElementById('modal-task-status').textContent = task.status;
        document.getElementById('modal-task-status').className = `status-badge ${task.status.toLowerCase().replace(' ', '-')}`;
        document.getElementById('modal-task-due-date').textContent = this.formatDate(task.dueDate);
        document.getElementById('modal-task-created-date').textContent = this.formatDate(task.createdDate);

        const toggleBtn = document.getElementById('toggle-status-btn');
        toggleBtn.textContent = task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Complete';

        document.getElementById('task-modal').classList.remove('hidden');
    }

    closeTaskModal() {
        document.getElementById('task-modal').classList.add('hidden');
        this.currentTaskId = null;
    }

    closeDeleteModal() {
        document.getElementById('delete-modal').classList.add('hidden');
        this.currentTaskId = null;
    }

    editTaskFromModal() {
        this.closeTaskModal();
        this.editTask(this.currentTaskId);
    }

    // Utility methods
    toggleUserMenu(e) {
        e.stopPropagation();
        const dropdown = document.getElementById('user-dropdown');
        dropdown.classList.toggle('hidden');
    }

    closeUserMenu(e) {
        if (!e.target.closest('.user-menu')) {
            document.getElementById('user-dropdown').classList.add('hidden');
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }

    clearForms() {
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
        this.clearError('login-error');
        this.clearError('register-error');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});