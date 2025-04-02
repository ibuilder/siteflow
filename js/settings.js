/**
 * SiteFlow - Settings JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar (from main.js but duplicated here for completeness)
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

    // Setup account settings form
    setupAccountSettings();
    
    // Setup notification settings form
    setupNotificationSettings();
    
    // Setup privacy settings form
    setupPrivacySettings();
    
    // Setup preferences settings form
    setupPreferencesSettings();
    
    // Setup AI settings form
    setupAISettings();
    
    // Setup team management
    setupTeamManagement();
    
    // Setup integrations
    setupIntegrations();
    
    // Setup billing & subscription
    setupBilling();
    
    // Setup file uploads
    setupFileUpload();
});

/**
 * Sets up the account settings form
 */
function setupAccountSettings() {
    const accountForm = document.getElementById('account-settings-form');
    const profilePictureOverlay = document.querySelector('.profile-picture-overlay');
    
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, this would send the data to the server
            // For demo purposes, show a success message
            showToast('Account settings updated successfully!', 'success');
        });
    }
    
    if (profilePictureOverlay) {
        profilePictureOverlay.addEventListener('click', function() {
            // Simulate file input click
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.click();
            
            fileInput.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Update profile picture preview
                        const profilePicture = document.querySelector('.profile-picture');
                        profilePicture.src = e.target.result;
                        
                        // Show success message
                        showToast('Profile picture updated!', 'success');
                    }
                    
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        });
    }
}

/**
 * Sets up the notification settings form
 */
function setupNotificationSettings() {
    const notificationForm = document.getElementById('notification-settings-form');
    const resetButton = notificationForm?.querySelector('button[type="button"]');
    
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, this would send the data to the server
            // For demo purposes, show a success message
            showToast('Notification settings updated successfully!', 'success');
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset checkboxes to default values
            const emailSwitches = notificationForm.querySelectorAll('input[id$="Email"]');
            const appSwitches = notificationForm.querySelectorAll('input[id$="App"]');
            const pushSwitches = notificationForm.querySelectorAll('input[id$="Push"]');
            
            emailSwitches.forEach(checkbox => {
                checkbox.checked = checkbox.id !== 'marketingEmail' && checkbox.id !== 'teamMessageEmail';
            });
            
            appSwitches.forEach(checkbox => {
                checkbox.checked = true;
            });
            
            pushSwitches.forEach(checkbox => {
                checkbox.checked = checkbox.id !== 'progressUpdatePush';
            });
            
            showToast('Notification settings reset to default!', 'info');
        });
    }
}

/**
 * Sets up the privacy & security settings form
 */
function setupPrivacySettings() {
    const privacyForm = document.getElementById('privacy-settings-form');
    const twoFactorSwitch = document.getElementById('twoFactorAuth');
    const twoFactorSetup = document.querySelector('.two-factor-setup');
    const sessionTimeout = document.getElementById('sessionTimeout');
    const timeoutDuration = document.getElementById('timeoutDuration');
    const logoutAllButton = document.querySelector('button.btn-outline-danger.btn-sm');
    
    if (privacyForm) {
        privacyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, this would send the data to the server
            // For demo purposes, show a success message
            showToast('Privacy & security settings updated successfully!', 'success');
        });
    }
    
    if (twoFactorSwitch && twoFactorSetup) {
        twoFactorSwitch.addEventListener('change', function() {
            if (this.checked) {
                twoFactorSetup.classList.remove('d-none');
            } else {
                twoFactorSetup.classList.add('d-none');
            }
        });
    }
    
    if (sessionTimeout && timeoutDuration) {
        sessionTimeout.addEventListener('change', function() {
            timeoutDuration.disabled = !this.checked;
        });
    }
    
    if (logoutAllButton) {
        logoutAllButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out all other devices?')) {
                showToast('All other devices have been logged out!', 'success');
            }
        });
    }
    
    // Add event listeners for session logout buttons
    const logoutButtons = document.querySelectorAll('.table .btn-outline-danger');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const device = row.querySelector('td:first-child').textContent;
            
            if (confirm(`Are you sure you want to log out from ${device}?`)) {
                row.remove();
                showToast(`Logged out from ${device}!`, 'success');
            }
        });
    });
}

