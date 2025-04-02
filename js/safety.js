/**
 * SiteFlow - Safety JavaScript
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

    // Initialize safety trends chart
    initializeSafetyTrendChart();

    // Setup form handlers
    setupSafetyWalkForm();
    setupSafetyIssueForm();

    // Setup filter functionality
    setupFilters();

    // Setup issue details
    setupIssueDetails();

    // Setup file uploads
    setupFileUpload();
});

/**
 * Initializes the safety trend chart
 */
function initializeSafetyTrendChart() {
    const ctx = document.getElementById('safetyTrendChart');
    
    if (!ctx) return;

    const safetyTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Safety Score',
                    data: [92, 94, 93, 96, 97, 97, 98],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'PPE Compliance',
                    data: [90, 92, 95, 96, 98, 97, 98],
                    borderColor: '#3b82f6',
                    backgroundColor: 'transparent',
                    tension: 0.4
                },
                {
                    label: 'Open Issues',
                    data: [8, 7, 6, 5, 5, 4, 3],
                    borderColor: '#ef4444',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
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
                    title: {
                        display: true,
                        text: 'Compliance %'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y1: {
                    beginAtZero: true,
                    max: 10,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Issue Count'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

/**
 * Sets up the safety walk form submission
 */
function setupSafetyWalkForm() {
    const safetyWalkForm = document.getElementById('safetyWalkForm');
    const walkRecurring = document.getElementById('walkRecurring');
    const recurringOptions = document.querySelector('#scheduleSafetyWalkModal .recurring-options');
    
    if (safetyWalkForm) {
        safetyWalkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.checkValidity()) {
                addSafetyWalk();
                
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleSafetyWalkModal'));
                modal.hide();
                
                // Success message
                showToast('Safety walk scheduled successfully!', 'success');
            }
            
            this.classList.add('was-validated');
        });
    }
    
    if (walkRecurring && recurringOptions) {
        walkRecurring.addEventListener('change', function() {
            if (this.checked) {
                recurringOptions.classList.remove('d-none');
            } else {
                recurringOptions.classList.add('d-none');
            }
        });
    }
    
    // Set default date and time
    const walkDate = document.getElementById('walkDate');
    const walkTime = document.getElementById('walkTime');
    
    if (walkDate && walkTime) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        walkDate.value = tomorrow.toISOString().split('T')[0];
        walkTime.value = '09:00';
    }
}

/**
 * Adds a new safety walk to the schedule
 */
