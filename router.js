const routes = {
    '/': {
        template: `
            <div class="router-outlet">
                <h2>Welcome Home!</h2>
                <p>This is the home page. Click on Dashboard to see nested routing in action.</p>
            </div>
        `,
        title: 'Home'
    },
    '/dashboard': {
        template: `
            <div class="router-outlet">
                <h2>Dashboard</h2>
                <p>This is the main dashboard. Select a section below.</p>
                
                <nav class="dashboard-nav">
                    <button data-route="/dashboard/profile">Profile</button>
                    <button data-route="/dashboard/settings">Settings</button>
                    <button data-route="/dashboard/analytics">Analytics</button>
                </nav>
                
                <div id="dashboard-outlet" class="dashboard-content">
                    <p>Select a tab to view content</p>
                </div>
            </div>
        `,
        title: 'Dashboard',
        children: {
            '/dashboard/profile': {
                template: `
                    <div>
                        <h3>Profile</h3>
                        <div class="profile-card">
                            <div class="profile-avatar">👩</div>
                            <div>
                                <p><strong>Jane Doe</strong></p>
                                <p>jane.doe@example.com</p>
                                <p>Senior Developer</p>
                            </div>
                        </div>
                        <p>This is your profile page. You can edit your personal information here.</p>
                    </div>
                `,
                title: 'Profile'
            },
            '/dashboard/settings': {
                template: `
                    <div>
                        <h3>Settings</h3>
                        <form class="settings-form">
                            <div class="form-group">
                                <label for="theme">Theme</label>
                                <select id="theme">
                                    <option>Light</option>
                                    <option>Dark</option>
                                    <option>System</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Notifications</label>
                                <div>
                                    <input type="checkbox" id="email-notifications">
                                    <label for="email-notifications">Email notifications</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="push-notifications">
                                    <label for="push-notifications">Push notifications</label>
                                </div>
                            </div>
                            <button type="button">Save Settings</button>
                        </form>
                    </div>
                `,
                title: 'Settings'
            },
            '/dashboard/analytics': {
                template: `
                    <div>
                        <h3>Analytics</h3>
                        <div class="analytics-grid">
                            <div class="analytics-card">
                                <h4>Visitors</h4>
                                <p>1,234</p>
                            </div>
                            <div class="analytics-card">
                                <h4>Conversion</h4>
                                <p>12%</p>
                            </div>
                            <div class="analytics-card">
                                <h4>Revenue</h4>
                                <p>$5,678</p>
                            </div>
                        </div>
                        <div style="height: 200px; background: #f1f1f1; display: flex; align-items: center; justify-content: center;">
                            <p>Analytics chart would appear here</p>
                        </div>
                    </div>
                `,
                title: 'Analytics'
            }
        }
    },
    '/about': {
        template: `
            <div class="router-outlet">
                <h2>About Us</h2>
                <p>This is a demo application showcasing nested routing patterns.</p>
                <div style="margin-top: 1rem; padding: 1rem; background-color: #fff8e1; border-left: 4px solid #ffd54f;">
                    <p>Note: This is a client-side routing implementation using vanilla JavaScript.</p>
                </div>
            </div>
        `,
        title: 'About'
    }
};

// Router implementation
class Router {
    constructor() {
        this.currentPath = window.location.pathname;
        this.init();
    }

    init() {
        // Set up main navigation
        document.querySelectorAll('.main-nav button').forEach(button => {
            button.addEventListener('click', () => {
                const path = button.getAttribute('data-route');
                this.navigate(path);
            });
        });

        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.currentPath = window.location.pathname;
            this.render();
        });

        // Initial render
        this.render();
    }

    navigate(path) {
        history.pushState({}, '', path);
        this.currentPath = path;
        this.render();
    }

    render() {
        // Find matching route
        const route = this.findRoute(this.currentPath);

        // Update main content
        document.getElementById('router-outlet').innerHTML = route.template;
        document.title = route.title;

        // Update active navigation
        this.updateActiveNav();

        // Set up dashboard routing if needed
        if (this.currentPath.startsWith('/dashboard')) {
            this.setupDashboardRouting();

            // Render nested content
            const nestedPath = this.currentPath === '/dashboard'
                ? '/dashboard/profile'
                : this.currentPath;
            const nestedRoute = this.findRoute(nestedPath);

            if (nestedRoute && document.getElementById('dashboard-outlet')) {
                document.getElementById('dashboard-outlet').innerHTML = nestedRoute.template;
            }
        }
    }

    findRoute(path) {
        // Check exact match
        if (routes[path]) {
            return routes[path];
        }

        // Check nested dashboard routes
        if (path.startsWith('/dashboard') && routes['/dashboard']?.children) {
            const childPath = path.substring('/dashboard'.length) || '/profile';
            const fullChildPath = `/dashboard${childPath}`;

            if (routes['/dashboard'].children[fullChildPath]) {
                return routes['/dashboard'].children[fullChildPath];
            }
        }

        // Default to home
        return routes['/'];
    }

    updateActiveNav() {
        // Main navigation
        document.querySelectorAll('.main-nav button').forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-route') === this.currentPath) {
                button.classList.add('active');
            }
        });
    }

    setupDashboardRouting() {
        const dashboardNav = document.querySelector('.dashboard-nav');
        if (!dashboardNav) return;

        // Set up dashboard navigation
        dashboardNav.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const path = button.getAttribute('data-route');
                this.navigate(path);
            });

            // Set active state
            button.classList.remove('active');
            if (button.getAttribute('data-route') === this.currentPath) {
                button.classList.add('active');
            }
        });
    }
}

// Initialize router
new Router();
