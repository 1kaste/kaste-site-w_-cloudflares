
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./db');
const SiteContent = require('./models/SiteContent');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// --- CORS Configuration ---
// Define allowed origins. For maximum flexibility with Netlify previews,
// we'll allow any origin. In a higher-security production environment,
// this might be locked down to specific domains.
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
};

// --- Middleware ---
// Apply CORS middleware to all routes
app.use(cors(corsOptions));
// Handle preflight requests across all routes
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '50mb' })); // Increase limit for potential base64 images

// --- Socket.IO Setup ---
// Use the same CORS options for Socket.IO
const io = new Server(server, {
    cors: corsOptions
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Health check route for Render
app.get('/', (req, res) => {
    res.status(200).send('Kaste Brands & Designs API is running.');
});

// API Routes
app.get('/api/content', async (req, res) => {
    try {
        let content = await SiteContent.findOne();
        if (!content) {
            // If no content exists, create it from the default structure
            console.log('No content found in DB, creating from default.');
            content = new SiteContent({}); // Mongoose will use schema defaults
            await content.save();
        }
        res.json(content.content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Server error while fetching content' });
    }
});

app.post('/api/content', async (req, res) => {
    try {
        const newContent = req.body;
        // Use findOneAndUpdate with upsert:true to create the document if it doesn't exist
        const updatedContent = await SiteContent.findOneAndUpdate({}, { content: newContent }, { new: true, upsert: true });
        
        // Notify all connected clients that the content has been updated
        io.emit('contentUpdated');
        console.log('Content updated and notification sent.');
        
        res.json(updatedContent.content);
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({ message: 'Server error while saving content' });
    }
});

app.post('/api/content/reset', async (req, res) => {
    try {
        // Find and delete the existing document
        await SiteContent.deleteOne({});
        // Create a new one with default values from the schema
        const defaultContent = new SiteContent({});
        await defaultContent.save();

        // Notify all connected clients
        io.emit('contentUpdated');
        console.log('Content reset to default and notification sent.');
        
        res.json(defaultContent.content);
    } catch (error) {
        console.error('Error resetting content:', error);
        res.status(500).json({ message: 'Server error while resetting content' });
    }
});

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    
    // Use the environment variable, with the old hardcoded password as a fallback.
    const masterPassword = process.env.MASTER_PASSWORD || '39344323';

    if (password === masterPassword) {
        // Note: For higher security, this endpoint should return a session token (JWT)
        // to be used for authenticating subsequent admin actions.
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
