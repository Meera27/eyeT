# eyeT - Eye Health Monitoring System

## Problem Statement

In today's digital world, prolonged screen time leads to various eye health issues. eyeT provides a comprehensive solution for:

- Tracking screen time and enforcing healthy breaks
- Automated eye condition detection using AI
- Early detection of eye problems like red-eyes
- Building better screen time habits

## Features

### 1. Screen Time Management

- Real-time screen time tracking with HH:MM:SS display
- Start/Stop/Reset functionality
- Automated 20-20-20 rule implementation
- Visual and audio break notifications
- 20 second countdown timer for eye breaks

### 2. Eye Health Analysis

- Image upload capabilities
- Camera integration for capturing eye photos
- AI-powered eye condition detection using Roboflow
- Red-eye detection and classification
- Health status reporting and recommendations
- Image storage and history tracking

### 3. User Management

- User registration with profile details
- Secure login system
- Personal eye health history
- Data persistence across sessions

## Tech Stack

### Frontend

- Vue.js 3
- Vue Router for navigation
- Axios for API requests
- HTML5 File & Camera APIs
- LocalStorage for client-side data

### Backend

- Django REST Framework
- MySQL Database
- Django Custom User Model
- JWT Authentication

### AI/ML

- Roboflow API integration
- Computer vision for eye analysis
- Image classification model

### Development Tools

- Vite build tool
- ESLint for linting
- Git version control
- VS Code IDE support

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Meera27/eyeT
```

Install frontend dependencies:

`npm install`
Install backend dependencies:

`pip install -r requirements.txt`
Start development servers:

```
# Frontend
npm run dev

# Backend
python manage.py runserver
```

Project Structure

```

├── src/
│ ├── components/ # Vue components
│ ├── pages/ # Page components
│ ├── router/ # Route definitions
│ ├── assets/ # Static assets
│ └── api/ # API configurations
├── backend/
│ ├── accounts/ # User management
│ └── eyeT/ # Main Django app

```

```

```

```

```

```

```

```

```
