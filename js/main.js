/**
 * SiteFlow - Main JavaScript
 * Common functionality shared across all pages
 */

// Global app configuration
const SiteFlow = {
    config: {
        apiBaseUrl: 'https://api.siteflow.com/v1',
        defaultProject: 'Downtown Office Tower',
        refreshInterval: 60000, // 1 minute
        maxUploadSize: 20971520, // 20MB
        dateTimeFormat: 'MMM D, YYYY, h:mm A',
        debug: false
    },
    
    currentUser: {
        id: 'user123',
        name: 'John Carpenter',
        role: 'Project Manager',
        email: 'john@example.com',
        avatar: '../assets/images/user-avatar.jpg',
        preferences: {
            notifications: true,
            darkMode: false,
            autoRefresh: true
        }
    },
    
    // Current project data
    projectData: {
        id: 'proj001',
        name: 'Downtown Office Tower',
        location: '123 Main St',
        client: 'Acme Corporation',
        startDate: '2024-09-01',
        targetCompletionDate: '2025-12-15',
        actualCompletionDate: null,
        status: 'in-progress',
        progress: 68,
        budget: 15000000,
        spent: 10250000
    }
};

/**
 * Initialize common functionality when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set current date in the UI
    updateCurrentDate();
    
    // Initialize global event listeners
    initializeEventListeners();
    
    // Load any saved theme preferences
    loadUserPreferences();
    
    // Log initialization
    if (SiteFlow.config.debug) {
        console.log('SiteFlow initialized with configuration:', SiteFlow.config);
    }
});

/**
 * Updates the current date display in the UI
 */
function updateCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);
    
    // Update date elements if they exist
    const dateElements = document.querySelectorAll('.current-date');
    dateElements.forEach(el => {
        el.textContent = dateString;
    });
}

/**
 * Initializes global event listeners
 */
function initializeEventListeners() {
    // Notification bell toggle
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function(e) {
            e.preventDefault();
            toggleNotifications();
        });
    }
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
    }
    
    // Global form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Toggles the visibility of the notifications panel
 */
function toggleNotifications() {
    const notificationsPanel = document.querySelector('.notifications-panel');
    if (notificationsPanel) {
        notificationsPanel.classList.toggle('show');
        
        if (notificationsPanel.classList.contains('show')) {
            // Fetch latest notifications when panel is opened
            fetchNotifications();
        }
    }
}

/**
 * Toggles between light and dark theme
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to local storage
    const isDarkMode = document.body.classList.contains('dark-mode');
    SiteFlow.currentUser.preferences.darkMode = isDarkMode;
    saveUserPreferences();
    
    // Update theme toggle icon if it exists
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        if (isDarkMode) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

/**
 * Fetches notifications from the API (simulated)
 */
function fetchNotifications() {
    // In a real app, this would be an API call
    // For demo purposes, we're using setTimeout to simulate a network request
    const notificationsContainer = document.querySelector('.notifications-list');
    
    if (notificationsContainer) {
        // Show loading indicator
        notificationsContainer.innerHTML = '<div class="text-center p-3"><div class="spinner-border spinner-border-sm text-primary" role="status"></div><span class="ms-2">Loading notifications...</span></div>';
        
        // Simulate API delay
        setTimeout(() => {
            // Sample notifications data
            const notifications = [
                {
                    id: 'notif1',
                    type: 'alert',
                    message: 'Safety issue detected in East Wing',
                    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                    read: false
                },
                {
                    id: 'notif2',
                    type: 'update',
                    message: 'Schedule updated based on today\'s progress',
                    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                    read: false
                },
                {
                    id: 'notif3',
                    type: 'message',
                    message: 'New message from Dave Wilson',
                    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
                    read: true
                }
            ];
            
            // Render notifications
            renderNotifications(notifications, notificationsContainer);
        }, 1000);
    }
}

/**
 * Renders notifications in the notifications panel
 * @param {Array} notifications - Array of notification objects
 * @param {Element} container - DOM element to render notifications in
 */