/**
 * Sets up the preferences settings form
 */
function setupPreferencesSettings() {
    const preferencesForm = document.getElementById('preferences-settings-form');
    const themeSelect = document.getElementById('theme');
    const colorOptions = document.querySelectorAll('.color-option');
    const fontSizeSelect = document.getElementById('fontSize');
    const resetButton = preferencesForm?.querySelector('button[type="button"]');
    
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, this would send the data to the server
            // For demo purposes, show a success message
            showToast('Preferences updated successfully!', 'success');
        });
    }
    
    if (colorOptions) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                colorOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // In a real app, this would update the color scheme
                const color = this.getAttribute('data-color');
                console.log(`Color scheme changed to: ${color}`);
            });
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset form to default values
            themeSelect.value = 'light';
            fontSizeSelect.value = 'medium';
            
            // Reset color scheme
            colorOptions.forEach(option => {
                if (option.getAttribute('data-color') === 'blue') {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
            
            // Reset widget checkboxes
            const widgetCheckboxes = document.querySelectorAll('.widget-item input[type="checkbox"]');
            widgetCheckboxes.forEach(checkbox => {
                checkbox.checked = checkbox.id !== 'weatherWidget';
            });
            
            // Reset schedule settings
            document.getElementById('defaultCalendarView').value = 'week';
            document.getElementById('workDaySun').checked = false;
            document.getElementById('workDayMon').checked = true;
            document.getElementById('workDayTue').checked = true;
            document.getElementById('workDayWed').checked = true;
            document.getElementById('workDayThu').checked = true;
            document.getElementById('workDayFri').checked = true;
            document.getElementById('workDaySat').checked = false;
            document.getElementById('workDayStart').value = '07:00';
            document.getElementById('workDayEnd').value = '17:00';
            
            showToast('Preferences reset to default!', 'info');
        });
    }
}

/**
 * Sets up the AI settings form
 */
function setupAISettings() {
    const aiForm = document.getElementById('ai-settings-form');
    const aiEnabled = document.getElementById('aiEnabled');
    const aiModel = document.getElementById('aiModel');
    const resetButton = aiForm?.querySelector('button[type="button"]');
    
    if (aiForm) {
        aiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, this would send the data to the server
            // For demo purposes, show a success message
            showToast('AI settings updated successfully!', 'success');
        });
    }
    
    if (aiEnabled && aiModel) {
        aiEnabled.addEventListener('change', function() {
            aiModel.disabled = !this.checked;
            
            // Disable all other AI-related checkboxes
            const aiCheckboxes = aiForm.querySelectorAll('input[type="checkbox"]:not(#aiEnabled)');
            aiCheckboxes.forEach(checkbox => {
                checkbox.disabled = !this.checked;
            });
            
            // Disable all AI-related selects
            const aiSelects = aiForm.querySelectorAll('select:not(#aiModel)');
            aiSelects.forEach(select => {
                select.disabled = !this.checked;
            });
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset form to default values
            document.getElementById('aiEnabled').checked = true;
            document.getElementById('aiModel').value = 'standard';
            document.getElementById('aiProactiveInsights').checked = true;
            document.getElementById('imageAnalysisEnabled').checked = true;
            document.getElementById('imageProcessingQuality').value = 'medium';
            document.getElementById('scheduleUpdates').checked = true;
            document.getElementById('safetyDetectionEnabled').checked = true;
            document.getElementById('safetyAlertThreshold').value = 'medium';
            document.getElementById('ppeDetection').checked = true;
            document.getElementById('aiImprovement').checked = true;
            document.getElementById('anonymousAnalytics').checked = true;
            
            showToast('AI settings reset to default!', 'info');
        });
    }
}

