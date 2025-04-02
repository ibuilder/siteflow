/**
 * SiteFlow - AI Chat JavaScript
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

    // Setup chat functionality
    setupChat();
    
    // Setup resource panel
    setupResourcePanel();
    
    // Setup file uploads
    setupFileUpload();
});

/**
 * Sets up the main chat functionality
 */
function setupChat() {
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatContainer = document.querySelector('.chat-container');
    const chatMessages = document.querySelector('.chat-messages');
    const suggestedTopics = document.querySelectorAll('.suggested-topic a');
    const quickPromptCards = document.querySelectorAll('.quick-prompt-card');
    const newChatBtn = document.getElementById('newChatBtn');
    
    // Auto-resize message input
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Reset height when message is sent
        function resetInputHeight() {
            messageInput.style.height = 'auto';
        }
    }
    
    // Handle message sending
    if (sendMessageBtn && messageInput) {
        sendMessageBtn.addEventListener('click', function() {
            sendMessage();
        });
        
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Handle suggested topics
    if (suggestedTopics) {
        suggestedTopics.forEach(topic => {
            topic.addEventListener('click', function(e) {
                e.preventDefault();
                const topicText = this.getAttribute('data-topic');
                
                if (messageInput) {
                    messageInput.value = topicText;
                    messageInput.focus();
                }
            });
        });
    }
    
    // Handle quick prompt cards
    if (quickPromptCards) {
        quickPromptCards.forEach(card => {
            card.addEventListener('click', function() {
                const promptText = this.getAttribute('data-prompt');
                
                // Hide welcome message
                const welcomeMessage = document.querySelector('.chat-welcome');
                if (welcomeMessage) {
                    welcomeMessage.style.display = 'none';
                }
                
                // Add user message
                addMessage('user', promptText);
                
                // Simulate AI response
                simulateTyping();
                
                // After a delay, add AI response
                setTimeout(() => {
                    respondToMessage(promptText);
                }, 1500);
            });
        });
    }
    
    // Handle new chat button
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            // Clear chat messages
            if (chatMessages) {
                chatMessages.innerHTML = '';
            }
            
            // Show welcome message
            const welcomeMessage = document.querySelector('.chat-welcome');
            if (welcomeMessage) {
                welcomeMessage.style.display = 'block';
            }
            
            // Clear input
            if (messageInput) {
                messageInput.value = '';
                resetInputHeight();
            }
            
            // Update history list
            updateChatHistory('New chat');
        });
    }
    
    /**
     * Sends a message from the user
     */
    function sendMessage() {
        const message = messageInput.value.trim();
        
        if (message) {
            // Hide welcome message if visible
            const welcomeMessage = document.querySelector('.chat-welcome');
            if (welcomeMessage && welcomeMessage.style.display !== 'none') {
                welcomeMessage.style.display = 'none';
            }
            
            // Add user message
            addMessage('user', message);
            
            // Clear input
            messageInput.value = '';
            resetInputHeight();
            
            // Simulate AI typing
            simulateTyping();
            
            // After a delay, add AI response
            setTimeout(() => {
                respondToMessage(message);
            }, 1500);
            
            // Update chat history
            updateChatHistory(message);
        }
    }
    
    /**
     * Adds a message to the chat
     * @param {string} sender - 'user' or 'ai'
     * @param {string} message - The message text
     * @param {Object} [options] - Additional options (attachments, insights, etc.)
     */
    function addMessage(sender, message, options = {}) {
        if (!chatMessages) return;
        
        // Create message container
        const messageContainer = document.createElement('div');
        messageContainer.className = `chat-message ${sender}`;
        
        // Create message HTML
        let messageHTML = '';
        
        if (sender === 'ai') {
            messageHTML = `
                <div class="avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${formatMessage(message)}</p>
                    ${options.attachment ? `
                    <div class="message-attachment">
                        <img src="${options.attachment}" alt="Attachment">
                    </div>
                    ` : ''}
                    ${options.insights ? `
                    <div class="ai-insights">
                        <div class="ai-insights-title">
                            <i class="fas fa-lightbulb me-1"></i> AI Insights
                        </div>
                        <p>${options.insights}</p>
                        ${options.recommendations ? `
                        <div class="ai-recommendations">
                            <strong>Recommendations:</strong>
                            <ul class="mb-0">
                                ${options.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                    ` : ''}
                    ${sender === 'ai' ? `
                    <div class="message-actions">
                        <button class="copy-message" title="Copy to clipboard">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    ` : ''}
                </div>
            `;
        } else {
            messageHTML = `
                <div class="message-content">
                    <p>${formatMessage(message)}</p>
                </div>
            `;
        }
        
        messageContainer.innerHTML = messageHTML;
        
        // Add to chat messages
        chatMessages.appendChild(messageContainer);
        
        // Scroll to bottom
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        // Add event listener for copy button
        const copyButton = messageContainer.querySelector('.copy-message');
        if (copyButton) {
            copyButton.addEventListener('click', function() {
                const textToCopy = messageContainer.querySelector('p').textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Show copied feedback
                    this.innerHTML = '<i class="fas fa-check"></i> Copied';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    }, 2000);
                });
            });
        }
    }
    
    /**
     * Formats a message with line breaks, links, etc.
     * @param {string} message - The raw message text
     * @returns {string} Formatted HTML
     */
    function formatMessage(message) {
        // Convert line breaks to <br>
        let formatted = message.replace(/\n/g, '<br>');
        
        // Convert URLs to links
        formatted = formatted.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        return formatted;
    }
    
    /**
     * Shows a typing indicator
     */
    function simulateTyping() {
        if (!chatMessages) return;
        
        // Create typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message ai typing-indicator';
        typingIndicator.innerHTML = `
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        // Add to chat messages
        chatMessages.appendChild(typingIndicator);
        
        // Scroll to bottom
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
    
    /**
     * Responds to a user message
     * @param {string} message - The user message
     */
    function respondToMessage(message) {
        if (!chatMessages) return;
        
        // Remove typing indicator
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Process the message (in a real app, this would be an API call)
        let response = '';
        let options = {};
        
        // Simple pattern matching for demo
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('progress') && lowerMessage.includes('4th floor')) {
            response = "Based on the latest photos and site reports, the 4th floor is currently at 68% completion. Drywall installation is in progress, with the east and north sections completed. The west section is still being worked on and is approximately 5% behind schedule.";
            options.attachment = "../assets/images/site-photo-2.jpg";
            options.insights = "The AI has detected that the drywall installation in the west section is behind schedule based on the comparison of recent photos with the project timeline.";
            options.recommendations = [
                "Assign 2 additional workers to the drywall installation team for the next 3 days.",
                "Prioritize completing rooms W401-W405 first to align with electrical work scheduled next week."
            ];
        } else if (lowerMessage.includes('progress') && lowerMessage.includes('east wing')) {
            response = "The East Wing is currently at 85% completion, which is 2% ahead of schedule. All framing is complete, electrical rough-in is at 98%, plumbing is at 95%, and drywall installation is at 75%. HVAC installation is complete and pending final inspection.";
            options.attachment = "../assets/images/site-photo-1.jpg";
        } else if (lowerMessage.includes('safety issues')) {
            response = "There are currently 3 open safety issues that need attention:\n\n1. Missing guardrail on 4th floor scaffolding (High Priority)\n2. Electrical cables exposed in West Wing work area (Medium Priority)\n3. Improper storage of flammable materials in the basement (Low Priority)";
        } else if (lowerMessage.includes('schedule') || lowerMessage.includes('tasks') || lowerMessage.includes('today')) {
            response = "Here are the tasks scheduled for today (April 1, 2025):\n\n✅ Morning safety walk - Level 3 (Completed)\n✅ Coordinate with electrical subcontractor (Completed)\n🔄 Review drywall installation on 4th floor (In Progress)\n⏳ Inspect HVAC installation in East Wing (2:30 PM)\n⏳ Afternoon safety walk - Levels 1 & 2 (4:00 PM)";
        } else if (lowerMessage.includes('drawing') || lowerMessage.includes('plan')) {
            response = "I've pulled up the floor plan for Level 4. You can view it in the right panel. Based on the latest progress photos, I've added annotations to show the current status of different areas.";
            
            // Trigger drawing panel
            const drawingsTab = document.getElementById('drawings-tab');
            if (drawingsTab) {
                drawingsTab.click();
            }
            
            // Show panel on mobile
            const chatPanel = document.querySelector('.chat-panel');
            if (chatPanel && window.innerWidth < 992) {
                chatPanel.classList.add('show');
            }
        } else if (lowerMessage.includes('compare') && lowerMessage.includes('progress')) {
            response = "Comparing actual vs. planned progress for the East Wing:\n\nPlanned completion: 83%\nActual completion: 85% (2% ahead)\n\nKey milestones:\n✅ Framing: 100% complete (on schedule)\n✅ Electrical: 98% complete (3% ahead)\n✅ Plumbing: 95% complete (on schedule)\n✅ HVAC: 100% complete (5% ahead)\n🔄 Drywall: 75% complete (on schedule)";
            options.insights = "The East Wing is progressing well, with most tasks either on schedule or ahead of schedule. The team's efficiency in HVAC installation has contributed significantly to the overall progress.";
        } else if (lowerMessage.includes('materials') && lowerMessage.includes('tomorrow')) {
            response = "Based on tomorrow's scheduled tasks, you'll need the following materials:\n\n1. Drywall sheets (40 sheets, 4x8 feet)\n2. Joint compound (5 buckets)\n3. Drywall screws (2 boxes)\n4. Drywall tape (4 rolls)\n5. Paint primer (2 buckets, 5 gallons each)\n\nAll these materials are currently available in the inventory except for joint compound, which needs to be ordered today.";
        } else {
            response = "I'm analyzing the project data based on your query. Here's what I've found:\n\nThe overall project is 68% complete, which is slightly ahead of schedule (66% planned). All critical path tasks are on track, with the East Wing showing the most progress at 85% completion. The HVAC system installation is complete on the 4th floor and is pending final inspection.";
        }
        
        // Add AI response
        addMessage('ai', response, options);
    }
    
    /**
     * Updates the chat history list
     * @param {string} message - The user message
     */
    function updateChatHistory(message) {
        const historyList = document.querySelector('.chat-history ul');
        
        if (!historyList) return;
        
        // Create a preview of the message (first few words)
        const preview = message.length > 30 ? message.substring(0, 30) + '...' : message;
        
        // Create new history item
        const historyItem = document.createElement('li');
        historyItem.className = 'chat-history-item';
        historyItem.innerHTML = `
            <a href="#">
                <i class="fas fa-comments me-2"></i> ${preview}
                <span class="chat-time">Just now</span>
            </a>
        `;
        
        // Remove active class from all items
        const activeItems = historyList.querySelectorAll('.chat-history-item.active');
        activeItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to new item
        historyItem.classList.add('active');
        
        // Add to history list at the top
        historyList.prepend(historyItem);
        
        // Remove oldest item if more than 5
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastElementChild);
        }
        
        // Add event listener
        historyItem.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            const activeItems = historyList.querySelectorAll('.chat-history-item.active');
            activeItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // In a real app, this would load the chat history
            alert('In a full application, this would load the selected chat history.');
        });
    }
}

