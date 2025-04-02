/**
 * SiteFlow - Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize progress chart
    initializeProgressChart();

    // Handle file upload UI
    initializeFileUpload();

    // Setup task completion handlers
    setupTaskCompletionHandlers();

    // Initialize AI chat functionality
    initializeAIChat();
});

/**
 * Initializes the project progress chart
 */
function initializeProgressChart() {
    const ctx = document.getElementById('progressChart');
    
    if (!ctx) return;

    const progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            datasets: [
                {
                    label: 'Planned Progress',
                    data: [10, 25, 35, 48, 56, 63, 69, 75],
                    borderColor: '#64748b',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.4
                },
                {
                    label: 'Actual Progress',
                    data: [8, 20, 32, 45, 55, 65, 68, 68],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Sets up the file upload UI interactions
 */
function initializeFileUpload() {
    const browseFiles = document.getElementById('browseFiles');
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const uploadArea = document.querySelector('.upload-area');

    if (browseFiles && fileInput) {
        browseFiles.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', function(e) {
            handleFileSelection(e.target.files);
        });
    }

    if (uploadArea) {
        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            uploadArea.classList.add('bg-light');
        }

        function unhighlight() {
            uploadArea.classList.remove('bg-light');
        }

        uploadArea.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFileSelection(files);
        });
    }

    if (uploadButton) {
        uploadButton.addEventListener('click', function() {
            // Simulate successful upload
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadPhotoModal'));
            
            // Show success message
            alert('Photos uploaded successfully! AI is analyzing the content...');
            
            // Close modal
            modal.hide();
            
            // Refresh activity feed (simulated)
            setTimeout(function() {
                const activityFeed = document.querySelector('.activity-feed');
                if (activityFeed) {
                    const newActivity = document.createElement('li');
                    newActivity.className = 'list-group-item p-3';
                    newActivity.innerHTML = `
                        <div class="d-flex">
                            <div class="activity-icon me-3">
                                <i class="fas fa-camera text-primary"></i>
                            </div>
                            <div>
                                <p class="mb-1"><strong>You</strong> uploaded new photos to <a href="#">${document.getElementById('photoLocation').value}</a></p>
                                <p class="text-muted small mb-0">Just now</p>
                            </div>
                        </div>
                    `;
                    activityFeed.prepend(newActivity);
                }
            }, 500);
        });
    }
}

/**
 * Handles file selection for upload
 * @param {FileList} files - The selected files
 */
