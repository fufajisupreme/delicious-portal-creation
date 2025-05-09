
# Face Authentication System

This project implements a complete face authentication system with three components:

1. **React Frontend**: Captures face images and communicates with the backend
2. **Node.js/Express Backend**: Handles authentication, manages users, and communicates with the face recognition service
3. **Python/Flask Face Recognition Service**: Processes face images, creates embeddings, and verifies identities

## Architecture

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                   │      │                   │      │                   │
│  React Frontend   │ ──── │ Express Backend   │ ──── │ Flask Face API    │
│  (Port 3000)      │      │ (Port 3001)       │      │ (Port 5000)       │
│                   │      │                   │      │                   │
└───────────────────┘      └───────────────────┘      └───────────────────┘
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
   UI Components              MongoDB Database            Face Embeddings
   Form Handling              User Management             Face Detection
   API Communication          JWT Authentication          Face Comparison
```

## Setup Instructions

### 1. Python Flask Server

```bash
# Install dependencies
pip install flask flask-cors numpy opencv-python face_recognition

# Run the server
python flask-server.py
```

The Flask server will run on port 5000 and provide two endpoints:
- `/register` - Registers a new face and returns an embedding ID
- `/verify` - Verifies a face against a stored embedding

### 2. Node.js Express Server

```bash
# Install dependencies
npm install express cors multer axios bcrypt jsonwebtoken mongoose

# Run the server
node express-server.js
```

The Express server will run on port 3001 and provide the following endpoints:
- `/auth/signup` - Registers a new user with face data
- `/auth/login` - Authenticates a user with password and/or face
- `/user/profile` - Protected route example

### 3. React Frontend

The React frontend communicates with the Express backend and provides a user interface for:
- User registration with face capture
- User login with password and/or face verification
- User profile management

## Security Considerations

- Face embeddings (not raw images) are stored for privacy and security
- Passwords are hashed using bcrypt
- JWT is used for session management
- CORS is enabled for secure cross-origin communication

## Deployment Notes

For production deployment:
- Use environment variables for sensitive information
- Set up proper HTTPS for all services
- Implement rate limiting to prevent brute force attacks
- Add proper logging and monitoring
- Consider containerization using Docker for consistent deployment