function addSafetyWalk() {
    // Get form values
    const walkTitle = document.getElementById('walkTitle').value;
    const walkDate = document.getElementById('walkDate').value;
    const walkTime = document.getElementById('walkTime').value;
    const walkArea = document.getElementById('walkArea').value;
    const walkAssignee = document.getElementById('walkAssignee').value;
    const walkNotes = document.getElementById('walkNotes').value;
    const walk360Camera = document.getElementById('walk360Camera').checked;
    const walkRecurring = document.getElementById('walkRecurring').checked;
    
    // Get display names
    const areaDisplay = document.querySelector(`#walkArea option[value="${walkArea}"]`).textContent;
    const assigneeDisplay = document.querySelector(`#walkAssignee option[value="${walkAssignee}"]`).textContent;
    
    // Format date for display
    const walkDateTime = new Date(`${walkDate}T${walkTime}`);
    const dateOptions = { month: 'short', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit' };
    
    const formattedDate = walkDateTime.toLocaleDateString('en-US', dateOptions);
    const formattedTime = walkDateTime.toLocaleTimeString('en-US', timeOptions);
    
    // Create badge based on date
    let badgeText = formattedDate;
    let badgeClass = 'bg-success';
    
    if (isToday(walkDateTime)) {
        badgeText = 'Today';
        badgeClass = 'bg-primary';
    } else if (isTomorrow(walkDateTime)) {
        badgeText = 'Tomorrow';
        badgeClass = 'bg-success';
    }
    
    // Create new walk item HTML
    const walkHTML = `
        <li class="list-group-item p-3">
            <div class="d-flex justify-content-between">
                <div>
                    <h6 class="mb-1">${walkTitle}</h6>
                    <p class="text-muted small mb-0">${areaDisplay} - ${badgeText}, ${formattedTime}</p>
                    <p class="text-muted small mb-0">Assigned to: ${assigneeDisplay}</p>
                </div>
                <div class="badge ${badgeClass} align-self-start">${badgeText}</div>
            </div>
        </li>
    `;
    
    // Add to safety walks list
    const safetyWalksList = document.querySelector('.safety-walks');
    
    if (safetyWalksList) {
        safetyWalksList.insertAdjacentHTML('beforeend', walkHTML);
        
        // Re-sort the list by date
        const listItems = Array.from(safetyWalksList.querySelectorAll('li'));
        
        listItems.sort((a, b) => {
            const aDateText = a.querySelector('p.text-muted').textContent.split(' - ')[1].split(', ')[0];
            const bDateText = b.querySelector('p.text-muted').textContent.split(' - ')[1].split(', ')[0];
            
            // Today comes first
            if (aDateText === 'Today') return -1;
            if (bDateText === 'Today') return 1;
            
            // Tomorrow comes next
            if (aDateText === 'Tomorrow' && bDateText !== 'Today') return -1;
            if (bDateText === 'Tomorrow' && aDateText !== 'Today') return 1;
            
            // For other dates, convert to actual dates and compare
            const aDate = new Date(aDateText + ' ' + new Date().getFullYear());
            const bDate = new Date(bDateText + ' ' + new Date().getFullYear());
            
            return aDate - bDate;
        });
        
        // Clear and re-append the sorted items
        safetyWalksList.innerHTML = '';
        listItems.forEach(item => safetyWalksList.appendChild(item));
        
        // Add click handler
        const newItem = safetyWalksList.querySelector('li:last-child');
        newItem.addEventListener('click', function() {
            // In a real app, this would show walk details
            alert(`Safety Walk Details: ${walkTitle}`);
        });
    }
    
    // Reset form
    document.getElementById('safetyWalkForm').reset();
    document.querySelector('#scheduleSafetyWalkModal .recurring-options').classList.add('d-none');
    
    // Update safety stats
    const safetyWalksCount = document.querySelector('.card-body h2:nth-of-type(3)');
    if (safetyWalksCount) {
        const currentCount = parseInt(safetyWalksCount.textContent);
        safetyWalksCount.textContent = currentCount + 1;
        
        // Update progress bar
        const walksProgressBar = document.querySelector('.card-body:nth-of-type(3) .progress-bar');
        const walksProgressText = document.querySelector('.card-body:nth-of-type(3) p.small');
        
        if (walksProgressBar && walksProgressText) {
            const newPercentage = Math.round(((currentCount + 1) / 20) * 100);
            walksProgressBar.style.width = `${newPercentage}%`;
            walksProgressBar.setAttribute('aria-valuenow', newPercentage);
            walksProgressText.textContent = `${currentCount + 1} out of 20 scheduled walks completed (${newPercentage}%)`;
        }
    }
}

/**
 * Sets up the safety issue form submission
 */
function setupSafetyIssueForm() {
    const safetyIssueForm = document.getElementById('safetyIssueForm');
    
    if (safetyIssueForm) {
        safetyIssueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.checkValidity()) {
                addSafetyIssue();
                
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('reportSafetyIssueModal'));
                modal.hide();
                
                // Success message
                showToast('Safety issue reported successfully!', 'success');
            }
            
            this.classList.add('was-validated');
        });
    }
}

/**
 * Adds a new safety issue to the list
 */
