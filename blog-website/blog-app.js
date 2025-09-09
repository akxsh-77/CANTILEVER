// BlogSpace Application JavaScript

class BlogApp {
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
                username: "techwriter",
                email: "writer@example.com", 
                password: "writer123",
                joinDate: "2024-02-01"
            }
        ];
        this.blogPosts = [
            {
                id: 1,
                title: "Getting Started with Web Development",
                content: "Web development is an exciting field that combines creativity with technical skills. In this post, we'll explore the fundamentals of HTML, CSS, and JavaScript, and how they work together to create dynamic web experiences.\n\nHTML provides the structure, CSS handles the styling, and JavaScript adds interactivity. As you begin your journey, focus on understanding these core technologies before moving to frameworks.",
                author: "akash_dev",
                publishDate: "2024-03-15",
                tags: ["web-development", "beginner", "html", "css", "javascript"],
                lastModified: "2024-03-15"
            },
            {
                id: 2,
                title: "The Future of AI in Software Development",
                content: "Artificial Intelligence is revolutionizing how we write and maintain code. From intelligent code completion to automated testing, AI tools are becoming indispensable for modern developers.\n\nTools like ChatGPT, GitHub Copilot, and various ML-powered IDEs are changing the development landscape. However, understanding core programming principles remains crucial.",
                author: "techwriter",
                publishDate: "2024-03-10",
                tags: ["ai", "software-development", "machine-learning", "future-tech"],
                lastModified: "2024-03-10"
            },
            {
                id: 3,
                title: "Building Responsive Web Applications",
                content: "Responsive design is no longer optional - it's essential. With users accessing websites from various devices, creating fluid and adaptable layouts is crucial for user experience.\n\nUsing CSS Grid and Flexbox, along with media queries, developers can create applications that work seamlessly across desktop, tablet, and mobile devices.",
                author: "akash_dev",
                publishDate: "2024-03-05",
                tags: ["responsive-design", "css", "mobile-first", "ux"],
                lastModified: "2024-03-05"
            }
        ];
        this.nextUserId = 3;
        this.nextPostId = 4;
        this.currentPage = 'home';
        this.searchQuery = '';
        this.activeTag = '';
        this.postsPerPage = 6;
        this.currentPostPage = 1;
        this.postToDelete = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderFilterTags();
        this.renderRecentPosts();
        this.updateNavigation();
    }

    setupEventListeners() {
        // Navigation - using event delegation for better reliability
        document.addEventListener('click', (e) => {
            // Handle navigation links
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
                return;
            }

            // Handle logout button
            if (e.target.matches('#logout-btn')) {
                e.preventDefault();
                this.handleLogout();
                return;
            }

            // Handle post card clicks (for viewing posts)
            const postCard = e.target.closest('.post-card');
            if (postCard && !e.target.matches('.btn')) {
                const postId = parseInt(postCard.getAttribute('data-post-id'));
                this.viewPost(postId);
                return;
            }

            // Handle edit post buttons
            if (e.target.matches('.edit-post-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const postId = parseInt(e.target.getAttribute('data-post-id'));
                this.editPost(postId);
                return;
            }

            // Handle delete post buttons
            if (e.target.matches('.delete-post-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const postId = parseInt(e.target.getAttribute('data-post-id'));
                this.deletePost(postId);
                return;
            }

            // Handle tag filters
            if (e.target.matches('.tag-filter')) {
                const tag = e.target.getAttribute('data-tag');
                this.activeTag = tag;
                this.renderFilterTags();
                this.renderRecentPosts();
                if (this.currentPage === 'all-posts') {
                    this.currentPostPage = 1;
                    this.renderAllPosts();
                }
                return;
            }

            // Handle pagination
            if (e.target.matches('.pagination-btn:not([disabled])')) {
                const page = parseInt(e.target.getAttribute('data-page'));
                if (page && page !== this.currentPostPage) {
                    this.currentPostPage = page;
                    this.renderAllPosts();
                }
                return;
            }

            // Handle modal close
            if (e.target.matches('#cancel-delete')) {
                this.hideModal();
                return;
            }

            if (e.target.matches('#confirm-delete')) {
                this.confirmDeletePost();
                return;
            }

            // Close modal when clicking overlay
            if (e.target.matches('#delete-modal') || e.target.matches('.modal-overlay')) {
                this.hideModal();
                return;
            }
        });

        // Authentication forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });

        // Post form
        document.getElementById('post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePostSubmit(e.target);
        });

        document.getElementById('cancel-post').addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToPage('home');
        });

        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => {
            this.handleSearch('search-input');
        });

        document.getElementById('all-posts-search-btn').addEventListener('click', () => {
            this.handleSearch('all-posts-search');
        });

        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch('search-input');
            }
        });

        document.getElementById('all-posts-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch('all-posts-search');
            }
        });
    }

    navigateToPage(page) {
        // Check authentication for protected pages
        if ((page === 'create-post' || page === 'profile') && !this.currentUser) {
            this.navigateToPage('login');
            return;
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Load page-specific content
            switch(page) {
                case 'home':
                    this.activeTag = ''; // Reset filters when going home
                    this.searchQuery = '';
                    this.renderRecentPosts();
                    this.renderFilterTags();
                    break;
                case 'all-posts':
                    this.renderAllPosts();
                    break;
                case 'create-post':
                    this.resetPostForm();
                    break;
                case 'profile':
                    this.renderProfile();
                    break;
            }
        }
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');
        
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.updateNavigation();
            this.navigateToPage('home');
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
        this.updateNavigation();
        this.navigateToPage('home');
        this.hideError('register-error');
    }

    handleLogout() {
        this.currentUser = null;
        this.updateNavigation();
        this.navigateToPage('home');
    }

    handlePostSubmit(form) {
        if (!this.currentUser) {
            this.showError('post-error', 'You must be logged in to create posts');
            return;
        }

        const formData = new FormData(form);
        const title = formData.get('title').trim();
        const content = formData.get('content').trim();
        const tagsString = formData.get('tags').trim();
        const postId = formData.get('postId');

        if (!title || !content) {
            this.showError('post-error', 'Title and content are required');
            return;
        }

        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        if (postId) {
            // Edit existing post
            const existingPost = this.blogPosts.find(p => p.id === parseInt(postId));
            if (existingPost && existingPost.author === this.currentUser.username) {
                existingPost.title = title;
                existingPost.content = content;
                existingPost.tags = tags;
                existingPost.lastModified = new Date().toISOString().split('T')[0];
            }
        } else {
            // Create new post
            const newPost = {
                id: this.nextPostId++,
                title,
                content,
                author: this.currentUser.username,
                publishDate: new Date().toISOString().split('T')[0],
                tags,
                lastModified: new Date().toISOString().split('T')[0]
            };
            this.blogPosts.unshift(newPost);
        }

        this.hideError('post-error');
        this.navigateToPage('home');
    }

    handleSearch(inputId) {
        const searchInput = document.getElementById(inputId);
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) return;
        
        this.searchQuery = query;
        
        const results = this.blogPosts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query)) ||
            post.author.toLowerCase().includes(query)
        );
        
        this.renderSearchResults(results, query);
        this.navigateToPage('search-results');
    }

    updateNavigation() {
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const userMenu = document.getElementById('user-menu');
        
        if (this.currentUser) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            userMenu.classList.remove('hidden');
        } else {
            loginLink.style.display = 'inline-block';
            registerLink.style.display = 'inline-block';
            userMenu.classList.add('hidden');
        }
    }

    renderRecentPosts() {
        const container = document.getElementById('recent-posts');
        const recentPosts = this.getFilteredPosts().slice(0, 6);
        
        if (recentPosts.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No posts found</h3><p>Be the first to create a post!</p></div>';
            return;
        }
        
        container.innerHTML = recentPosts.map(post => this.createPostCard(post)).join('');
    }

    renderAllPosts() {
        const container = document.getElementById('all-posts-container');
        const filteredPosts = this.getFilteredPosts();
        const startIndex = (this.currentPostPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);
        
        if (postsToShow.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No posts found</h3><p>Try adjusting your search or filters.</p></div>';
        } else {
            container.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
        }
        
        this.renderPagination(filteredPosts.length);
    }

    renderSearchResults(results, query) {
        const container = document.getElementById('search-results-container');
        const title = document.getElementById('search-results-title');
        
        title.textContent = `Search Results for "${query}" (${results.length} found)`;
        
        if (results.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No results found</h3><p>Try different keywords or check your spelling.</p></div>';
        } else {
            container.innerHTML = results.map(post => this.createPostCard(post)).join('');
        }
    }

    renderProfile() {
        if (!this.currentUser) {
            this.navigateToPage('login');
            return;
        }
        
        const profileInfo = document.getElementById('profile-info');
        const userPosts = this.blogPosts.filter(post => post.author === this.currentUser.username);
        
        profileInfo.innerHTML = `
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
            <div class="profile-field">
                <label>Total posts:</label>
                <span>${userPosts.length}</span>
            </div>
        `;
        
        const userPostsContainer = document.getElementById('user-posts');
        if (userPosts.length === 0) {
            userPostsContainer.innerHTML = '<div class="empty-state"><h3>No posts yet</h3><p><a href="#" data-page="create-post">Create your first post</a></p></div>';
        } else {
            userPostsContainer.innerHTML = userPosts.map(post => this.createPostCard(post, true)).join('');
        }
    }

    renderFilterTags() {
        const container = document.getElementById('filter-tags');
        const allTags = [...new Set(this.blogPosts.flatMap(post => post.tags))];
        
        if (allTags.length === 0) return;
        
        const tagsHtml = allTags.map(tag => 
            `<span class="tag-filter ${this.activeTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</span>`
        ).join('');
        
        container.innerHTML = `
            <span class="tag-filter ${this.activeTag === '' ? 'active' : ''}" data-tag="">All</span>
            ${tagsHtml}
        `;
    }

    renderPagination(totalPosts) {
        const container = document.getElementById('pagination');
        const totalPages = Math.ceil(totalPosts / this.postsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHtml = '';
        
        // Previous button
        paginationHtml += `
            <button class="pagination-btn" ${this.currentPostPage === 1 ? 'disabled' : ''} data-page="${this.currentPostPage - 1}">
                Previous
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPostPage - 2 && i <= this.currentPostPage + 2)) {
                paginationHtml += `
                    <button class="pagination-btn ${i === this.currentPostPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPostPage - 3 || i === this.currentPostPage + 3) {
                paginationHtml += '<span class="pagination-btn" disabled>...</span>';
            }
        }
        
        // Next button
        paginationHtml += `
            <button class="pagination-btn" ${this.currentPostPage === totalPages ? 'disabled' : ''} data-page="${this.currentPostPage + 1}">
                Next
            </button>
        `;
        
        container.innerHTML = paginationHtml;
    }

    createPostCard(post, showActions = false) {
        const excerpt = this.truncateText(post.content, 150);
        const isOwner = this.currentUser && post.author === this.currentUser.username;
        
        return `
            <article class="post-card" data-post-id="${post.id}">
                <div class="post-card__content">
                    <h3 class="post-card__title">${this.escapeHtml(post.title)}</h3>
                    <div class="post-card__meta">
                        <span>By ${post.author}</span>
                        <span>${this.formatDate(post.publishDate)}</span>
                    </div>
                    <p class="post-card__excerpt">${this.escapeHtml(excerpt)}</p>
                    <div class="post-card__tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                    ${(showActions && isOwner) ? `
                        <div class="post-card__actions">
                            <button class="btn btn--sm btn--outline edit-post-btn" data-post-id="${post.id}">Edit</button>
                            <button class="btn btn--sm btn--outline delete-post-btn" data-post-id="${post.id}">Delete</button>
                        </div>
                    ` : ''}
                </div>
            </article>
        `;
    }

    viewPost(postId) {
        const post = this.blogPosts.find(p => p.id === postId);
        if (!post) return;
        
        const container = document.getElementById('post-detail-content');
        const isOwner = this.currentUser && post.author === this.currentUser.username;
        
        container.innerHTML = `
            <div class="post-detail__header">
                <h1 class="post-detail__title">${this.escapeHtml(post.title)}</h1>
                <div class="post-detail__meta">
                    <span>By <strong>${post.author}</strong></span>
                    <span>Published ${this.formatDate(post.publishDate)}</span>
                </div>
                <div class="post-detail__tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="post-detail__content">
                ${this.formatPostContent(post.content)}
            </div>
            ${isOwner ? `
                <div class="post-detail__actions">
                    <button class="btn btn--outline edit-post-btn" data-post-id="${post.id}">Edit Post</button>
                    <button class="btn btn--outline delete-post-btn" data-post-id="${post.id}">Delete Post</button>
                    <button class="btn btn--secondary" data-page="home">Back to Home</button>
                </div>
            ` : `
                <div class="post-detail__actions">
                    <button class="btn btn--secondary" data-page="home">Back to Home</button>
                </div>
            `}
        `;
        
        this.navigateToPage('post-detail');
    }

    editPost(postId) {
        const post = this.blogPosts.find(p => p.id === postId);
        if (!post || post.author !== this.currentUser.username) return;
        
        // Populate form with post data
        document.getElementById('post-form-title').textContent = 'Edit Post';
        document.getElementById('edit-post-id').value = post.id;
        document.querySelector('#post-form input[name="title"]').value = post.title;
        document.querySelector('#post-form textarea[name="content"]').value = post.content;
        document.querySelector('#post-form input[name="tags"]').value = post.tags.join(', ');
        
        this.navigateToPage('create-post');
    }

    deletePost(postId) {
        this.postToDelete = postId;
        this.showModal();
    }

    confirmDeletePost() {
        if (this.postToDelete) {
            const postIndex = this.blogPosts.findIndex(p => p.id === this.postToDelete);
            if (postIndex > -1) {
                const post = this.blogPosts[postIndex];
                if (post.author === this.currentUser.username) {
                    this.blogPosts.splice(postIndex, 1);
                    this.hideModal();
                    this.navigateToPage('profile');
                }
            }
        }
    }

    resetPostForm() {
        document.getElementById('post-form-title').textContent = 'Create New Post';
        document.getElementById('post-form').reset();
        document.getElementById('edit-post-id').value = '';
        this.hideError('post-error');
    }

    getFilteredPosts() {
        let posts = this.blogPosts;
        
        if (this.activeTag) {
            posts = posts.filter(post => post.tags.includes(this.activeTag));
        }
        
        return posts;
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.classList.add('show');
    }

    hideError(elementId) {
        const element = document.getElementById(elementId);
        element.classList.remove('show');
    }

    showModal() {
        document.getElementById('delete-modal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('delete-modal').classList.add('hidden');
        this.postToDelete = null;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatPostContent(content) {
        return content.split('\n\n').map(paragraph => 
            `<p>${this.escapeHtml(paragraph)}</p>`
        ).join('');
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
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
    new BlogApp();
});