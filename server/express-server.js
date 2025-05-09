
/**
 * Express server for face authentication
 * 
 * This file would be in a separate Node.js project, not part of the React frontend.
 * It's included here for documentation purposes only.
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;
const FLASK_API = 'http://localhost:5000'; // Python Flask server
const JWT_SECRET = 'your-jwt-secret'; // Should be in environment variables

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/faceauth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  faceId: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Ensure uploads directory exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// Routes

// Signup route
app.post('/auth/signup', upload.single('faceImage'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already registered' 
      });
    }
    
    // Validate inputs
    if (!name || !email || !password || !req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Send face image to Flask API for embedding
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));
    
    const flaskResponse = await axios.post(`${FLASK_API}/register`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });
    
    if (!flaskResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: 'Face registration failed: ' + flaskResponse.data.message
      });
    }
    
    // Create new user with face embedding ID
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      faceId: flaskResponse.data.embedding_id
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      userId: newUser._id.toString()
    });
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login route
app.post('/auth/login', upload.single('faceImage'), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check authentication method
    if (req.file) {
      // Face authentication
      const formData = new FormData();
      formData.append('image', fs.createReadStream(req.file.path));
      formData.append('user_id', user.faceId);
      
      const flaskResponse = await axios.post(`${FLASK_API}/verify`, formData, {
        headers: {
          ...formData.getHeaders(),
        }
      });
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      if (!flaskResponse.data.success) {
        return res.status(401).json({
          success: false,
          message: 'Face verification failed'
        });
      }
    } else if (password) {
      // Password authentication
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
    } else {
      // No authentication provided
      return res.status(400).json({ 
        success: false, 
        message: 'Password or face image required' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasFaceId: !!user.faceId
    };
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Authentication middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No authentication token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Protected route example
app.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
