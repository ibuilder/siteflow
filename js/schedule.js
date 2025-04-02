// Filter calendar/list by area
filterScheduleByArea(area);
});
}
}

/**
* Filters the schedule by area
* @param {string} area - The area to filter by
*/
function filterScheduleByArea(area) {
// Filter calendar events
if (window.calendar) {
const events = window.calendar.getEvents();

events.forEach(event => {
    const eventArea = event.extendedProps.area;
    
    if (area === 'all' || eventArea === area || eventArea === 'All Areas') {
        event.setProp('display', 'auto');
    } else {
        event.setProp('display', 'none');
    }
});
}

// Filter list view
const listRows = document.querySelectorAll('#listView tbody tr');

listRows.forEach(row => {
const rowArea = row.querySelector('td:nth-child(3)').textContent;

if (area === 'all' || rowArea === area || rowArea === 'All Areas') {
    row.style.display = '';
} else {
    row.style.display = 'none';
}
});
}

/**
* Sets up the task form functionality
*/
function setupTaskForm() {
const taskForm = document.getElementById('addTaskForm');
const taskRecurring = document.getElementById('taskRecurring');
const recurringOptions = document.querySelector('.recurring-options');

if (taskForm) {
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.checkValidity()) {
        addNewTask();
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
        modal.hide();
        
        // Success message
        showToast('Task added successfully!', 'success');
    }
    
    this.classList.add('was-validated');
});
}

if (taskRecurring && recurringOptions) {
taskRecurring.addEventListener('change', function() {
    if (this.checked) {
        recurringOptions.classList.remove('d-none');
    } else {
        recurringOptions.classList.add('d-none');
    }
});
}

// Set default dates
const taskStartDate = document.getElementById('taskStartDate');
const taskDueDate = document.getElementById('taskDueDate');

if (taskStartDate && taskDueDate) {
const today = new Date().toISOString().split('T')[0];
taskStartDate.value = today;
taskDueDate.value = today;

// Ensure due date is not before start date
taskStartDate.addEventListener('change', function() {
    if (taskDueDate.value < this.value) {
        taskDueDate.value = this.value;
    }
});
}
}

/**
* Adds a new task to the schedule
*/
function addNewTask() {
// Get form values
const taskName = document.getElementById('taskName').value;
const taskArea = document.getElementById('taskArea').value;
const taskAssignee = document.getElementById('taskAssignee').value;
const taskStartDate = document.getElementById('taskStartDate').value;
const taskDueDate = document.getElementById('taskDueDate').value;
const taskStatus = document.getElementById('taskStatus').value;
const taskPriority = document.getElementById('taskPriority').value;
const taskRecurring = document.getElementById('taskRecurring').checked;

// Get display names
const areaDisplay = document.querySelector(`#taskArea option[value="${taskArea}"]`).textContent;
const assigneeDisplay = document.querySelector(`#taskAssignee option[value="${taskAssignee}"]`).textContent;

// Determine event class based on status and dates
let eventClass = 'fc-event-ontime';

if (taskStatus === 'completed') {
eventClass = 'fc-event-ontime';
} else if (isToday(new Date(taskStartDate))) {
eventClass = 'fc-event-today';
} else if (new Date(taskDueDate) < new Date()) {
eventClass = 'fc-event-overdue';
}

// Create event object for calendar
const newEvent = {
id: 'task' + Date.now(),
title: taskName,
start: taskStartDate + 'T09:00:00',
end: taskDueDate + 'T10:00:00',
classNames: [eventClass],
extendedProps: {
    status: taskStatus,
    area: areaDisplay,
    assignedTo: assigneeDisplay,
    priority: taskPriority,
    recurring: taskRecurring
}
};

// Add to calendar
if (window.calendar) {
window.calendar.addEvent(newEvent);
}

// Add to list view
addTaskToListView(newEvent);

// Add to upcoming tasks if applicable
if (shouldAddToUpcoming(newEvent)) {
addTaskToUpcomingList(newEvent);
}

// Reset form
document.getElementById('addTaskForm').reset();
document.querySelector('.recurring-options').classList.add('d-none');
}

/**
* Determines if a task should be added to the upcoming tasks list
* @param {Object} task - The task object
* @returns {boolean} Whether the task should be added to upcoming
*/
function shouldAddToUpcoming(task) {
const taskStart = new Date(task.start);
const now = new Date();

// Add if task is today or in the next 7 days and not completed
return (
task.extendedProps.status !== 'completed' &&
taskStart >= now &&
taskStart <= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
);
}