/**
 * Sets up the team management functionality
 */
function setupTeamManagement() {
    const inviteForm = document.getElementById('inviteTeamMemberForm');
    
    if (inviteForm) {
        inviteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('inviteEmail').value;
            const role = document.getElementById('inviteRole').value;
            const roleName = document.querySelector(`#inviteRole option[value="${role}"]`).textContent;
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('inviteTeamMemberModal'));
            modal.hide();
            
            // Show success message
            showToast(`Invitation sent to ${email} for the ${roleName} role!`, 'success');
            
            // In a real app, this would send the invitation
            // For demo purposes, add a new pending invitation to the table
            const membersTable = document.querySelector('#members table tbody');
            
            if (membersTable) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div>
                                <div>Pending Invitation</div>
                                <div class="small text-muted">Just now</div>
                            </div>
                        </div>
                    </td>
                    <td>${roleName}</td>
                    <td>${email}</td>
                    <td><span class="badge bg-secondary">Pending</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary">Resend</button>
                        <button class="btn btn-sm btn-outline-danger">Cancel</button>
                    </td>
                `;
                
                membersTable.appendChild(newRow);
                
                // Add event listeners to new buttons
                const resendButton = newRow.querySelector('.btn-outline-secondary');
                const cancelButton = newRow.querySelector('.btn-outline-danger');
                
                resendButton.addEventListener('click', function() {
                    showToast(`Invitation resent to ${email}!`, 'success');
                });
                
                cancelButton.addEventListener('click', function() {
                    if (confirm(`Are you sure you want to cancel the invitation to ${email}?`)) {
                        newRow.remove();
                        showToast(`Invitation to ${email} canceled!`, 'info');
                    }
                });
            }
            
            // Reset form
            inviteForm.reset();
        });
    }
    
    // Add event listeners for member action buttons
    const memberActionButtons = document.querySelectorAll('#members .dropdown-item');
    memberActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.textContent.trim();
            const row = this.closest('tr');
            const memberName = row.querySelector('td:first-child div div:first-child').textContent.trim();
            
            if (action === 'Remove') {
                if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
                    row.remove();
                    showToast(`${memberName} has been removed from the team!`, 'info');
                }
            } else {
                showToast(`Action "${action}" performed for ${memberName}!`, 'success');
            }
        });
    });
}

/**
 * Sets up the integrations functionality
 */
function setupIntegrations() {
    const connectButtons = document.querySelectorAll('.integration-actions .btn-primary');
    const disconnectButtons = document.querySelectorAll('.integration-actions .btn-link');
    
    connectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.integration-card');
            const integrationName = card.querySelector('h5').textContent;
            
            // In a real app, this would open a connection dialog
            // For demo purposes, simulate a successful connection
            showToast(`Connected to ${integrationName}!`, 'success');
            
            // Update button
            const actionsDiv = this.parentElement;
            actionsDiv.innerHTML = `
                <span class="text-success"><i class="fas fa-check-circle"></i> Connected</span>
                <button class="btn btn-link btn-sm text-danger">Disconnect</button>
            `;
            
            // Add event listener to new disconnect button
            actionsDiv.querySelector('.btn-link').addEventListener('click', function() {
                if (confirm(`Are you sure you want to disconnect from ${integrationName}?`)) {
                    actionsDiv.innerHTML = `
                        <button class="btn btn-primary btn-sm">Connect</button>
                    `;
                    
                    // Add event listener to new connect button
                    actionsDiv.querySelector('.btn-primary').addEventListener('click', connectHandler);
                    
                    showToast(`Disconnected from ${integrationName}!`, 'info');
                }
            });
        });
    });
    
    disconnectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.integration-card');
            const integrationName = card.querySelector('h5').textContent;
            
            if (confirm(`Are you sure you want to disconnect from ${integrationName}?`)) {
                const actionsDiv = this.parentElement;
                actionsDiv.innerHTML = `
                    <button class="btn btn-primary btn-sm">Connect</button>
                `;
                
                // Add event listener to new connect button
                actionsDiv.querySelector('.btn-primary').addEventListener('click', function() {
                    showToast(`Connected to ${integrationName}!`, 'success');
                    
                    // Update button
                    actionsDiv.innerHTML = `
                        <span class="text-success"><i class="fas fa-check-circle"></i> Connected</span>
                        <button class="btn btn-link btn-sm text-danger">Disconnect</button>
                    `;
                    
                    // Add event listener to new disconnect button
                    actionsDiv.querySelector('.btn-link').addEventListener('click', disconnectHandler);
                });
                
                showToast(`Disconnected from ${integrationName}!`, 'info');
            }
        });
    });
    
    function connectHandler() {
        const card = this.closest('.integration-card');
        const integrationName = card.querySelector('h5').textContent;
        
        showToast(`Connected to ${integrationName}!`, 'success');
        
        // Update button
        const actionsDiv = this.parentElement;
        actionsDiv.innerHTML = `
            <span class="text-success"><i class="fas fa-check-circle"></i> Connected</span>
            <button class="btn btn-link btn-sm text-danger">Disconnect</button>
        `;
        
        // Add event listener to new disconnect button
        actionsDiv.querySelector('.btn-link').addEventListener('click', disconnectHandler);
    }
    
    function disconnectHandler() {
        const card = this.closest('.integration-card');
        const integrationName = card.querySelector('h5').textContent;
        
        if (confirm(`Are you sure you want to disconnect from ${integrationName}?`)) {
            const actionsDiv = this.parentElement;
            actionsDiv.innerHTML = `
                <button class="btn btn-primary btn-sm">Connect</button>
            `;
            
            // Add event listener to new connect button
            actionsDiv.querySelector('.btn-primary').addEventListener('click', connectHandler);
            
            showToast(`Disconnected from ${integrationName}!`, 'info');
        }
    }
}

/**
 * Sets up the billing & subscription functionality
 */
function setupBilling() {
    const upgradeButton = document.querySelector('.plan-actions .btn-primary');
    const cancelButton = document.querySelector('.plan-actions .btn-link');
    const changeCardButton = document.querySelector('.payment-card .btn-outline-secondary');
    const updateAddressButton = document.querySelector('.billing-address + .btn-outline-secondary');
    
    if (upgradeButton) {
        upgradeButton.addEventListener('click', function() {
            // In a real app, this would open a plan selection dialog
            // For demo purposes, show a message
            alert('This would open a plan selection dialog in a real application.');
        });
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel your subscription? This will downgrade your account to the free plan.')) {
                showToast('Your subscription has been canceled. You will be downgraded to the free plan at the end of your billing cycle.', 'info');
            }
        });
    }
    
    if (changeCardButton) {
        changeCardButton.addEventListener('click', function() {
            // In a real app, this would open a payment method dialog
            // For demo purposes, show a message
            alert('This would open a payment method dialog in a real application.');
        });
    }
    
    if (updateAddressButton) {
        updateAddressButton.addEventListener('click', function() {
            // In a real app, this would open an address form
            // For demo purposes, show a message
            alert('This would open an address form in a real application.');
        });
    }
}

/**
 * Sets up file upload functionality
 */
function setupFileUpload() {
    const browseFiles = document.getElementById('browseFiles');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.querySelector('.upload-area');
    const uploadButton = document.getElementById('uploadButton');

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
            showToast('Photos uploaded successfully! AI is analyzing the content...', 'success');
            
            // Close modal
            modal.hide();
        });
    }
}

/**
 * Handles file selection for upload
 * @param {FileList} files - The selected files
 */
function handleFileSelection(files) {
    if (files.length > 0) {
        // Display selected files
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
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, danger, warning, info)
 */
function showToast(message, type = 'success') {
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
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
    toast.show();
}