function handleFileSelection(files) {
    if (files.length > 0) {
        // Display selected files (simplified)
        const uploadArea = document.querySelector('.upload-area');
        
        if (uploadArea) {
            let fileListHTML = '<div class="selected-files mt-3">';
            fileListHTML += '<h6>Selected Files:</h6>';
            fileListHTML += '<ul class="list-group">';
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                fileListHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span><i class="fas fa-image me-2"></i>${file.name}</span>
                        <span class="badge bg-primary rounded-pill">${formatFileSize(file.size)}</span>
                    </li>
                `;
            }
            
            fileListHTML += '</ul></div>';
            
            // Check if there's already a file list and replace it
            const existingFileList = uploadArea.querySelector('.selected-files');
            if (existingFileList) {
                existingFileList.remove();
            }
            
            uploadArea.insertAdjacentHTML('beforeend', fileListHTML);
        }
    }
}

/**
 * Formats file size in a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Sets up task completion handlers
 */
function setupTaskCompletionHandlers() {
    const taskCheckboxes = document.querySelectorAll('.task-list .form-check-input');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            const statusBadge = label.nextElementSibling;
            
            if (this.checked) {
                label.classList.add('text-decoration-line-through');
                statusBadge.textContent = 'Completed';
                statusBadge.classList.remove('bg-primary', 'bg-blue');
                statusBadge.classList.add('bg-success');
            } else {
                label.classList.remove('text-decoration-line-through');
                
                // Check time to determine status
                const timeText = this.closest('.list-group-item').querySelector('.text-muted').textContent;
                const timeHour = parseInt(timeText.split(':')[0]);
                const currentHour = new Date().getHours();
                
                if (timeHour <= currentHour) {
                    statusBadge.textContent = 'In Progress';
                    statusBadge.classList.remove('bg-success', 'bg-blue');
                    statusBadge.classList.add('bg-primary');
                } else {
                    statusBadge.textContent = 'Upcoming';
                    statusBadge.classList.remove('bg-success', 'bg-primary');
                    statusBadge.classList.add('bg-blue');
                }
            }
            
            // Update stats
            updateTaskStats();
        });
    });
}

/**
 * Updates task statistics based on checkbox states
 */
function updateTaskStats() {
    const totalTasks = document.querySelectorAll('.task-list .form-check-input').length;
    const completedTasks = document.querySelectorAll('.task-list .form-check-input:checked').length;
    const todayTasksProgress = document.querySelector('.card-body .progress-bar');
    const todayTasksText = document.querySelector('.card-body h2');
    const todayTasksInfo = document.querySelector('.card-body p.small');
    
    if (todayTasksProgress && todayTasksText && todayTasksInfo) {
        const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
        
        todayTasksProgress.style.width = `${completionPercentage}%`;
        todayTasksProgress.setAttribute('aria-valuenow', completionPercentage);
        todayTasksText.textContent = `${completedTasks}`;
        todayTasksInfo.textContent = `${completedTasks} of ${totalTasks} completed (${completionPercentage}%)`;
    }
}

/**
 * Initializes the AI chat functionality
 */
function initializeAIChat() {
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');
    const chatContainer = document.querySelector('.chat-container');
    
    if (chatInput && chatButton && chatContainer) {
        chatButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            const message = chatInput.value.trim();
            
            if (message) {
                // Add user message
                const userMessageHTML = `
                    <div class="chat-message user mb-3">
                        <div class="d-flex justify-content-end">
                            <div class="message-bubble bg-primary text-white">
                                <p class="mb-0">${message}</p>
                            </div>
                        </div>
                    </div>
                `;
                
                chatContainer.insertAdjacentHTML('beforeend', userMessageHTML);
                
                // Clear input
                chatInput.value = '';
                
                // Scroll to bottom
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
                // Simulate AI response (in real app, this would be an API call)
                setTimeout(() => {
                    simulateAIResponse(message);
                }, 1000);
            }
        }
        
        function simulateAIResponse(userMessage) {
            let aiResponse = '';
            
            // Simple pattern matching for demo purposes
            if (userMessage.toLowerCase().includes('progress')) {
                aiResponse = `The overall project is 68% complete, which is 3% ahead of schedule. The East Wing is making the most progress at 85% completion.`;
            } else if (userMessage.toLowerCase().includes('safety') || userMessage.toLowerCase().includes('issue')) {
                aiResponse = `There are currently 3 open safety issues that need attention. The most critical one is related to electrical wiring on Level 2, Room B.`;
            } else if (userMessage.toLowerCase().includes('schedule') || userMessage.toLowerCase().includes('task')) {
                aiResponse = `You have 3 remaining tasks for today: reviewing drywall installation, inspecting HVAC, and conducting the afternoon safety walk.`;
            } else {
                aiResponse = `I'm analyzing the project data based on your query. Would you like me to focus on a specific area or aspect of the project?`;
            }
            
            // Add AI response
            const aiMessageHTML = `
                <div class="chat-message ai">
                    <div class="d-flex">
                        <div class="avatar me-2">
                            <i class="fas fa-robot bg-primary text-white"></i>
                        </div>
                        <div class="message-bubble">
                            <p class="mb-0">${aiResponse}</p>
                        </div>
                    </div>
                </div>
            `;
            
            chatContainer.insertAdjacentHTML('beforeend', aiMessageHTML);
            
            // Scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
}