function addSafetyIssue() {
    // Get form values
    const issueTitle = document.getElementById('issueTitle').value;
    const issueDescription = document.getElementById('issueDescription').value;
    const issueArea = document.getElementById('issueArea').value;
    const issueFloor = document.getElementById('issueFloor').value;
    const issuePriority = document.getElementById('issuePriority').value;
    const issueCategory = document.getElementById('issueCategory').value;
    const issueAssignee = document.getElementById('issueAssignee').value;
    const aiAnalyze = document.getElementById('aiAnalyzeCheck').checked;
    
    // Get display names
    const areaDisplay = document.querySelector(`#issueArea option[value="${issueArea}"]`).textContent;
    const priorityDisplay = document.querySelector(`#issuePriority option[value="${issuePriority}"]`).textContent;
    const floorDisplay = document.querySelector(`#issueFloor option[value="${issueFloor}"]`).textContent;
    
    // Create priority badge
    let priorityClass = 'bg-info';
    
    switch (issuePriority) {
        case 'low':
            priorityClass = 'bg-info';
            break;
        case 'medium':
            priorityClass = 'bg-warning';
            break;
        case 'high':
        case 'critical':
            priorityClass = 'bg-danger';
            break;
    }
    
    // Format date for display
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Create new issue row HTML
    const issueHTML = `
        <tr>
            <td>${document.querySelectorAll('table tbody tr').length + 1}</td>
            <td>${issueTitle}</td>
            <td>${areaDisplay}</td>
            <td>John Carpenter</td>
            <td>${formattedDate}</td>
            <td><span class="badge ${priorityClass}">${priorityDisplay}</span></td>
            <td><span class="badge bg-warning">In Progress</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-secondary view-issue" data-bs-toggle="tooltip" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="tooltip" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
    
    // Add to issues table
    const issuesTable = document.querySelector('table tbody');
    
    if (issuesTable) {
        // Add the new issue at the top of the table
        issuesTable.insertAdjacentHTML('afterbegin', issueHTML);
        
        // Add click handler for view button
        const viewButton = issuesTable.querySelector('tr:first-child .view-issue');
        
        if (viewButton) {
            viewButton.addEventListener('click', function() {
                showIssueDetails({
                    id: Math.floor(Math.random() * 1000),
                    title: issueTitle,
                    description: issueDescription,
                    area: areaDisplay,
                    floor: floorDisplay,
                    priority: priorityDisplay,
                    priorityClass: priorityClass,
                    category: document.querySelector(`#issueCategory option[value="${issueCategory}"]`).textContent,
                    assignee: issueAssignee ? document.querySelector(`#issueAssignee option[value="${issueAssignee}"]`).textContent : 'Unassigned',
                    status: 'In Progress',
                    reportedBy: 'John Carpenter',
                    reportedDate: formattedDate,
                    aiAnalyzed: aiAnalyze
                });
            });
        }
    }
    
    // Update safety stats
    const openIssuesCount = document.querySelector('.card-body h2:nth-of-type(2)');
    if (openIssuesCount) {
        const currentCount = parseInt(openIssuesCount.textContent);
        openIssuesCount.textContent = currentCount + 1;
    }
    
    // Reset form
    document.getElementById('safetyIssueForm').reset();
}

/**
 * Checks if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} Whether the date is today
 */
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

/**
 * Checks if a date is tomorrow
 * @param {Date} date - The date to check
 * @returns {boolean} Whether the date is tomorrow
 */
function isTomorrow(date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getFullYear() === tomorrow.getFullYear();
}

/**
 * Sets up filter functionality
 */
