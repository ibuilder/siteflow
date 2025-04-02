/**
 * SiteFlow - AI Integration JavaScript
 * This file contains the core AI integration functionality that powers the SiteFlow platform.
 */

/**
 * Main AI integration object
 */
const SiteFlowAI = {
    /**
     * Configuration options
     */
    config: {
        apiEndpoint: 'https://api.siteflow.com/v1/ai',
        apiKey: null, // Set during initialization
        defaultModel: 'siteflow-gpt-4',
        defaultTimeout: 30000, // 30 seconds
        imageAnalysisEnabled: true,
        drawingAnalysisEnabled: true,
        scheduleUpdateEnabled: true,
        safetyDetectionEnabled: true,
        debugMode: false
    },
    
    /**
     * Initialize the AI system
     * @param {Object} options - Configuration options
     * @returns {Promise} Initialization promise
     */
    init: function(options = {}) {
        return new Promise((resolve, reject) => {
            try {
                // Merge options with defaults
                this.config = { ...this.config, ...options };
                
                // Check for required config
                if (!this.config.apiKey && !this.isDemo) {
                    throw new Error('API key is required for AI initialization');
                }
                
                // Load required models
                this.loadModels()
                    .then(() => {
                        console.log('SiteFlow AI initialized successfully');
                        resolve(true);
                    })
                    .catch(error => {
                        console.error('Error loading AI models:', error);
                        reject(error);
                    });
            } catch (error) {
                console.error('Error initializing SiteFlow AI:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Load AI models required for various functionalities
     * @returns {Promise} Loading promise
     */
    loadModels: function() {
        return new Promise((resolve, reject) => {
            // In a real implementation, this would load actual models
            // For demo purposes, we just simulate a delay
            
            console.log('Loading AI models...');
            
            setTimeout(() => {
                console.log('AI models loaded successfully');
                resolve(true);
            }, 1000);
        });
    },
    
    /**
     * Process a chat query
     * @param {string} query - The user's query
     * @param {Object} context - Additional context (project info, user role, etc.)
     * @returns {Promise<Object>} AI response
     */
    processQuery: function(query, context = {}) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`Processing query: "${query}"`);
                
                // In a real app, this would make an API call to the AI backend
                // For demo purposes, we'll simulate a response
                
                // Extract relevant context
                const projectName = context.projectName || 'Downtown Office Tower';
                const userRole = context.userRole || 'Project Manager';
                const currentArea = context.currentArea || 'All Areas';
                
                // Determine response based on query keywords
                let response = this.generateDemoResponse(query, projectName, currentArea);
                
                // Resolve with response
                setTimeout(() => {
                    resolve(response);
                }, 1500);
            } catch (error) {
                console.error('Error processing query:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Generate a demo response based on query keywords
     * @param {string} query - The user's query
     * @param {string} projectName - The current project name
     * @param {string} currentArea - The current area being discussed
     * @returns {Object} AI response object
     */
    generateDemoResponse: function(query, projectName, currentArea) {
        const lowerQuery = query.toLowerCase();
        
        // Default response
        let response = {
            text: `I've analyzed the data for ${projectName}, but I'm not sure what specific information you're looking for. Could you please clarify your question?`,
            confidence: 0.7,
            insights: null,
            recommendations: null,
            attachments: null
        };
        
        // Check for progress related queries
        if (lowerQuery.includes('progress') || lowerQuery.includes('status')) {
            if (lowerQuery.includes('east wing') || (lowerQuery.includes('east') && currentArea === 'East Wing')) {
                response = {
                    text: `The East Wing is currently at 85% completion, which is 2% ahead of schedule. All framing is complete, electrical rough-in is at 98%, plumbing is at 95%, and drywall installation is at 75%. HVAC installation is complete and pending final inspection.`,
                    confidence: 0.95,
                    insights: "Based on the latest progress photos, the drywall installation in the east section is progressing faster than anticipated. The team's efficiency has contributed to being ahead of schedule.",
                    recommendations: [
                        "Schedule the painting contractor to begin work in the East Wing next week",
                        "Prepare for final electrical inspection by April 5, 2025"
                    ],
                    attachments: [
                        {
                            type: "image",
                            url: "../assets/images/site-photo-1.jpg",
                            caption: "East Wing Progress - April 1, 2025"
                        }
                    ]
                };
            } else if (lowerQuery.includes('west wing') || (lowerQuery.includes('west') && currentArea === 'West Wing')) {
                response = {
                    text: `The West Wing is currently at 72% completion, which is on schedule. Framing is 100% complete, electrical rough-in is at 85%, plumbing is at 90%, and drywall installation is at 42%. HVAC ductwork installation is 75% complete.`,
                    confidence: 0.92,
                    insights: "The drywall installation in the west section is currently 5% behind schedule. This could impact the timeline for painting and finishing work if not addressed.",
                    recommendations: [
                        "Assign additional workers to the drywall installation team for the next 3 days",
                        "Prioritize rooms W401-W405 to align with the electrical work scheduled next week"
                    ],
                    attachments: [
                        {
                            type: "image",
                            url: "../assets/images/site-photo-6.jpg",
                            caption: "West Wing Progress - March 30, 2025"
                        }
                    ]
                };
            } else if (lowerQuery.includes('4th floor') || lowerQuery.includes('level 4')) {
                response = {
                    text: `The 4th floor is currently at 68% completion. Drywall installation is in progress, with the east and north sections completed. The west section is still being worked on and is approximately 5% behind schedule. Electrical and plumbing rough-ins are complete, and HVAC installation is 75% complete.`,
                    confidence: 0.9,
                    insights: "The delay in the west section drywall installation could impact the overall timeline for the 4th floor completion if not addressed promptly.",
                    recommendations: [
                        "Reallocate resources to prioritize drywall installation in the west section",
                        "Consider updating the schedule to reflect the current progress and adjust subsequent tasks accordingly"
                    ],
                    attachments: [
                        {
                            type: "image",
                            url: "../assets/images/site-photo-2.jpg",
                            caption: "Drywall Installation - 4th Floor, April 1, 2025"
                        }
                    ]
                };
            } else {
                response = {
                    text: `The overall project is currently at 68% completion, which is 2% ahead of schedule. The East Wing is the most advanced at 85%, followed by the West Wing at 72%, Central Core at 63%, Basement at 91%, and Roof at 45%. Critical path tasks are on track, with some minor delays in drywall installation in the West Wing.`,
                    confidence: 0.88,
                    insights: "The project is progressing well overall, with most areas either on schedule or ahead. The efficient completion of the basement work has provided some buffer in the schedule.",
                    recommendations: [
                        "Address the drywall installation delay in the West Wing to maintain the overall project timeline",
                        "Begin planning for the final inspection phases in the East Wing"
                    ],
                    attachments: null
                };
            }
        }
        
        // Check for schedule related queries
        else if (lowerQuery.includes('schedule') || lowerQuery.includes('task') || lowerQuery.includes('today')) {
            response = {
                text: `Here are the tasks scheduled for today (April 1, 2025):\n\n✅ Morning safety walk - Level 3 (Completed)\n✅ Coordinate with electrical subcontractor (Completed)\n🔄 Review drywall installation on 4th floor (In Progress)\n⏳ Inspect HVAC installation in East Wing (2:30 PM)\n⏳ Afternoon safety walk - Levels 1 & 2 (4:00 PM)`,
                confidence: 0.97,
                insights: "All scheduled tasks are either completed, in progress, or on track for completion today. No significant delays have been reported.",
                recommendations: [
                    "Prepare for tomorrow's concrete pouring in the West Wing by ensuring all materials and equipment are ready",
                    "Coordinate with the plumbing team for their work scheduled tomorrow in the basement"
                ],
                attachments: null
            };
        }
        
        // Check for safety related queries
        else if (lowerQuery.includes('safety') || lowerQuery.includes('violation') || lowerQuery.includes('issue')) {
            response = {
                text: `There are currently 3 open safety issues that need attention:\n\n1. Missing guardrail on 4th floor scaffolding (High Priority) - East Wing\n2. Electrical cables exposed in work area (Medium Priority) - West Wing\n3. Improper storage of flammable materials (Low Priority) - Basement\n\nTwo safety issues were resolved yesterday: improper PPE usage and expired fire extinguisher.`,
                confidence: 0.94,
                insights: "The high priority guardrail issue poses a significant fall hazard and should be addressed immediately. The AI system detected this issue during the morning safety walk.",
                recommendations: [
                    "Install temporary guardrails on the 4th floor scaffolding today",
                    "Schedule a focused safety briefing on electrical hazards for the West Wing team",
                    "Update the chemical storage protocol and train the basement team on proper procedures"
                ],
                attachments: [
                    {
                        type: "image",
                        url: "../assets/images/safety-issue-1.jpg",
                        caption: "Missing Guardrail - 4th Floor, East Wing"
                    }
                ]
            };
        }
        
        // Check for material related queries
        else if (lowerQuery.includes('material') || lowerQuery.includes('supplies') || lowerQuery.includes('inventory')) {
            response = {
                text: `Based on the current inventory and scheduled tasks, here's the material status:\n\n1. Drywall: 120 sheets in stock (sufficient for 1 week)\n2. Joint Compound: 2 buckets remaining (order needed today)\n3. Paint: 25 gallons of primer, 15 gallons of finish coat (sufficient)\n4. Electrical Supplies: All items in stock\n5. Plumbing Supplies: Copper fittings running low (order recommended)`,
                confidence: 0.91,
                insights: "The joint compound inventory is below the minimum threshold and should be replenished immediately to avoid delays in drywall finishing.",
                recommendations: [
                    "Place order for joint compound today (minimum 10 buckets)",
                    "Consider ordering additional copper fittings for upcoming plumbing work",
                    "Schedule inventory review for all painting supplies before next week"
                ],
                attachments: null
            };
        }
        
        // Check for drawing related queries
        else if (lowerQuery.includes('drawing') || lowerQuery.includes('plan') || lowerQuery.includes('blueprint')) {
            response = {
                text: `I've accessed the project drawings. What specific area or system are you interested in? I can provide detailed information about the floor plans, electrical layout, plumbing, HVAC, or structural elements.`,
                confidence: 0.85,
                insights: null,
                recommendations: [
                    "Check the Floor Plan - Level 4 for the latest updates on wall locations",
                    "Review the Electrical Layout - East Wing for details on outlet placements"
                ],
                attachments: [
                    {
                        type: "drawing",
                        url: "../assets/images/floorplan-4.jpg",
                        caption: "Floor Plan - Level 4"
                    }
                ]
            };
        }
        
        // Return the generated response
        return response;
    },
    
    /**
     * Analyze an image for construction progress
     * @param {File|Blob|string} image - Image file, blob, or URL
     * @param {Object} context - Additional context (project info, drawing reference, etc.)
     * @returns {Promise<Object>} Analysis results
     */
    analyzeImage: function(image, context = {}) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Analyzing image...');
                
                // In a real app, this would upload the image and make an API call
                // For demo purposes, we'll simulate a response
                
                // Extract context
                const projectArea = context.area || 'Unknown Area';
                const projectLevel = context.level || 'Unknown Level';
                const drawingReference = context.drawingReference || null;
                
                // Generate a demo analysis
                const analysis = {
                    timestamp: new Date().toISOString(),
                    area: projectArea,
                    level: projectLevel,
                    progress: {
                        overall: Math.floor(Math.random() * 30) + 60, // 60-90%
                        components: {
                            framing: 100,
                            electrical: Math.floor(Math.random() * 20) + 80, // 80-100%
                            plumbing: Math.floor(Math.random() * 20) + 80, // 80-100%
                            hvac: Math.floor(Math.random() * 30) + 70, // 70-100%
                            drywall: Math.floor(Math.random() * 50) + 30, // 30-80%
                            painting: Math.floor(Math.random() * 30) // 0-30%
                        }
                    },
                    safety: {
                        violations: Math.random() > 0.8 ? [{
                            type: 'PPE',
                            description: 'Worker not wearing hard hat',
                            severity: 'Medium',
                            location: {
                                x: 450,
                                y: 320
                            }
                        }] : [],
                        ppe_compliance: Math.min(100, Math.floor(Math.random() * 10) + 90), // 90-100%
                        hazards_detected: Math.random() > 0.7 ? [{
                            type: 'Tripping',
                            description: 'Cables on floor creating tripping hazard',
                            severity: 'Low',
                            location: {
                                x: 200,
                                y: 400
                            }
                        }] : []
                    },
                    materials: {
                        detected: [
                            'Drywall sheets',
                            'Joint compound',
                            'Paint supplies',
                            'Electrical conduit'
                        ],
                        estimated_quantities: {
                            'Drywall sheets': Math.floor(Math.random() * 10) + 20,
                            'Joint compound': Math.floor(Math.random() * 3) + 2
                        }
                    },
                    schedule_impact: {
                        on_schedule: Math.random() > 0.3,
                        deviation_percentage: Math.floor(Math.random() * 10) - 5, // -5% to +5%
                        estimated_completion: this.addDays(new Date(), Math.floor(Math.random() * 5) + 3).toISOString().split('T')[0]
                    },
                    drawing_comparison: drawingReference ? {
                        matches_drawing: Math.random() > 0.2,
                        discrepancies: Math.random() > 0.7 ? [{
                            type: 'Dimension',
                            description: 'Wall position differs from plan by approximately 4 inches',
                            severity: 'Low',
                            location: {
                                x: 350,
                                y: 250
                            }
                        }] : []
                    } : null,
                    ai_confidence: Math.floor(Math.random() * 10) + 90 // 90-100%
                };
                
                // Resolve with analysis
                setTimeout(() => {
                    resolve(analysis);
                }, 2500);
            } catch (error) {
                console.error('Error analyzing drawing vs photos:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Update project schedule based on progress detection
     * @param {Object} progressData - Detected progress data
     * @param {Object} currentSchedule - Current project schedule
     * @returns {Promise<Object>} Updated schedule
     */
    updateSchedule: function(progressData, currentSchedule) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Updating schedule based on progress data...');
                
                // In a real app, this would analyze progress data and adjust the schedule
                // For demo purposes, we'll simulate a response
                
                const updatedSchedule = JSON.parse(JSON.stringify(currentSchedule)); // Deep copy
                const scheduleChanges = [];
                
                // Process progress data and update schedule
                if (progressData.progress && progressData.schedule_impact) {
                    const isOnSchedule = progressData.schedule_impact.on_schedule;
                    const deviation = progressData.schedule_impact.deviation_percentage;
                    const area = progressData.area;
                    
                    // Find tasks related to the area
                    const areaTasks = updatedSchedule.tasks.filter(task => task.area === area);
                    
                    areaTasks.forEach(task => {
                        // Tasks that are not started or in progress
                        if (task.status !== 'completed') {
                            // Calculate new dates based on progress
                            if (!isOnSchedule) {
                                // Adjust end date based on deviation
                                const endDate = new Date(task.endDate);
                                const daysToAdjust = Math.ceil(
                                    (new Date(task.endDate) - new Date(task.startDate)) / (1000 * 3600 * 24) * 
                                    (deviation / 100)
                                );
                                
                                // Update end date
                                endDate.setDate(endDate.getDate() + daysToAdjust);
                                const oldEndDate = task.endDate;
                                task.endDate = endDate.toISOString().split('T')[0];
                                
                                // Record change
                                if (oldEndDate !== task.endDate) {
                                    scheduleChanges.push({
                                        taskId: task.id,
                                        taskName: task.name,
                                        changeType: 'date',
                                        oldValue: oldEndDate,
                                        newValue: task.endDate,
                                        reason: `Adjusted based on detected progress (${deviation > 0 ? 'ahead' : 'behind'} by ${Math.abs(deviation)}%)`
                                    });
                                }
                            }
                            
                            // Update progress percentage for in-progress tasks
                            if (task.status === 'in-progress') {
                                const oldProgress = task.progressPercentage;
                                
                                // Estimate task progress based on component progress
                                if (task.name.includes('Drywall') && progressData.progress.components.drywall) {
                                    task.progressPercentage = progressData.progress.components.drywall;
                                } else if (task.name.includes('Electrical') && progressData.progress.components.electrical) {
                                    task.progressPercentage = progressData.progress.components.electrical;
                                } else if (task.name.includes('Plumbing') && progressData.progress.components.plumbing) {
                                    task.progressPercentage = progressData.progress.components.plumbing;
                                } else if (task.name.includes('HVAC') && progressData.progress.components.hvac) {
                                    task.progressPercentage = progressData.progress.components.hvac;
                                } else if (task.name.includes('Painting') && progressData.progress.components.painting) {
                                    task.progressPercentage = progressData.progress.components.painting;
                                } else {
                                    // General progress update
                                    task.progressPercentage = Math.min(
                                        100, 
                                        task.progressPercentage + Math.floor(Math.random() * 10)
                                    );
                                }
                                
                                // Record change
                                if (oldProgress !== task.progressPercentage) {
                                    scheduleChanges.push({
                                        taskId: task.id,
                                        taskName: task.name,
                                        changeType: 'progress',
                                        oldValue: `${oldProgress}%`,
                                        newValue: `${task.progressPercentage}%`,
                                        reason: 'Updated based on detected progress in photos'
                                    });
                                }
                                
                                // Mark as completed if 100%
                                if (task.progressPercentage >= 100) {
                                    task.status = 'completed';
                                    task.progressPercentage = 100;
                                    
                                    scheduleChanges.push({
                                        taskId: task.id,
                                        taskName: task.name,
                                        changeType: 'status',
                                        oldValue: 'in-progress',
                                        newValue: 'completed',
                                        reason: 'Task completed based on detected progress'
                                    });
                                }
                            }
                        }
                    });
                    
                    // Add new tasks if needed
                    if (progressData.progress.overall >= 75 && area.includes('East')) {
                        // Add inspection task if near completion
                        const newTask = {
                            id: `task-${Date.now()}`,
                            name: 'Final Inspection - East Wing',
                            description: 'Complete final inspection before handover',
                            area: progressData.area,
                            startDate: this.addDays(new Date(), 5).toISOString().split('T')[0],
                            endDate: this.addDays(new Date(), 6).toISOString().split('T')[0],
                            status: 'not-started',
                            assignedTo: null,
                            progressPercentage: 0,
                            priority: 'high',
                            dependencies: areaTasks.map(task => task.id)
                        };
                        
                        // Check if task already exists
                        if (!updatedSchedule.tasks.some(task => 
                            task.name === newTask.name && task.area === newTask.area)) {
                            updatedSchedule.tasks.push(newTask);
                            
                            scheduleChanges.push({
                                taskId: newTask.id,
                                taskName: newTask.name,
                                changeType: 'new',
                                oldValue: null,
                                newValue: 'Task created',
                                reason: 'Added automatically based on detected progress'
                            });
                        }
                    }
                }
                
                // Update schedule metadata
                updatedSchedule.lastUpdated = new Date().toISOString();
                updatedSchedule.updatedBy = 'AI System';
                updatedSchedule.changes = [
                    ...(updatedSchedule.changes || []),
                    ...scheduleChanges
                ];
                
                // Resolve with updated schedule and changes
                setTimeout(() => {
                    resolve({
                        schedule: updatedSchedule,
                        changes: scheduleChanges
                    });
                }, 2000);
            } catch (error) {
                console.error('Error updating schedule:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Analyze safety compliance in photos
     * @param {File|Blob|string} image - Image file, blob, or URL
     * @param {Object} context - Additional context (project info, safety requirements, etc.)
     * @returns {Promise<Object>} Safety analysis results
     */
    analyzeSafety: function(image, context = {}) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Analyzing safety compliance...');
                
                // In a real app, this would analyze the image for safety violations
                // For demo purposes, we'll simulate a response
                
                // Extract context
                const projectArea = context.area || 'Unknown Area';
                const projectLevel = context.level || 'Unknown Level';
                const safetyRequirements = context.safetyRequirements || {
                    required_ppe: ['hard_hat', 'safety_vest', 'safety_glasses', 'boots'],
                    hazard_checks: ['fall_protection', 'electrical_safety', 'fire_safety', 'chemical_safety']
                };
                
                // Generate a demo safety analysis
                const totalWorkers = Math.floor(Math.random() * 5) + 1;
                const complianceScore = Math.floor(Math.random() * 30) + 70; // 70-100%
                const hasViolations = Math.random() > (complianceScore / 100);
                
                const analysis = {
                    timestamp: new Date().toISOString(),
                    area: projectArea,
                    level: projectLevel,
                    workers_detected: totalWorkers,
                    ppe_compliance: {
                        overall_score: complianceScore,
                        by_item: {
                            hard_hat: Math.floor(Math.random() * 20) + 80,
                            safety_vest: Math.floor(Math.random() * 20) + 80,
                            safety_glasses: Math.floor(Math.random() * 30) + 70,
                            boots: 100
                        },
                        compliant_workers: Math.floor(totalWorkers * (complianceScore / 100))
                    },
                    violations: hasViolations ? [
                        {
                            type: Math.random() > 0.5 ? 'missing_ppe' : 'improper_procedure',
                            description: Math.random() > 0.5 ? 
                                'Worker not wearing safety glasses' : 
                                'Improper ladder usage detected',
                            severity: Math.random() > 0.7 ? 'High' : (Math.random() > 0.5 ? 'Medium' : 'Low'),
                            location: {
                                x: Math.floor(Math.random() * 300) + 100,
                                y: Math.floor(Math.random() * 300) + 100
                            },
                            recommended_action: Math.random() > 0.5 ?
                                'Provide proper PPE immediately' :
                                'Retrain worker on proper procedures'
                        }
                    ] : [],
                    hazards_detected: Math.random() > 0.7 ? [
                        {
                            type: ['tripping', 'electrical', 'falling_objects', 'chemical'][Math.floor(Math.random() * 4)],
                            description: 'Cables creating tripping hazard in walkway',
                            severity: Math.random() > 0.6 ? 'Medium' : 'Low',
                            location: {
                                x: Math.floor(Math.random() * 300) + 100,
                                y: Math.floor(Math.random() * 300) + 100
                            },
                            recommended_action: 'Secure cables and clear walkway'
                        }
                    ] : [],
                    osha_compliance: {
                        compliant: complianceScore > 90,
                        potential_violations: complianceScore > 90 ? [] : [
                            {
                                code: '1926.501',
                                description: 'Fall protection requirements not met',
                                severity: 'High',
                                recommended_action: 'Install guardrails or ensure workers use proper fall protection'
                            }
                        ]
                    },
                    ai_confidence: Math.floor(Math.random() * 10) + 90 // 90-100%
                };
                
                // Resolve with analysis
                setTimeout(() => {
                    resolve(analysis);
                }, 2000);
            } catch (error) {
                console.error('Error analyzing safety:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Detect text in construction drawings or photos
     * @param {File|Blob|string} image - Image file, blob, or URL
     * @returns {Promise<Object>} Text detection results
     */
    detectText: function(image) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Detecting text in image...');
                
                // In a real app, this would use OCR to detect text
                // For demo purposes, we'll simulate a response
                
                const textResults = {
                    timestamp: new Date().toISOString(),
                    detected_text: [
                        {
                            text: 'EAST WING',
                            confidence: 97.5,
                            bounding_box: {
                                x: 150,
                                y: 75,
                                width: 120,
                                height: 30
                            }
                        },
                        {
                            text: 'LEVEL 4',
                            confidence: 96.2,
                            bounding_box: {
                                x: 300,
                                y: 75,
                                width: 80,
                                height: 30
                            }
                        },
                        {
                            text: 'ELECTRICAL PLAN',
                            confidence: 95.8,
                            bounding_box: {
                                x: 450,
                                y: 75,
                                width: 180,
                                height: 30
                            }
                        },
                        {
                            text: 'Scale: 1/4" = 1\'',
                            confidence: 94.3,
                            bounding_box: {
                                x: 150,
                                y: 120,
                                width: 120,
                                height: 20
                            }
                        }
                    ],
                    drawing_info: {
                        type: 'Electrical Plan',
                        level: 'Level 4',
                        area: 'East Wing',
                        scale: '1/4" = 1\''
                    },
                    ai_confidence: 95.4
                };
                
                // Resolve with results
                setTimeout(() => {
                    resolve(textResults);
                }, 1500);
            } catch (error) {
                console.error('Error detecting text:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Generate recommendations based on project data
     * @param {Object} projectData - Current project data
     * @returns {Promise<Array>} List of recommendations
     */
    generateRecommendations: function(projectData) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Generating recommendations...');
                
                // In a real app, this would analyze project data
                // For demo purposes, we'll simulate a response
                
                const recommendations = [
                    {
                        type: 'schedule',
                        title: 'Schedule Optimization',
                        description: 'Based on current progress, consider advancing the painting contractor schedule for the East Wing by 3 days.',
                        impact: 'High',
                        potential_savings: '2 days on critical path',
                        confidence: 89
                    },
                    {
                        type: 'resource',
                        title: 'Resource Allocation',
                        description: 'Reassign 2 workers from East Wing drywall to West Wing to address the 5% schedule deviation.',
                        impact: 'Medium',
                        potential_savings: 'Maintains project timeline',
                        confidence: 92
                    },
                    {
                        type: 'materials',
                        title: 'Material Ordering',
                        description: 'Order additional joint compound (10 buckets) today to prevent delays in drywall finishing.',
                        impact: 'Medium',
                        potential_savings: 'Prevents 1-2 day delay',
                        confidence: 96
                    },
                    {
                        type: 'safety',
                        title: 'Safety Improvement',
                        description: 'Install temporary guardrails on 4th floor scaffolding immediately to address fall hazard.',
                        impact: 'High',
                        potential_savings: 'Prevents potential OSHA violation ($13,653 penalty)',
                        confidence: 98
                    },
                    {
                        type: 'quality',
                        title: 'Quality Control',
                        description: 'Schedule electrical inspection for East Wing before closing walls to prevent rework.',
                        impact: 'Medium',
                        potential_savings: 'Prevents potential rework costs ($5,000-10,000)',
                        confidence: 90
                    }
                ];
                
                // Resolve with recommendations
                setTimeout(() => {
                    resolve(recommendations);
                }, 1500);
            } catch (error) {
                console.error('Error generating recommendations:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Utility function to add days to a date
     * @param {Date} date - The base date
     * @param {number} days - Number of days to add
     * @returns {Date} New date
     */
    addDays: function(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
};

// For browser usage
if (typeof window !== 'undefined') {
    window.SiteFlowAI = SiteFlowAI;
}

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteFlowAI;
}
 2000);
            } catch (error) {
                console.error('Error analyzing image:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Analyze construction drawings against progress photos
     * @param {Object} drawing - Drawing information
     * @param {Array} photos - Array of progress photos
     * @returns {Promise<Object>} Analysis results
     */
    analyzeDrawingVsPhotos: function(drawing, photos) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Analyzing drawing vs photos...');
                
                // In a real app, this would process drawings and photos
                // For demo purposes, we'll simulate a response
                
                const analysis = {
                    timestamp: new Date().toISOString(),
                    drawing_id: drawing.id || 'unknown',
                    drawing_name: drawing.name || 'Unknown Drawing',
                    number_of_photos: photos.length,
                    overall_match_percentage: Math.floor(Math.random() * 15) + 85, // 85-100%
                    discrepancies: Math.random() > 0.5 ? [
                        {
                            type: 'Position',
                            description: 'Wall position differs from plan by approximately 4 inches',
                            severity: 'Low',
                            location: {
                                x: 350,
                                y: 250
                            },
                            photo_reference: photos[0].id || 'photo1'
                        },
                        {
                            type: 'Missing',
                            description: 'Electrical outlet missing from south wall',
                            severity: 'Medium',
                            location: {
                                x: 450,
                                y: 320
                            },
                            photo_reference: photos[0].id || 'photo1'
                        }
                    ] : [],
                    annotations: [
                        {
                            id: 1,
                            text: 'Wall framing complete, ready for drywall installation.',
                            location: {
                                x: 250,
                                y: 150
                            }
                        },
                        {
                            id: 2,
                            text: 'Electrical rough-in 85% complete. 3 outlets pending installation.',
                            location: {
                                x: 400,
                                y: 300
                            }
                        },
                        {
                            id: 3,
                            text: 'HVAC ductwork installed. Pending final inspection.',
                            location: {
                                x: 300,
                                y: 400
                            }
                        }
                    ],
                    recommendations: [
                        'Verify the position of the south wall before drywall installation',
                        'Install missing electrical outlet on south wall',
                        'Proceed with drywall installation in areas where electrical and plumbing rough-ins are complete'
                    ],
                    ai_confidence: Math.floor(Math.random() * 10) + 90 // 90-100%
                };
                
                // Resolve with analysis
                setTimeout(() => {
                    resolve(analysis);
                },