/**
* Adds a task to the list view
* @param {Object} task - The task object
*/
function addTaskToListView(task) {
const listView = document.querySelector('#listView tbody');

if (!listView) return;

// Format dates
const startDate = new Date(task.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const dueDate = new Date(task.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Determine status badge
let statusBadge = '';

switch (task.extendedProps.status) {
case 'completed':
    statusBadge = '<span class="badge bg-success">Completed</span>';
    break;
case 'in-progress':
    statusBadge = '<span class="badge bg-primary">In Progress</span>';
    break;
case 'not-started':
    statusBadge = '<span class="badge bg-primary">Upcoming</span>';
    break;
case 'on-hold':
    statusBadge = '<span class="badge bg-warning">On Hold</span>';
    break;
default:
    if (new Date(task.end) < new Date()) {
        statusBadge = '<span class="badge bg-danger">Overdue</span>';
    } else if (isToday(new Date(task.start))) {
        statusBadge = '<span class="badge bg-primary">Today</span>';
    } else {
        statusBadge = '<span class="badge bg-primary">Upcoming</span>';
    }
}

// Determine row class
let rowClass = '';

if (task.extendedProps.status === 'in-progress') {
rowClass = 'class="table-primary"';
} else if (new Date(task.end) < new Date() && task.extendedProps.status !== 'completed') {
rowClass = 'class="table-danger"';
}

// Create row HTML
const rowHTML = `
<tr ${rowClass} data-task-id="${task.id}">
    <td>${listView.children.length + 1}</td>
    <td>${task.title}</td>
    <td>${task.extendedProps.area}</td>
    <td>${task.extendedProps.assignedTo}</td>
    <td>${startDate}</td>
    <td>${dueDate}</td>
    <td>${statusBadge}</td>
    <td>
        <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-outline-secondary view-task" data-bs-toggle="tooltip" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
            <button type="button" class="btn btn-outline-secondary edit-task" data-bs-toggle="tooltip" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
        </div>
    </td>
</tr>
`;

// Add to list
listView.insertAdjacentHTML('beforeend', rowHTML);

// Add event listeners
const newRow = listView.lastElementChild;

newRow.querySelector('.view-task').addEventListener('click', function() {
const taskId = newRow.getAttribute('data-task-id');
const event = window.calendar.getEventById(taskId);
showTaskDetails(event);
});

newRow.querySelector('.edit-task').addEventListener('click', function() {
const taskId = newRow.getAttribute('data-task-id');
const event = window.calendar.getEventById(taskId);
editTask(event);
});
}

/**
* Adds a task to the upcoming tasks list
* @param {Object} task - The task object
*/
function addTaskToUpcomingList(task) {
const upcomingList = document.querySelector('.upcoming-tasks');

if (!upcomingList) return;

// Format date
const taskDate = new Date(task.start);
let dateText = '';
let badgeClass = '';

if (isToday(taskDate)) {
dateText = 'Today';
badgeClass = 'bg-primary';
} else if (isTomorrow(taskDate)) {
dateText = 'Tomorrow';
badgeClass = 'bg-success';
} else {
dateText = taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
badgeClass = 'bg-success';
}

// Format time
const timeText = taskDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

// Create list item HTML
const itemHTML = `
<li class="list-group-item p-3" data-task-id="${task.id}">
    <div class="d-flex justify-content-between">
        <div>
            <h6 class="mb-1">${task.title}</h6>
            <p class="text-muted small mb-0">${task.extendedProps.area} - ${dateText}, ${timeText}</p>
        </div>
        <div class="badge ${badgeClass} align-self-start">${dateText}</div>
    </div>
</li>
`;

// Add to list
upcomingList.insertAdjacentHTML('beforeend', itemHTML);

// Add event listener
const newItem = upcomingList.lastElementChild;

newItem.addEventListener('click', function() {
const taskId = this.getAttribute('data-task-id');
const event = window.calendar.getEventById(taskId);
showTaskDetails(event);
});
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
* Shows task details in a modal
* @param {Object} event - The FullCalendar event object
*/
function showTaskDetails(event) {
const taskDetailsModal = document.getElementById('taskDetailsModal');
const taskDetailsContainer = document.querySelector('.task-details-container');
const markCompletedBtn = document.getElementById('markCompletedBtn');

if (!taskDetailsModal || !taskDetailsContainer) return;

// Format dates
const startDate = new Date(event.start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const startTime = new Date(event.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const endDate = new Date(event.end).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const endTime = new Date(event.end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

// Determine status badge
let statusBadge = '';

switch (event.extendedProps.status) {
case 'completed':
    statusBadge = '<span class="badge bg-success">Completed</span>';
    break;
case 'in-progress':
    statusBadge = '<span class="badge bg-primary">In Progress</span>';
    break;
case 'not-started':
    statusBadge = '<span class="badge bg-primary">Not Started</span>';
    break;
case 'on-hold':
    statusBadge = '<span class="badge bg-warning">On Hold</span>';
    break;
case 'overdue':
    statusBadge = '<span class="badge bg-danger">Overdue</span>';
    break;
default:
    if (new Date(event.end) < new Date()) {
        statusBadge = '<span class="badge bg-danger">Overdue</span>';
    } else if (isToday(new Date(event.start))) {
        statusBadge = '<span class="badge bg-primary">Today</span>';
    } else {
        statusBadge = '<span class="badge bg-primary">Upcoming</span>';
    }
}

// Determine priority badge
let priorityBadge = '';

switch (event.extendedProps.priority) {
case 'low':
    priorityBadge = '<span class="badge bg-info">Low</span>';
    break;
case 'medium':
    priorityBadge = '<span class="badge bg-primary">Medium</span>';
    break;
case 'high':
    priorityBadge = '<span class="badge bg-warning">High</span>';
    break;
case 'critical':
    priorityBadge = '<span class="badge bg-danger">Critical</span>';
    break;
default:
    priorityBadge = '<span class="badge bg-primary">Medium</span>';
}

// Create details HTML
const detailsHTML = `
<div class="task-header mb-4">
    <h4>${event.title}</h4>
    <div class="d-flex gap-2 mt-2">
        ${statusBadge}
        ${priorityBadge}
        ${event.extendedProps.recurring ? '<span class="badge bg-secondary">Recurring</span>' : ''}
    </div>
</div>

<div class="row task-detail-row">
    <div class="col-md-3">
        <p class="task-detail-label">Area</p>
    </div>
    <div class="col-md-9">
        <p>${event.extendedProps.area}</p>
    </div>
</div>

<div class="row task-detail-row">
    <div class="col-md-3">
        <p class="task-detail-label">Assigned To</p>
    </div>
    <div class="col-md-9">
        <p>${event.extendedProps.assignedTo}</p>
    </div>
</div>

<div class="row task-detail-row">
    <div class="col-md-3">
        <p class="task-detail-label">Start</p>
    </div>
    <div class="col-md-9">
        <p>${startDate} at ${startTime}</p>
    </div>
</div>

<div class="row task-detail-row">
    <div class="col-md-3">
        <p class="task-detail-label">Due</p>
    </div>
    <div class="col-md-9">
        <p>${endDate} at ${endTime}</p>
    </div>
</div>

<div class="row task-detail-row">
    <div class="col-md-3">
        <p class="task-detail-label">Description</p>
    </div>
    <div class="col-md-9">
        <p>${event.extendedProps.description || 'No description provided.'}</p>
    </div>
</div>

<div class="row task-detail-row">
    <div class="col-md-3">
        <p class="task-detail-label">Attachments</p>
    </div>
    <div class="col-md-9">
        <div class="task-attachments">
            ${event.extendedProps.attachments ? 
              event.extendedProps.attachments.map(attachment => `
                <div class="attachment-item">
                    <i class="fas fa-file attachment-icon"></i>
                    <span>${attachment.name}</span>
                </div>
              `).join('') : 
              '<p>No attachments.</p>'
            }
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-3">
        <p class="task-detail-label">Comments</p>
    </div>
    <div class="col-md-9">
        <div class="task-comments">
            ${event.extendedProps.comments ? 
              event.extendedProps.comments.map(comment => `
                <div class="comment-item d-flex">
                    <img src="../assets/images/user-avatar.jpg" alt="${comment.author}" class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-meta">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-date">${comment.date}</span>
                        </div>
                        <p>${comment.text}</p>
                    </div>
                </div>
              `).join('') : 
              '<p>No comments yet.</p>'
            }
            
            <div class="comment-form mt-3">
                <textarea class="form-control mb-2" placeholder="Add a comment..."></textarea>
                <button class="btn btn-sm btn-primary">Submit Comment</button>
            </div>
        </div>
    </div>
</div>
`;

// Set details content
taskDetailsContainer.innerHTML = detailsHTML;

// Update mark completed button
if (event.extendedProps.status === 'completed') {
markCompletedBtn.style.display = 'none';
} else {
markCompletedBtn.style.display = '';
markCompletedBtn.addEventListener('click', function() {
    markTaskCompleted(event);
});
}

// Update edit button
const editTaskBtn = document.getElementById('editTaskBtn');

if (editTaskBtn) {
editTaskBtn.addEventListener('click', function() {
    editTask(event);
    
    // Close the details modal
    const modal = bootstrap.Modal.getInstance(taskDetailsModal);
    modal.hide();
});
}

// Show modal
const modal = new bootstrap.Modal(taskDetailsModal);
modal.show();
}

/**
* Marks a task as completed
* @param {Object} event - The FullCalendar event object
*/
function markTaskCompleted(event) {
// Update event properties
event.setExtendedProp('status', 'completed');
event.setProp('classNames', ['fc-event-ontime']);

// Update in list view
const listRow = document.querySelector(`#listView tr[data-task-id="${event.id}"]`);

if (listRow) {
// Remove any status classes
listRow.classList.remove('table-primary', 'table-danger');

// Update status cell
const statusCell = listRow.querySelector('td:nth-child(7)');
statusCell.innerHTML = '<span class="badge bg-success">Completed</span>';
}

// Update in upcoming tasks
const upcomingItem = document.querySelector(`.upcoming-tasks li[data-task-id="${event.id}"]`);

if (upcomingItem) {
upcomingItem.remove();
}

// Close the details modal
const modal = bootstrap.Modal.getInstance(document.getElementById('taskDetailsModal'));
modal.hide();

// Success message
showToast('Task marked as completed!', 'success');
}

/**
* Opens the add task modal with pre-filled dates
* @param {string} startStr - The start date string
* @param {string} endStr - The end date string
*/
function openAddTaskModal(startStr, endStr) {
const taskStartDate = document.getElementById('taskStartDate');
const taskDueDate = document.getElementById('taskDueDate');

if (taskStartDate && taskDueDate) {
// Format dates for input
const start = new Date(startStr);
const end = new Date(endStr);

taskStartDate.value = start.toISOString().split('T')[0];
taskDueDate.value = end.toISOString().split('T')[0];
}

// Show modal
const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
modal.show();
}

/**
* Updates the dates of a task
* @param {Object} event - The FullCalendar event object
*/
function updateTaskDates(event) {
// Update in list view
const listRow = document.querySelector(`#listView tr[data-task-id="${event.id}"]`);

if (listRow) {
// Format dates
const startDate = new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const endDate = new Date(event.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Update date cells
const startCell = listRow.querySelector('td:nth-child(5)');
const endCell = listRow.querySelector('td:nth-child(6)');

startCell.textContent = startDate;
endCell.textContent = endDate;
}

// Update in upcoming tasks
const upcomingItem = document.querySelector(`.upcoming-tasks li[data-task-id="${event.id}"]`);

if (upcomingItem) {
const taskDate = new Date(event.start);
let dateText = '';
let badgeClass = '';

if (isToday(taskDate)) {
    dateText = 'Today';
    badgeClass = 'bg-primary';
} else if (isTomorrow(taskDate)) {
    dateText = 'Tomorrow';
    badgeClass = 'bg-success';
} else {
    dateText = taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    badgeClass = 'bg-success';
}

// Format time
const timeText = taskDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

// Update item
const dateInfo = upcomingItem.querySelector('p.text-muted');
const badge = upcomingItem.querySelector('.badge');

dateInfo.textContent = `${event.extendedProps.area} - ${dateText}, ${timeText}`;
badge.textContent = dateText;
badge.className = `badge ${badgeClass} align-self-start`;
}

// Success message
showToast('Task schedule updated!', 'success');
}

/**
* Initialize a placeholder Gantt chart
*/
function initializeGanttChart() {
const ganttContainer = document.querySelector('.gantt-container');

if (!ganttContainer) return;

// For now, just show a placeholder message
// In a real app, this would initialize a proper Gantt chart library
ganttContainer.innerHTML = `
<div class="text-center py-5">
    <i class="fas fa-chart-gantt fa-3x text-muted mb-3"></i>
    <h5>Gantt Chart View</h5>
    <p class="text-muted">Timeline visualization for project tasks and dependencies</p>
</div>
`;
}

/**
* Sets up filter functionality
*/
function setupFilters() {
const scheduleView = document.getElementById('scheduleView');
const areaFilter = document.getElementById('areaFilter');
const workerFilter = document.getElementById('workerFilter');
const dateRangeFilter = document.getElementById('dateRangeFilter');

if (scheduleView) {
scheduleView.addEventListener('change', applyFilters);
}

if (areaFilter) {
areaFilter.addEventListener('change', function() {
    // Also update mini map if it exists
    const areaSelect = document.getElementById('areaSelect');
    if (areaSelect) {
        areaSelect.value = this.value;
    }
    
    // Update highlight on mini map
    const areaHighlights = document.querySelectorAll('.area-highlight');
    areaHighlights.forEach(highlight => {
        if (highlight.getAttribute('data-area') === this.value) {
            highlight.classList.add('active');
        } else {
            highlight.classList.remove('active');
        }
    });
    
    applyFilters();
});
}

if (workerFilter) {
workerFilter.addEventListener('change', applyFilters);
}

if (dateRangeFilter) {
dateRangeFilter.addEventListener('change', function() {
    // If custom range is selected, show date picker (in a real app)
    if (this.value === 'custom') {
        alert('In a full application, a date range picker would appear here.');
    }
    
    applyFilters();
});
}
}

/**
* Applies all filters to the calendar and list view
*/
function applyFilters() {
const scheduleView = document.getElementById('scheduleView');
const areaFilter = document.getElementById('areaFilter');
const workerFilter = document.getElementById('workerFilter');
const dateRangeFilter = document.getElementById('dateRangeFilter');

// Get filter values
const viewValue = scheduleView ? scheduleView.value : 'all';
const areaValue = areaFilter ? areaFilter.value : 'all';
const workerValue = workerFilter ? workerFilter.value : 'all';
const dateRangeValue = dateRangeFilter ? dateRangeFilter.value : 'week';

// Apply to calendar
if (window.calendar) {
const events = window.calendar.getEvents();

events.forEach(event => {
    let shouldShow = true;
    
    // Apply view filter
    if (viewValue !== 'all') {
        if (viewValue === 'my' && event.extendedProps.assignedTo !== 'John Carpenter') {
            shouldShow = false;
        } else if (viewValue === 'team' && event.extendedProps.assignedTo === 'John Carpenter') {
            shouldShow = false;
        } else if (viewValue === 'completed' && event.extendedProps.status !== 'completed') {
            shouldShow = false;
        } else if (viewValue === 'pending' && event.extendedProps.status === 'completed') {
            shouldShow = false;
        }
    }
    
    // Apply area filter
    if (areaValue !== 'all' && event.extendedProps.area !== document.querySelector(`#areaFilter option[value="${areaValue}"]`).textContent) {
        shouldShow = false;
    }
    
    // Apply worker filter
    if (workerValue !== 'all') {
        const workerName = document.querySelector(`#workerFilter option[value="${workerValue}"]`).textContent;
        
        if (workerValue !== 'unassigned') {
            if (event.extendedProps.assignedTo !== workerName) {
                shouldShow = false;
            }
        } else {
            if (event.extendedProps.assignedTo) {
                shouldShow = false;
            }
        }
    }
    
    // Apply date range filter
    if (dateRangeValue !== 'all') {
        const eventStart = new Date(event.start);
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const endOfQuarter = new Date(startOfQuarter);
        endOfQuarter.setMonth(endOfQuarter.getMonth() + 3);
        endOfQuarter.setDate(0);
        
        if (dateRangeValue === 'week') {
            if (eventStart < startOfWeek || eventStart > endOfWeek) {
                shouldShow = false;
            }
        } else if (dateRangeValue === 'month') {
            if (eventStart < startOfMonth || eventStart > endOfMonth) {
                shouldShow = false;
            }
        } else if (dateRangeValue === 'quarter') {
            if (eventStart < startOfQuarter || eventStart > endOfQuarter) {
                shouldShow = false;
            }
        }
    }
    
    // Update event display
    if (shouldShow) {
        event.setProp('display', 'auto');
    } else {
        event.setProp('display', 'none');
    }
});
}

// Apply to list view
const listRows = document.querySelectorAll('#listView tbody tr');

listRows.forEach(row => {
let shouldShow = true;

// Get row data
const taskArea = row.querySelector('td:nth-child(3)').textContent;
const taskAssignee = row.querySelector('td:nth-child(4)').textContent;
const taskStartDateStr = row.querySelector('td:nth-child(5)').textContent;
const taskStartDate = new Date(taskStartDateStr);
const taskStatus = row.querySelector('td:nth-child(7) .badge').textContent;

// Apply view filter
if (viewValue !== 'all') {
    if (viewValue === 'my' && taskAssignee !== 'John Carpenter') {
        shouldShow = false;
    } else if (viewValue === 'team' && taskAssignee === 'John Carpenter') {
        shouldShow = false;
    } else if (viewValue === 'completed' && taskStatus !== 'Completed') {
        shouldShow = false;
    } else if (viewValue === 'pending' && taskStatus === 'Completed') {
        shouldShow = false;
    }
}

// Apply area filter
if (areaValue !== 'all') {
    const areaName = document.querySelector(`#areaFilter option[value="${areaValue}"]`).textContent;
    
    if (taskArea !== areaName && taskArea !== 'All Areas') {
        shouldShow = false;
    }
}

// Apply worker filter
if (workerValue !== 'all') {
    const workerName = document.querySelector(`#workerFilter option[value="${workerValue}"]`).textContent;
    
    if (workerValue !== 'unassigned') {
        if (taskAssignee !== workerName) {
            shouldShow = false;
        }
    } else {
        if (taskAssignee) {
            shouldShow = false;
        }
    }
}

// Apply date range filter
if (dateRangeValue !== 'all') {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const endOfQuarter = new Date(startOfQuarter);
    endOfQuarter.setMonth(endOfQuarter.getMonth() + 3);
    endOfQuarter.setDate(0);
    
    if (dateRangeValue === 'week') {
        if (taskStartDate < startOfWeek || taskStartDate > endOfWeek) {
            shouldShow = false;
        }
    } else if (dateRangeValue === 'month') {
        if (taskStartDate < startOfMonth || taskStartDate > endOfMonth) {
            shouldShow = false;
        }
    } else if (dateRangeValue === 'quarter') {
        if (taskStartDate < startOfQuarter || taskStartDate > endOfQuarter) {
            shouldShow = false;
        }
    }
}

// Update row display
if (shouldShow) {
    row.style.display = '';
} else {
    row.style.display = 'none';
}
});
}

/**
* Opens the edit task form for a given event
* @param {Object} event - The FullCalendar event object
*/
function editTask(event) {
// Show modal
const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
modal.show();

// Update modal title
document.getElementById('addTaskModalLabel').textContent = 'Edit Task';
document.querySelector('#addTaskModal .modal-footer button[type="submit"]').textContent = 'Update Task';

// Pre-fill form fields
document.getElementById('taskName').value = event.title;

if (event.extendedProps.description) {
document.getElementById('taskDescription').value = event.extendedProps.description;
}

// Set area
const areaSelect = document.getElementById('taskArea');
const areaOptions = areaSelect.querySelectorAll('option');

areaOptions.forEach(option => {
if (option.textContent === event.extendedProps.area) {
    option.selected = true;
}
});

// Set assignee
const assigneeSelect = document.getElementById('taskAssignee');
const assigneeOptions = assigneeSelect.querySelectorAll('option');

assigneeOptions.forEach(option => {
if (option.textContent === event.extendedProps.assignedTo) {
    option.selected = true;
}
});

// Set dates
const startDate = new Date(event.start);
const endDate = new Date(event.end);

document.getElementById('taskStartDate').value = startDate.toISOString().split('T')[0];
document.getElementById('taskDueDate').value = endDate.toISOString().split('T')[0];

// Set status
const statusSelect = document.getElementById('taskStatus');
statusSelect.value = event.extendedProps.status || 'not-started';

// Set priority
const prioritySelect = document.getElementById('taskPriority');
prioritySelect.value = event.extendedProps.priority || 'medium';

// Set recurring
const recurringCheck = document.getElementById('taskRecurring');
const recurringOptions = document.querySelector('.recurring-options');

if (event.extendedProps.recurring) {
recurringCheck.checked = true;
recurringOptions.classList.remove('d-none');
} else {
recurringCheck.checked = false;
recurringOptions.classList.add('d-none');
}

// Update form submission handler
const form = document.getElementById('addTaskForm');

// Remove previous event listeners (important to avoid duplicates)
const newForm = form.cloneNode(true);
form.parentNode.replaceChild(newForm, form);

// Add new event listener
newForm.addEventListener('submit', function(e) {
e.preventDefault();

if (this.checkValidity()) {
    updateTask(event);
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
    modal.hide();
    
    // Success message
    showToast('Task updated successfully!', 'success');
}

this.classList.add('was-validated');
});
}

/**
* Updates an existing task
* @param {Object} event - The FullCalendar event object
*/
function updateTask(event) {
// Get form values
const taskName = document.getElementById('taskName').value;
const taskDescription = document.getElementById('taskDescription').value;
const taskArea = document.getElementById('taskArea').value;
const taskAssignee = document.getElementById('taskAssignee').value;
const taskStartDate = document.getElementById('taskStartDate').value;
const taskDueDate = document.getElementById('taskDueDate').value;
const taskStatus = document.getElementById('taskStatus').value;
const taskPriority = document.getElementById('taskPriority').value;
const taskRecurring = document.getElementById('taskRecurring').checked;

// Get display names
const areaDisplay = document.querySelector(`#taskArea option[value="${taskArea}"]`).textContent;
const assigneeDisplay = document.querySelector(`#taskAssignee option[value="${taskAssignee}"]`).textContent;

// Update event
event.setProp('title', taskName);
event.setStart(taskStartDate + 'T09:00:00');
event.setEnd(taskDueDate + 'T10:00:00');
event.setExtendedProp('status', taskStatus);
event.setExtendedProp('area', areaDisplay);
event.setExtendedProp('assignedTo', assigneeDisplay);
event.setExtendedProp('priority', taskPriority);
event.setExtendedProp('recurring', taskRecurring);
event.setExtendedProp('description', taskDescription);

// Determine event class based on status and dates
let eventClass = 'fc-event-ontime';

if (taskStatus === 'completed') {
eventClass = 'fc-event-ontime';
} else if (isToday(new Date(taskStartDate))) {
eventClass = 'fc-event-today';
} else if (new Date(taskDueDate) < new Date()) {
eventClass = 'fc-event-overdue';
}

event.setProp('classNames', [eventClass]);

// Update in list view
const listRow = document.querySelector(`#listView tr[data-task-id="${event.id}"]`);

if (listRow) {
// Format dates
const startDate = new Date(taskStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const dueDate = new Date(taskDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Determine status badge
let statusBadge = '';

switch (taskStatus) {
    case 'completed':
        statusBadge = '<span class="badge bg-success">Completed</span>';
        break;
    case 'in-progress':
        statusBadge = '<span class="badge bg-primary">In Progress</span>';
        break;
    case 'not-started':
        statusBadge = '<span class="badge bg-primary">Upcoming</span>';
        break;
    case 'on-hold':
        statusBadge = '<span class="badge bg-warning">On Hold</span>';
        break;
    default:
        if (new Date(taskDueDate) < new Date()) {
            statusBadge = '<span class="badge bg-danger">Overdue</span>';
        } else if (isToday(new Date(taskStartDate))) {
            statusBadge = '<span class="badge bg-primary">Today</span>';
        } else {
            statusBadge = '<span class="badge bg-primary">Upcoming</span>';
        }
}

// Update row cells
listRow.querySelector('td:nth-child(2)').textContent = taskName;
listRow.querySelector('td:nth-child(3)').textContent = areaDisplay;
listRow.querySelector('td:nth-child(4)').textContent = assigneeDisplay;
listRow.querySelector('td:nth-child(5)').textContent = startDate;
listRow.querySelector('td:nth-child(6)').textContent = dueDate;
listRow.querySelector('td:nth-child(7)').innerHTML = statusBadge;

// Update row class
listRow.classList.remove('table-primary', 'table-danger');

if (taskStatus === 'in-progress') {
    listRow.classList.add('table-primary');
} else if (new Date(taskDueDate) < new Date() && taskStatus !== 'completed') {
    listRow.classList.add('table-danger');
}
}

// Update in upcoming tasks
const upcomingItem = document.querySelector(`.upcoming-tasks li[data-task-id="${event.id}"]`);

if (upcomingItem) {
// If task is now completed, remove from upcoming
if (taskStatus === 'completed') {
    upcomingItem.remove();
} else {
    // Update item
    upcomingItem.querySelector('h6').textContent = taskName;
    
    const taskDate = new Date(taskStartDate);
    let dateText = '';
    let badgeClass = '';
    
    if (isToday(taskDate)) {
        dateText = 'Today';
        badgeClass = 'bg-primary';
    } else if (isTomorrow(taskDate)) {
        dateText = 'Tomorrow';
        badgeClass = 'bg-success';
    } else {
        dateText = taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        badgeClass = 'bg-success';
    }
    
    // Format time
    const timeText = taskDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    upcomingItem.querySelector('p.text-muted').textContent = `${areaDisplay} - ${dateText}, ${timeText}`;
    
    const badge = upcomingItem.querySelector('.badge');
    badge.textContent = dateText;
    badge.className = `badge ${badgeClass} align-self-start`;
}
} else if (shouldAddToUpcoming(event)) {
// Add to upcoming if not there but should be
addTaskToUpcomingList(event);
}

// Reset form
document.getElementById('addTaskForm').reset();
document.querySelector('.recurring-options').classList.add('d-none');

// Reset modal title
document.getElementById('addTaskModalLabel').textContent = 'Add New Task';
document.querySelector('#addTaskModal .modal-footer button[type="submit"]').textContent = 'Add Task';
}
/**
* SiteFlow - Schedule JavaScript
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

// Initialize calendar
initializeCalendar();

// Setup schedule view toggles
setupViewToggles();

// Setup mini map functionality
setupMiniMap();

// Setup task form
setupTaskForm();

// Setup filters
setupFilters();
});

/**
* Initializes the FullCalendar component
*/
function initializeCalendar() {
const calendarEl = document.getElementById('calendar');

if (!calendarEl) return;

// Current date for demo
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 10);

// Demo events
const events = [
{
    id: '1',
    title: 'Morning safety walk - Level 3',
    start: `${formattedDate}T09:00:00`,
    end: `${formattedDate}T10:00:00`,
    classNames: ['fc-event-ontime'],
    extendedProps: {
        status: 'completed',
        area: 'East Wing',
        assignedTo: 'John Carpenter'
    }
},
{
    id: '2',
    title: 'Coordinate with electrical subcontractor',
    start: `${formattedDate}T10:30:00`,
    end: `${formattedDate}T11:30:00`,
    classNames: ['fc-event-ontime'],
    extendedProps: {
        status: 'completed',
        area: 'Central Core',
        assignedTo: 'John Carpenter'
    }
},
{
    id: '3',
    title: 'Review drywall installation on 4th floor',
    start: `${formattedDate}T13:00:00`,
    end: `${formattedDate}T14:30:00`,
    classNames: ['fc-event-today'],
    extendedProps: {
        status: 'in-progress',
        area: 'West Wing',
        assignedTo: 'John Carpenter'
    }
},
{
    id: '4',
    title: 'Inspect HVAC installation in East Wing',
    start: `${formattedDate}T14:30:00`,
    end: `${formattedDate}T16:00:00`,
    classNames: ['fc-event-today'],
    extendedProps: {
        status: 'upcoming',
        area: 'East Wing',
        assignedTo: 'Sarah Martinez'
    }
},
{
    id: '5',
    title: 'Afternoon safety walk - Levels 1 & 2',
    start: `${formattedDate}T16:00:00`,
    end: `${formattedDate}T17:00:00`,
    classNames: ['fc-event-today'],
    extendedProps: {
        status: 'upcoming',
        area: 'All Areas',
        assignedTo: 'Dave Wilson'
    }
},
{
    id: '6',
    title: 'Finalize plumbing inspection report',
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1, 14, 0),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1, 16, 0),
    classNames: ['fc-event-overdue'],
    extendedProps: {
        status: 'overdue',
        area: 'Basement',
        assignedTo: 'Mike Johnson'
    }
},
{
    id: '7',
    title: 'Coordinate with plumbing team',
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 9, 0),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 10, 0),
    classNames: ['fc-event-ontime'],
    extendedProps: {
        status: 'not-started',
        area: 'Basement',
        assignedTo: 'John Carpenter'
    }
},
{
    id: '8',
    title: 'Check concrete curing',
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 11, 30),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 12, 30),
    classNames: ['fc-event-ontime'],
    extendedProps: {
        status: 'not-started',
        area: 'West Wing',
        assignedTo: 'Sarah Martinez'
    }
},
{
    id: '9',
    title: 'Meeting with client',
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2, 13, 0),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2, 14, 30),
    classNames: ['fc-event-ontime'],
    extendedProps: {
        status: 'not-started',
        area: 'Office',
        assignedTo: 'John Carpenter'
    }
}
];

// Initialize calendar
const calendar = new FullCalendar.Calendar(calendarEl, {
initialView: 'timeGridWeek',
headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
},
height: '100%',
navLinks: true,
editable: true,
selectable: true,
selectMirror: true,
nowIndicator: true,
slotMinTime: '07:00:00',
slotMaxTime: '19:00:00',
events: events,
eventTimeFormat: {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: 'short'
},
eventClick: function(info) {
    showTaskDetails(info.event);
},
select: function(info) {
    openAddTaskModal(info.startStr, info.endStr);
},
eventDrop: function(info) {
    updateTaskDates(info.event);
},
eventResize: function(info) {
    updateTaskDates(info.event);
}
});