function setupFilters() {
    const issueFilter = document.querySelector('.card-header select');
    
    if (issueFilter) {
        issueFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = document.querySelectorAll('table tbody tr');
            
            rows.forEach(row => {
                const statusCell = row.querySelector('td:nth-child(7) .badge');
                const isResolved = statusCell.textContent === 'Resolved';
                
                if (filterValue === 'all' || 
                    (filterValue === 'open' && !isResolved) || 
                    (filterValue === 'resolved' && isResolved)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Sets up issue details functionality
 */
function setupIssueDetails() {
    const viewIssueButtons = document.querySelectorAll('.view-issue');
    
    viewIssueButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Sample issue data (in a real app, this would come from an API)
            const issueData = {
                id: 1001 + index,
                title: button.closest('tr').querySelector('td:nth-child(2)').textContent,
                description: 'Detailed description of the safety issue would appear here.',
                area: button.closest('tr').querySelector('td:nth-child(3)').textContent,
                floor: index === 0 ? 'Level 4' : 'Level ' + (index + 1),
                priority: button.closest('tr').querySelector('td:nth-child(6) .badge').textContent,
                priorityClass: button.closest('tr').querySelector('td:nth-child(6) .badge').className.split(' ')[1],
                category: ['PPE Violation', 'Electrical Hazard', 'Fall Protection', 'Chemical/Material Hazard', 'Fire Safety'][index % 5],
                assignee: index === 2 ? 'Unassigned' : ['John Carpenter', 'Sarah Martinez', 'Mike Johnson', 'Dave Wilson'][index % 4],
                status: button.closest('tr').querySelector('td:nth-child(7) .badge').textContent,
                reportedBy: button.closest('tr').querySelector('td:nth-child(4)').textContent,
                reportedDate: button.closest('tr').querySelector('td:nth-child(5)').textContent,
                aiAnalyzed: true
            };
            
            showIssueDetails(issueData);
        });
    });
}

/**
 * Shows issue details in the modal
 * @param {Object} issue - The issue data object
 */
function showIssueDetails(issue) {
    const issueDetailsModal = document.getElementById('issueDetailsModal');
    const issueDetailsContainer = document.querySelector('.issue-details-container');
    const resolveIssueBtn = document.getElementById('resolveIssueBtn');
    
    if (!issueDetailsModal || !issueDetailsContainer) return;
    
    // Create status badge
    let statusClass = 'bg-warning';
    
    if (issue.status === 'Resolved') {
        statusClass = 'bg-success';
    } else if (issue.status === 'Open') {
        statusClass = 'bg-danger';
    }
    
    // Create AI analysis section
    let aiAnalysisHTML = '';
    
    if (issue.aiAnalyzed) {
        aiAnalysisHTML = `
            <div class="ai-recommendation">
                <div class="ai-recommendation-title">
                    <i class="fas fa-robot me-2"></i> AI Recommendation
                </div>
                <p class="mb-0">
                    Based on the image analysis, this appears to be a ${issue.priority.toLowerCase()} priority ${issue.category.toLowerCase()} issue. 
                    Similar issues have typically been resolved within 1-2 business days. 
                    Recommend immediate attention to prevent potential safety incidents.
                </p>
            </div>
        `;
    }
    
    // Create details HTML
    const detailsHTML = `
        <div class="issue-header mb-4">
            <div class="d-flex justify-content-between">
                <h4>${issue.title}</h4>
                <span class="badge ${issue.priorityClass} fs-6">${issue.priority}</span>
            </div>
            <div class="text-muted mt-2">
                <span class="badge ${statusClass}">${issue.status}</span>
                <span class="ms-2"><i class="fas fa-hashtag"></i> ${issue.id}</span>
            </div>
        </div>
        
        <div class="row issue-detail-row">
            <div class="col-md-3">
                <p class="issue-detail-label">Description</p>
            </div>
            <div class="col-md-9">
                <p>${issue.description}</p>
                ${aiAnalysisHTML}
            </div>
        </div>
        
        <div class="row issue-detail-row">
            <div class="col-md-3">
                <p class="issue-detail-label">Location</p>
            </div>
            <div class="col-md-9">
                <p>${issue.area}, ${issue.floor}</p>
            </div>
        </div>
        
        <div class="row issue-detail-row">
            <div class="col-md-3">
                <p class="issue-detail-label">Category</p>
            </div>
            <div class="col-md-9">
                <p>${issue.category}</p>
            </div>
        </div>
        
        <div class="row issue-detail-row">
            <div class="col-md-3">
                <p class="issue-detail-label">Assignee</p>
            </div>
            <div class="col-md-9">
                <p>${issue.assignee}</p>
            </div>
        </div>
        
        <div class="row issue-detail-row">
            <div class="col-md-3">
                <p class="issue-detail-label">Reported By</p>
            </div>
            <div class="col-md-9">
                <p>${issue.reportedBy} on ${issue.reportedDate}</p>
            </div>
        </div>
        
        <div class="row issue-detail-row">
            <div class="col-md-3">
                <p class="issue-detail-label">Photos</p>
            </div>
            <div class="col-md-9">
                <div class="issue-photos">
                    <div class="issue-photo">
                        <img src="../assets/images/safety-issue-1.jpg" alt="Safety Issue Photo">
                        <div class="issue-photo-overlay">Photo 1</div>
                    </div>
                    <div class="issue-photo">
                        <img src="../assets/images/safety-issue-2.jpg" alt="Safety Issue Photo">
                        <div class="issue-photo-overlay">Photo 2</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-3">
                <p class="issue-detail-label">Activity Timeline</p>
            </div>
            <div class="col-md-9">
                <div class="issue-timeline">
                    <div class="timeline-item danger">
                        <div class="timeline-date">
                            ${issue.reportedDate}
                        </div>
                        <div class="timeline-content">
                            <strong>${issue.reportedBy}</strong> reported the issue
                        </div>
                    </div>
                    <div class="timeline-item warning">
                        <div class="timeline-date">
                            ${issue.reportedDate} (10 minutes later)
                        </div>
                        <div class="timeline-content">
                            <strong>AI Safety System</strong> analyzed the photos and identified it as a <strong>${issue.priority}</strong> priority issue
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">
                            ${issue.reportedDate} (30 minutes later)
                        </div>
                        <div class="timeline-content">
                            <strong>Safety Team</strong> assigned this issue to <strong>${issue.assignee}</strong>
                        </div>
                    </div>
                    ${issue.status === 'Resolved' ? `
                    <div class="timeline-item success">
                        <div class="timeline-date">
                            ${new Date(new Date(issue.reportedDate).getTime() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div class="timeline-content">
                            <strong>${issue.assignee}</strong> marked this issue as resolved
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Set details content
    issueDetailsContainer.innerHTML = detailsHTML;
    
    // Update resolve button
    if (issue.status === 'Resolved') {
        resolveIssueBtn.style.display = 'none';
    } else {
        resolveIssueBtn.style.display = '';
        resolveIssueBtn.addEventListener('click', function() {
            resolveIssue(issue.id);
        });
    }
    
    // Update modal title
    document.getElementById('issueDetailsModalLabel').textContent = `Issue #${issue.id} - ${issue.title}`;
    
    // Show modal
    const modal = new bootstrap.Modal(issueDetailsModal);
    modal.show();
}

/**
 * Resolves an issue
 * @param {number} issueId - The ID of the issue to resolve
 */
function resolveIssue(issueId) {
    // In a real app, this would be an API call
    
    // Update timeline in the modal
    const issueTimeline = document.querySelector('.issue-timeline');
    
    if (issueTimeline) {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const newTimelineItem = document.createElement('div');
        newTimelineItem.className = 'timeline-item success';
        newTimelineItem.innerHTML = `
            <div class="timeline-date">
                ${today}
            </div>
            <div class="timeline-content">
                <strong>John Carpenter</strong> marked this issue as resolved
            </div>
        `;
        
        issueTimeline.appendChild(newTimelineItem);
    }
    
    // Update status in the modal
    const statusBadge = document.querySelector('.issue-header .badge');
    
    if (statusBadge) {
        statusBadge.className = 'badge bg-success fs-6';
        statusBadge.textContent = 'Resolved';
    }
    
    // Hide resolve button
    document.getElementById('resolveIssueBtn').style.display = 'none';
    
    // Update issue in the table
    const issueRows = document.querySelectorAll('table tbody tr');
    
    issueRows.forEach(row => {
        // Find the row with matching issue ID (in a real app, this would be more precise)
        if (row.querySelector('td:nth-child(2)').textContent === document.getElementById('issueDetailsModalLabel').textContent.split(' - ')[1]) {
            // Update status
            const statusCell = row.querySelector('td:nth-child(7) span');
            statusCell.className = 'badge bg-success';
            statusCell.textContent = 'Resolved';
            
            // Add resolved class
            row.classList.add('resolved-row');
        }
    });
    
    // Update open issues count
    const openIssuesCount = document.querySelector('.card-body h2:nth-of-type(2)');
    if (openIssuesCount && parseInt(openIssuesCount.textContent) > 0) {
        const currentCount = parseInt(openIssuesCount.textContent);
        openIssuesCount.textContent = currentCount - 1;
    }
    
    // Success message
    showToast('Issue resolved successfully!', 'success');
}

/**
 * Sets up file upload functionality
 */
function setupFileUpload() {
    const browseFiles = document.getElementById('browseFiles');
    const fileInput = document.getElementById('fileInput');
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
            
            // Show AI analysis prompt if checked
            const aiAnalyzeCheck = document.getElementById('aiAnalyzeCheck');
            
            if (aiAnalyzeCheck && aiAnalyzeCheck.checked) {
                const aiPromptHTML = `
                    <div class="ai-prompt mt-3 p-3 border rounded bg-light">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-robot text-primary me-2"></i>
                            <div>
                                <strong>AI Analysis Preview</strong>
                                <p class="mb-0 small">The AI will analyze these photos for safety issues such as:</p>
                                <ul class="mb-0 small">
                                    <li>Missing or improper PPE</li>
                                    <li>Fall protection violations</li>
                                    <li>Electrical hazards</li>
                                    <li>Improper material storage</li>
                                    <li>Fire safety concerns</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                
                // Check if there's already an AI prompt and replace it
                const existingPrompt = uploadArea.querySelector('.ai-prompt');
                if (existingPrompt) {
                    existingPrompt.remove();
                }
                
                uploadArea.insertAdjacentHTML('beforeend', aiPromptHTML);
            }
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