function renderNotifications(notifications, container) {
    if (notifications.length === 0) {
        container.innerHTML = '<div class="text-center p-3">No new notifications</div>';
        return;
    }
    
    let notificationsHTML = '';
    
    notifications.forEach(notification => {
        let iconClass = 'info-circle text-primary';
        
        if (notification.type === 'alert') {
            iconClass = 'exclamation-triangle text-danger';
        } else if (notification.type === 'update') {
            iconClass = 'sync text-success';
        } else if (notification.type === 'message') {
            iconClass = 'comment text-info';
        }
        
        const timeAgo = formatTimeAgo(new Date(notification.timestamp));
        const readClass = notification.read ? 'read' : 'unread';
        
        notificationsHTML += `
            <div class="notification-item ${readClass} p-3 border-bottom" data-id="${notification.id}">
                <div class="d-flex align-items-center">
                    <div class="notification-icon me-3">
                        <i class="fas fa-${iconClass}"></i>
                    </div>
                    <div class="notification-content">
                        <p class="mb-1">${notification.message}</p>
                        <p class="text-muted small mb-0">${timeAgo}</p>
                    </div>
                    <div class="ms-auto">
                        <button class="btn btn-sm text-muted mark-read" data-id="${notification.id}">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = notificationsHTML;
    
    // Add event listeners to mark as read buttons
    const markReadButtons = container.querySelectorAll('.mark-read');
    markReadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const notificationId = this.getAttribute('data-id');
            markNotificationAsRead(notificationId);
            
            // Update UI
            const notificationItem = this.closest('.notification-item');
            notificationItem.classList.remove('unread');
            notificationItem.classList.add('read');
            this.style.display = 'none';
        });
    });
}

/**
 * Marks a notification as read (simulated)
 * @param {string} notificationId - ID of the notification to mark as read
 */
function markNotificationAsRead(notificationId) {
    // In a real app, this would be an API call
    console.log(`Marking notification ${notificationId} as read`);
    
    // Update notification count badge if it exists
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        const currentCount = parseInt(notificationBadge.textContent);
        if (currentCount > 1) {
            notificationBadge.textContent = currentCount - 1;
        } else {
            notificationBadge.style.display = 'none';
        }
    }
}

/**
 * Formats a date as a human-readable "time ago" string
 * @param {Date} date - The date to format
 * @returns {string} Human-readable time difference
 */
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Loads user preferences from local storage
 */
function loadUserPreferences() {
    const savedPreferences = localStorage.getItem('siteflow_user_preferences');
    
    if (savedPreferences) {
        try {
            const preferences = JSON.parse(savedPreferences);
            SiteFlow.currentUser.preferences = { ...SiteFlow.currentUser.preferences, ...preferences };
            
            // Apply preferences
            if (preferences.darkMode) {
                document.body.classList.add('dark-mode');
                
                // Update theme toggle icon if it exists
                const themeIcon = document.querySelector('.theme-toggle i');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }
        } catch (e) {
            console.error('Error loading user preferences:', e);
        }
    }
}

/**
 * Saves user preferences to local storage
 */
function saveUserPreferences() {
    try {
        localStorage.setItem('siteflow_user_preferences', JSON.stringify(SiteFlow.currentUser.preferences));
    } catch (e) {
        console.error('Error saving user preferences:', e);
    }
}

/**
 * Handles API requests (simulated)
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise} Promise resolving to the API response
 */
function apiRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
        // In a real app, this would be a fetch call to the API
        // For demo purposes, we're using setTimeout to simulate a network request
        
        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% success rate
                // Generate mock response based on endpoint
                let response;
                
                switch (endpoint) {
                    case '/projects/current':
                        response = { ...SiteFlow.projectData };
                        break;
                    case '/user/profile':
                        response = { ...SiteFlow.currentUser };
                        break;
                    default:
                        response = { status: 'success', message: 'Operation completed' };
                }
                
                resolve(response);
            } else {
                reject(new Error('API request failed'));
            }
        }, 500);
    });
}

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
            <div class="toast-header">
                <span class="rounded me-2 bg-${type}" style="width: 20px; height: 20px;"></span>
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <small>Just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: duration });
    toast.show();
    
    // Remove toast from DOM after hiding
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}