/**
 * Sets up the resource panel functionality
 */
function setupResourcePanel() {
    const togglePanelBtn = document.getElementById('togglePanelBtn');
    const chatPanel = document.querySelector('.chat-panel');
    const resourceItems = document.querySelectorAll('.resource-item');
    const currentDrawing = document.getElementById('currentDrawing');
    const showAIInsightsBtn = document.getElementById('showAIInsights');
    const photoItems = document.querySelectorAll('.photo-item');
    const currentPhoto = document.getElementById('currentPhoto');
    const photoTitle = document.querySelector('.photo-title');
    const prevPhotoBtn = document.getElementById('prevPhoto');
    const nextPhotoBtn = document.getElementById('nextPhoto');
    const drawingAnnotations = document.querySelectorAll('.drawing-annotation');
    
    // Toggle panel visibility
    if (togglePanelBtn && chatPanel) {
        togglePanelBtn.addEventListener('click', function() {
            chatPanel.classList.toggle('collapsed');
            
            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                if (chatPanel.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-left';
                } else {
                    icon.className = 'fas fa-chevron-right';
                }
            }
        });
    }
    
    // Handle drawing selection
    if (resourceItems && currentDrawing) {
        resourceItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                resourceItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Update current drawing
                const resourceId = this.getAttribute('data-resource');
                currentDrawing.src = `../assets/images/${resourceId}.jpg`;
                currentDrawing.alt = this.querySelector('h6').textContent;
            });
        });
    }
    
    // Show AI insights modal
    if (showAIInsightsBtn) {
        showAIInsightsBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('drawingInsightsModal'));
            modal.show();
        });
    }
    
    // Handle drawing annotations
    if (drawingAnnotations) {
        drawingAnnotations.forEach(annotation => {
            // Create and add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'annotation-tooltip';
            tooltip.textContent = annotation.getAttribute('data-annotation');
            tooltip.style.display = 'none';
            annotation.appendChild(tooltip);
            
            // Show/hide tooltip on hover
            annotation.addEventListener('mouseenter', function() {
                tooltip.style.display = 'block';
            });
            
            annotation.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
            });
        });
    }
    
    // Handle photo selection
    if (photoItems && currentPhoto && photoTitle) {
        photoItems.forEach(item => {
            item.addEventListener('click', function() {
                // Update current photo
                currentPhoto.src = this.querySelector('img').src;
                photoTitle.textContent = this.querySelector('h6').textContent;
                
                // Scroll to photo viewer
                document.querySelector('.photo-viewer').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // Handle photo navigation
    if (prevPhotoBtn && nextPhotoBtn && photoItems && currentPhoto) {
        prevPhotoBtn.addEventListener('click', function() {
            navigatePhotos('prev');
        });
        
        nextPhotoBtn.addEventListener('click', function() {
            navigatePhotos('next');
        });
        
        function navigatePhotos(direction) {
            // Find current photo index
            let currentIndex = 0;
            for (let i = 0; i < photoItems.length; i++) {
                if (photoItems[i].querySelector('img').src === currentPhoto.src) {
                    currentIndex = i;
                    break;
                }
            }
            
            // Calculate new index
            let newIndex;
            if (direction === 'prev') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : photoItems.length - 1;
            } else {
                newIndex = currentIndex < photoItems.length - 1 ? currentIndex + 1 : 0;
            }
            
            // Update current photo
            currentPhoto.src = photoItems[newIndex].querySelector('img').src;
            photoTitle.textContent = photoItems[newIndex].querySelector('h6').textContent;
        }
    }
}

/**
 * Sets up file upload functionality
 */
function setupFileUpload() {
    const browseFiles = document.getElementById('browseFiles');
    const fileInput = document.getElementById('fileInput');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
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
    
    if (uploadFileBtn && fileInput) {
        uploadFileBtn.addEventListener('click', function() {
            fileInput.click();
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
            // Simulate upload
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadPhotoModal'));
            
            // Show success message
            alert('Photos uploaded successfully! AI is analyzing the content...');
            
            // Close modal
            modal.hide();
            
            // In a real app, this would process the files and add them to the chat
            setTimeout(() => {
                // Add a message from the AI confirming the upload
                const chatMessages = document.querySelector('.chat-messages');
                const welcomeMessage = document.querySelector('.chat-welcome');
                
                // Hide welcome message if visible
                if (welcomeMessage && welcomeMessage.style.display !== 'none') {
                    welcomeMessage.style.display = 'none';
                }
                
                // Create AI response
                if (chatMessages) {
                    // Create AI message
                    const aiMessage = document.createElement('div');
                    aiMessage.className = 'chat-message ai';
                    aiMessage.innerHTML = `
                        <div class="avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>I've analyzed the photos you uploaded of the East Wing. Here's what I found:</p>
                            <div class="message-attachment">
                                <img src="../assets/images/site-photo-1.jpg" alt="East Wing Progress">
                            </div>
                            <div class="ai-insights">
                                <div class="ai-insights-title">
                                    <i class="fas fa-lightbulb me-1"></i> AI Analysis
                                </div>
                                <p>The drywall installation in the East Wing is approximately 75% complete based on the uploaded photos. All workers visible are wearing proper PPE, and no safety violations were detected.</p>
                                <div class="ai-recommendations">
                                    <strong>Recommendations:</strong>
                                    <ul class="mb-0">
                                        <li>Based on current progress, drywall installation should be completed by April 3, 2025</li>
                                        <li>Schedule painting crew to begin work on April 4, 2025</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="message-actions">
                                <button class="copy-message" title="Copy to clipboard">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Add to chat
                    chatMessages.appendChild(aiMessage);
                    
                    // Scroll to bottom
                    const chatContainer = document.querySelector('.chat-container');
                    if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }
                }
            }, 2000);
        });
    }
}

/**
 * Handles file selection for upload
 * @param {FileList} files - The selected files
 */
function handleFileSelection(files) {
    if (files.length > 0) {
        // If in chat, handle chat file uploads
        const messageInput = document.getElementById('messageInput');
        if (messageInput && messageInput.closest('.chat-input-container')) {
            // In a real app, this would upload the files and add them to the chat
            // For demo purposes, just add a message
            const chatMessages = document.querySelector('.chat-messages');
            const chatContainer = document.querySelector('.chat-container');
            const welcomeMessage = document.querySelector('.chat-welcome');
            
            // Hide welcome message if visible
            if (welcomeMessage && welcomeMessage.style.display !== 'none') {
                welcomeMessage.style.display = 'none';
            }
            
            // Add user message with attachment
            if (chatMessages) {
                // Create user message
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user';
                userMessage.innerHTML = `
                    <div class="message-content">
                        <p>I've uploaded some photos from the East Wing.</p>
                    </div>
                `;
                
                // Add to chat
                chatMessages.appendChild(userMessage);
                
                // Simulate AI typing
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'chat-message ai typing-indicator';
                typingIndicator.innerHTML = `
                    <div class="avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                `;
                
                // Add to chat
                chatMessages.appendChild(typingIndicator);
                
                // Scroll to bottom
                if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
                
                // After a delay, add AI response
                setTimeout(() => {
                    // Remove typing indicator
                    typingIndicator.remove();
                    
                    // Create AI message
                    const aiMessage = document.createElement('div');
                    aiMessage.className = 'chat-message ai';
                    aiMessage.innerHTML = `
                        <div class="avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>I'm analyzing the photos you uploaded. One moment please...</p>
                        </div>
                    `;
                    
                    // Add to chat
                    chatMessages.appendChild(aiMessage);
                    
                    // After another delay, add analysis
                    setTimeout(() => {
                        const analysisMessage = document.createElement('div');
                        analysisMessage.className = 'chat-message ai';
                        analysisMessage.innerHTML = `
                            <div class="avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>I've analyzed the photos from the East Wing. Here's what I found:</p>
                                <div class="message-attachment">
                                    <img src="../assets/images/site-photo-1.jpg" alt="East Wing Progress">
                                </div>
                                <div class="ai-insights">
                                    <div class="ai-insights-title">
                                        <i class="fas fa-lightbulb me-1"></i> AI Analysis
                                    </div>
                                    <p>The drywall installation in the East Wing is approximately 75% complete based on the uploaded photos. All workers visible are wearing proper PPE, and no safety violations were detected.</p>
                                    <div class="ai-recommendations">
                                        <strong>Recommendations:</strong>
                                        <ul class="mb-0">
                                            <li>Based on current progress, drywall installation should be completed by April 3, 2025</li>
                                            <li>Schedule painting crew to begin work on April 4, 2025</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="message-actions">
                                    <button class="copy-message" title="Copy to clipboard">
                                        <i class="fas fa-copy"></i> Copy
                                    </button>
                                </div>
                            </div>
                        `;
                        
                        // Add to chat
                        chatMessages.appendChild(analysisMessage);
                        
                        // Scroll to bottom
                        if (chatContainer) {
                            chatContainer.scrollTop = chatContainer.scrollHeight;
                        }
                        
                        // Update schedule (simulate)
                        setTimeout(() => {
                            const scheduleMessage = document.createElement('div');
                            scheduleMessage.className = 'chat-message ai';
                            scheduleMessage.innerHTML = `
                                <div class="avatar">
                                    <i class="fas fa-robot"></i>
                                </div>
                                <div class="message-content">
                                    <p>I've updated the schedule based on the new information:</p>
                                    <ul>
                                        <li>📅 Added: "Drywall Completion Inspection" on April 3, 2025</li>
                                        <li>📅 Added: "Painting Preparation" on April 4, 2025</li>
                                        <li>📅 Updated: "Final Electrical Inspection" moved to April 5, 2025</li>
                                    </ul>
                                    <div class="message-actions">
                                        <button class="copy-message" title="Copy to clipboard">
                                            <i class="fas fa-copy"></i> Copy
                                        </button>
                                    </div>
                                </div>
                            `;
                            
                            // Add to chat
                            chatMessages.appendChild(scheduleMessage);
                            
                            // Scroll to bottom
                            if (chatContainer) {
                                chatContainer.scrollTop = chatContainer.scrollHeight;
                            }
                        }, 1500);
                    }, 2000);
                    
                    // Scroll to bottom
                    if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }
                }, 1500);
            }
            
            return;
        }
        
        // If in modal, display selected files
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