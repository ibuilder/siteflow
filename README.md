# SiteFlow - Construction Management Platform

SiteFlow is an AI-powered construction management software designed to make construction sites more efficient, safer, and better connected. This web application provides a frontend interface for the SiteFlow platform.

## Features

### 1. Adaptive Scheduling
- Workers input personal schedules that dynamically update based on project progress
- AI-driven updates linked to jobsite photos
- Color-coded task status (red for overdue, green for on time, blue for today)
- Mini-map feature for focused area views

### 2. AI Chatbot
- Intelligent, self-learning chatbot for instant answers
- Integrates with drawings, photos, and site data
- Provides real-time progress reports and updates
- Natural language interface for intuitive interaction

### 3. Enhanced Safety Tools
- 360-degree camera integration for safety walks
- Real-time identification of safety violations
- Comprehensive reporting for OSHA and site-specific regulations
- Automatic safety compliance tracking

### 4. Progress Tracking
- Photo/video capture with automatic drawing integration
- Real-time progress updates
- Discrepancy identification between plans and as-built conditions
- AI-powered progress analysis and reporting

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5 for responsive design
- jQuery for DOM manipulation
- Chart.js for data visualization
- Font Awesome for icons

### Backend (Not included in this repository)
- Node.js/Express for API services
- MongoDB for database
- Python for AI/ML components
- TensorFlow for computer vision models
- AWS S3 for media storage

## Project Structure

```
siteflow/
├── README.md
├── index.html
├── pages/
│   ├── dashboard.html
│   ├── schedule.html
│   ├── progress-tracking.html
│   ├── safety.html
│   ├── chat.html
│   └── settings.html
├── css/
│   ├── main.css
│   ├── dashboard.css
│   ├── schedule.css
│   ├── progress-tracking.css
│   ├── safety.css
│   └── chat.css
├── js/
│   ├── main.js
│   ├── dashboard.js
│   ├── schedule.js
│   ├── progress-tracking.js
│   ├── safety.js
│   ├── chat.js
│   └── ai-integration.js
├── components/
│   ├── navbar.js
│   ├── sidebar.js
│   └── footer.js
├── assets/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── site-images/
│   │   └── icons/
│   └── demo-data/
│       ├── schedules.json
│       ├── drawings.json
│       └── progress-photos.json
└── vendor/
    ├── bootstrap/
    ├── jquery/
    └── fontawesome/
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js and npm (for development)

### Installation
1. Clone the repository:
```
git clone https://github.com/siteflow/siteflow-web.git
cd siteflow-web
```

2. Install dependencies (for development):
```
npm install
```

3. For production, simply open `index.html` in a web browser or deploy the entire directory to a web server.

## Key Components

### 1. Dashboard
The dashboard provides a comprehensive overview of the project, including:
- Task status and progress
- Safety compliance metrics
- Recent activity feed
- AI-generated insights and recommendations

### 2. Schedule
The schedule component offers:
- Interactive calendar view
- List and Gantt chart views
- Mini-map for area focusing
- Color-coded task status
- AI-driven schedule updates

### 3. Safety Monitoring
The safety module includes:
- Real-time safety violation detection
- OSHA compliance tracking
- Safety walk scheduling and reporting
- AI-powered hazard identification

### 4. AI Chatbot
The AI assistant provides:
- Natural language interface to project data
- Real-time answers to queries about progress, safety, and schedules
- Integration with drawings and photos
- Proactive recommendations and insights

### 5. Progress Tracking
The progress tracking feature offers:
- Photo/video upload with AI analysis
- Automatic progress detection
- Drawing-to-reality comparison
- Discrepancy identification and reporting

## AI Integration

The AI integration system provides the following capabilities:

1. **Computer Vision for Progress Tracking**
   - Analyzes construction photos to determine completion percentage
   - Identifies construction elements and compares to plans
   - Detects discrepancies between drawings and reality

2. **Safety Analysis**
   - Identifies PPE compliance and safety violations
   - Detects potential hazards in construction sites
   - Generates safety reports and recommendations

3. **Natural Language Processing**
   - Understands and responds to user queries about project status
   - Extracts relevant information from project documents
   - Generates human-readable reports and insights

4. **Predictive Analytics**
   - Forecasts project timelines based on current progress
   - Identifies potential delays before they occur
   - Recommends resource allocation adjustments

## Development

### Coding Standards
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use semantic HTML5 elements
- Maintain responsive design principles
- Comment code for clarity

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
Proprietary - All rights reserved

## Contact
For demo requests or more information, visit [siteflow.com](https://siteflow.com)
