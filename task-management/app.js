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
        this.nextUserId = 3;
        this.nextTaskId = 7;
        this.currentView = 'dashboard';
        this.searchQuery = '';
        this.statusFilter = '';
        this.priorityFilter = '';
        this.sortBy = 'dueDate';
        this.taskToDelete = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Authentication forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });

        // Auth switches
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Task form
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskSubmit(e.target);
        });

        document.getElementById('cancel-task').addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('dashboard');
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.target.getAttribute('data-view');
                this.showView(view);
            });
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Search and filters
        document.getElementById('search-tasks-btn').addEventListener('click', () => {
            this.handleSearch();
        });

        document.getElementById('task-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.statusFilter = e.target.value;
            this.renderAllTasks();
        });

        document.getElementById('priority-filter').addEventListener('change', (e) => {
            this.priorityFilter = e.target.value;
            this.renderAllTasks();
        });

        document.getElementById('sort-tasks').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderAllTasks();
        });

        // Modal handlers
        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.confirmDeleteTask();
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            this.hideModal();
        });

        // Click outside modal to close
        document.getElementById('delete-modal').addEventListener('click', (e) => {
            if (e.target.id === 'delete-modal' || e.target.classList.contains('modal-overlay')) {
                this.hideModal();
            }
        });

        // Dynamic event delegation for task actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.edit-task-btn')) {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                this.editTask(taskId);
            }
            
            if (e.target.matches('.delete-task-btn')) {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                this.deleteTask(taskId);
            }
            
            if (e.target.matches('.complete-task-btn')) {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                this.toggleTaskStatus(taskId);
            }
        });
    }

    checkAuthState() {
        // For demo purposes, show login form
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showLoginForm() {
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('register-view').classList.add('hidden');
    }

    showRegisterForm() {
        document.getElementById('register-view').classList.remove('hidden');
        document.getElementById('login-view').classList.add('hidden');
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');
        
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.showMainApp();
            this.hideError('login-error');
        } else {
            this.showError('login-error', 'Invalid username or password');
        }
    }

    handleRegister(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Validate input
        if (this.users.find(u => u.username === username)) {
            this.showError('register-error', 'Username already exists');
            return;
        }
        
        if (this.users.find(u => u.email === email)) {
            this.showError('register-error', 'Email already registered');
            return;
        }
        
        // Create new user
        const newUser = {
            id: this.nextUserId++,
            username,
            email,
            password,
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        this.users.push(newUser);
        this.currentUser = newUser;
        this.showMainApp();
        this.hideError('register-error');
    }

    handleLogout() {
        this.currentUser = null;
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
        this.showLoginForm();
    }

    showMainApp() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        this.showView('dashboard');
    }

    showView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        document.getElementById(`${viewName}-view`).classList.add('active');
        this.currentView = viewName;
        
        // Load view-specific content
        switch(viewName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'all-tasks':
                this.renderAllTasks();
                break;
            case 'create-task':
                this.resetTaskForm();
                break;
            case 'profile':
                this.renderProfile();
                break;
        }
    }

    renderDashboard() {
        const userTasks = this.getUserTasks();
        const stats = this.calculateStats(userTasks);
        
        // Update stats
        document.getElementById('total-tasks').textContent = stats.total;
        document.getElementById('pending-tasks').textContent = stats.pending;
        document.getElementById('completed-tasks').textContent = stats.completed;
        document.getElementById('overdue-tasks').textContent = stats.overdue;
        
        // Render recent tasks
        const recentTasks = userTasks.slice(0, 5);
        const container = document.getElementById('recent-tasks-container');
        
        if (recentTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks found</h3>
                    <p>Create your first task to get started!</p>
                    <button class="btn btn--primary" data-view="create-task">Create Task</button>
                </div>
            `;
        } else {
            container.innerHTML = recentTasks.map(task => this.createTaskCard(task)).join('');
        }
    }

    renderAllTasks() {
        const filteredTasks = this.getFilteredTasks();
        const container = document.getElementById('all-tasks-container');
        
        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks found</h3>
                    <p>Try adjusting your filters or create a new task.</p>
                </div>
            `;
        } else {
            container.innerHTML = filteredTasks.map(task => this.createTaskCard(task, true)).join('');
        }
    }

    renderProfile() {
        if (!this.currentUser) return;
        
        const userTasks = this.getUserTasks();
        const stats = this.calculateStats(userTasks);
        
        // Profile info
        document.getElementById('profile-info').innerHTML = `
            <div class="profile-field">
                <label>Username:</label>
                <span>${this.currentUser.username}</span>
            </div>
            <div class="profile-field">
                <label>Email:</label>
                <span>${this.currentUser.email}</span>
            </div>
            <div class="profile-field">
                <label>Member since:</label>
                <span>${this.formatDate(this.currentUser.joinDate)}</span>
            </div>
        `;
        
        // Profile stats
        document.getElementById('profile-stats').innerHTML = `
            <div class="stat-item">
                <label>Total Tasks:</label>
                <span>${stats.total}</span>
            </div>
            <div class="stat-item">
                <label>Completed Tasks:</label>
                <span>${stats.completed}</span>
            </div>
            <div class="stat-item">
                <label>Pending Tasks:</label>
                <span>${stats.pending}</span>
            </div>
            <div class="stat-item">
                <label>Overdue Tasks:</label>
                <span class="text-warning">${stats.overdue}</span>
            </div>
            <div class="stat-item">
                <label>Completion Rate:</label>
                <span class="text-success">${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
            </div>
        `;
    }

    handleTaskSubmit(form) {
        if (!this.currentUser) {
            this.showError('task-error', 'You must be logged in to create tasks');
            return;
        }

        const formData = new FormData(form);
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const category = formData.get('category');
        const priority = formData.get('priority');
        const status = formData.get('status');
        const dueDate = formData.get('dueDate');
        const taskId = formData.get('taskId');

        if (!title || !category || !priority || !dueDate) {
            this.showError('task-error', 'Please fill in all required fields');
            return;
        }

        if (taskId) {
            // Edit existing task
            const existingTask = this.tasks.find(t => t.id === parseInt(taskId));
            if (existingTask && existingTask.assignedTo === this.currentUser.username) {
                existingTask.title = title;
                existingTask.description = description;
                existingTask.category = category;
                existingTask.priority = priority;
                existingTask.status = status;
                existingTask.dueDate = dueDate;
                if (status === 'Completed' && !existingTask.completedDate) {
                    existingTask.completedDate = new Date().toISOString().split('T')[0];
                } else if (status !== 'Completed') {
                    existingTask.completedDate = null;
                }
            }
        } else {
            // Create new task
            const newTask = {
                id: this.nextTaskId++,
                title,
                description,
                category,
                priority,
                status,
                dueDate,
                createdDate: new Date().toISOString().split('T')[0],
                assignedTo: this.currentUser.username,
                completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : null
            };
            this.tasks.unshift(newTask);
        }

        this.hideError('task-error');
        this.showView('dashboard');
    }

    handleSearch() {
        this.searchQuery = document.getElementById('task-search').value.trim().toLowerCase();
        this.renderAllTasks();
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.assignedTo !== this.currentUser.username) return;
        
        // Populate form with task data
        document.getElementById('task-form-title').textContent = 'Edit Task';
        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-category').value = task.category;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-due-date').value = task.dueDate;
        
        this.showView('create-task');
    }

    deleteTask(taskId) {
        this.taskToDelete = taskId;
        this.showModal();
    }

    confirmDeleteTask() {
        if (this.taskToDelete) {
            const taskIndex = this.tasks.findIndex(t => t.id === this.taskToDelete);
            if (taskIndex > -1) {
                const task = this.tasks[taskIndex];
                if (task.assignedTo === this.currentUser.username) {
                    this.tasks.splice(taskIndex, 1);
                    this.hideModal();
                    
                    // Refresh current view
                    if (this.currentView === 'dashboard') {
                        this.renderDashboard();
                    } else if (this.currentView === 'all-tasks') {
                        this.renderAllTasks();
                    }
                }
            }
        }
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.assignedTo !== this.currentUser.username) return;
        
        if (task.status === 'Completed') {
            task.status = 'Pending';
            task.completedDate = null;
        } else {
            task.status = 'Completed';
            task.completedDate = new Date().toISOString().split('T')[0];
        }
        
        // Refresh current view
        if (this.currentView === 'dashboard') {
            this.renderDashboard();
        } else if (this.currentView === 'all-tasks') {
            this.renderAllTasks();
        }
    }

    resetTaskForm() {
        document.getElementById('task-form-title').textContent = 'Create New Task';
        document.getElementById('task-form').reset();
        document.getElementById('edit-task-id').value = '';
        this.hideError('task-error');
        
        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('task-due-date').value = tomorrow.toISOString().split('T')[0];
    }

    getUserTasks() {
        if (!this.currentUser) return [];
        return this.tasks.filter(task => task.assignedTo === this.currentUser.username);
    }

    getFilteredTasks() {
        let filteredTasks = this.getUserTasks();
        
        // Apply search filter
        if (this.searchQuery) {
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(this.searchQuery) ||
                task.description.toLowerCase().includes(this.searchQuery) ||
                task.category.toLowerCase().includes(this.searchQuery)
            );
        }
        
        // Apply status filter
        if (this.statusFilter) {
            if (this.statusFilter === 'Overdue') {
                const today = new Date().toISOString().split('T')[0];
                filteredTasks = filteredTasks.filter(task => 
                    task.status !== 'Completed' && task.dueDate < today
                );
            } else {
                filteredTasks = filteredTasks.filter(task => task.status === this.statusFilter);
            }
        }
        
        // Apply priority filter
        if (this.priorityFilter) {
            filteredTasks = filteredTasks.filter(task => task.priority === this.priorityFilter);
        }
        
        // Sort tasks
        filteredTasks.sort((a, b) => {
            switch (this.sortBy) {
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
        
        return filteredTasks;
    }

    calculateStats(tasks) {
        const today = new Date().toISOString().split('T')[0];
        
        return {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'Pending').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            completed: tasks.filter(t => t.status === 'Completed').length,
            overdue: tasks.filter(t => t.status !== 'Completed' && t.dueDate < today).length
        };
    }

    createTaskCard(task, showActions = false) {
        const isOverdue = task.status !== 'Completed' && task.dueDate < new Date().toISOString().split('T')[0];
        const statusClass = this.getStatusClass(task.status, isOverdue);
        const priorityClass = this.getPriorityClass(task.priority);
        
        return `
            <div class="task-card ${statusClass}">
                <div class="task-header">
                    <div class="task-priority ${priorityClass}">
                        ${task.priority}
                    </div>
                    <div class="task-category">
                        ${task.category}
                    </div>
                </div>
                <div class="task-content">
                    <h4 class="task-title">${this.escapeHtml(task.title)}</h4>
                    <p class="task-description">${this.escapeHtml(task.description) || 'No description'}</p>
                </div>
                <div class="task-meta">
                    <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                        Due: ${this.formatDate(task.dueDate)}
                    </span>
                    <span class="task-status status--${task.status.toLowerCase().replace(' ', '-')}">
                        ${task.status}
                    </span>
                </div>
                ${showActions ? `
                    <div class="task-actions">
                        <button class="btn btn--sm btn--outline edit-task-btn" data-task-id="${task.id}">
                            Edit
                        </button>
                        <button class="btn btn--sm btn--outline complete-task-btn" data-task-id="${task.id}">
                            ${task.status === 'Completed' ? 'Reopen' : 'Complete'}
                        </button>
                        <button class="btn btn--sm btn--outline delete-task-btn" data-task-id="${task.id}">
                            Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getStatusClass(status, isOverdue) {
        if (isOverdue) return 'task-overdue';
        switch (status) {
            case 'Completed': return 'task-completed';
            case 'In Progress': return 'task-in-progress';
            default: return 'task-pending';
        }
    }

    getPriorityClass(priority) {
        switch (priority) {
            case 'High': return 'priority-high';
            case 'Medium': return 'priority-medium';
            case 'Low': return 'priority-low';
            default: return '';
        }
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.classList.remove('hidden');
    }

    hideError(elementId) {
        const element = document.getElementById(elementId);
        element.classList.add('hidden');
    }

    showModal() {
        document.getElementById('delete-modal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('delete-modal').classList.add('hidden');
        this.taskToDelete = null;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});