calendar.render();

// Store calendar instance globally
window.calendar = calendar;
}

/**
* Sets up the schedule view toggles (Calendar, List, Gantt)
*/
function setupViewToggles() {
const viewCalendar = document.getElementById('viewCalendar');
const viewList = document.getElementById('viewList');
const viewGantt = document.getElementById('viewGantt');

const calendarView = document.getElementById('calendarView');
const listView = document.getElementById('listView');
const ganttView = document.getElementById('ganttView');

if (viewCalendar && viewList && viewGantt && calendarView && listView && ganttView) {
viewCalendar.addEventListener('click', function() {
    // Update button states
    viewCalendar.classList.add('active');
    viewList.classList.remove('active');
    viewGantt.classList.remove('active');
    
    // Show/hide views
    calendarView.classList.remove('d-none');
    listView.classList.add('d-none');
    ganttView.classList.add('d-none');
    
    // Resize calendar to ensure proper rendering
    if (window.calendar) {
        window.calendar.updateSize();
    }
});

viewList.addEventListener('click', function() {
    // Update button states
    viewCalendar.classList.remove('active');
    viewList.classList.add('active');
    viewGantt.classList.remove('active');
    
    // Show/hide views
    calendarView.classList.add('d-none');
    listView.classList.remove('d-none');
    ganttView.classList.add('d-none');
});

viewGantt.addEventListener('click', function() {
    // Update button states
    viewCalendar.classList.remove('active');
    viewList.classList.remove('active');
    viewGantt.classList.add('active');
    
    // Show/hide views
    calendarView.classList.add('d-none');
    listView.classList.add('d-none');
    ganttView.classList.remove('d-none');
    
    // Initialize Gantt chart (placeholder for now)
    initializeGanttChart();
});
}
}

/**
* Sets up the mini map functionality for area focus
*/
function setupMiniMap() {
const areaHighlights = document.querySelectorAll('.area-highlight');
const areaSelect = document.getElementById('areaSelect');
const areaFilter = document.getElementById('areaFilter');

if (areaHighlights.length > 0 && areaSelect) {
// Handle area highlight clicks
areaHighlights.forEach(highlight => {
    highlight.addEventListener('click', function() {
        const area = this.getAttribute('data-area');
        
        // Update area select
        areaSelect.value = area;
        
        // Update area filter if it exists
        if (areaFilter) {
            areaFilter.value = area;
        }
        
        // Update highlight states
        areaHighlights.forEach(h => h.classList.remove('active'));
        this.classList.add('active');
        
        // Filter calendar/list by area
        filterScheduleByArea(area);
    });
});

// Handle area select changes
areaSelect.addEventListener('change', function() {
    const area = this.value;
    
    // Update area filter if it exists
    if (areaFilter) {
        areaFilter.value = area;
    }
    
    // Update highlight states
    areaHighlights.forEach(h => {
        if (h.getAttribute('data-area') === area) {
            h.classList.add('active');
        } else {
            h.classList.remove('active');
        }
    });
    
    // Filter calendar/list by area
    filterSchedule