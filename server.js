const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const User = require('./user');
const Course = require('./course');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ DB Error: ', err));

// --- AI Chatbot Logic ---
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        // Gemini Flash model ka latest endpoint use kar rahe hain
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("AI Error Details:", error.message);
        // Error ko catch karke client ko bhej rahe hain taaki aap submit kar sakein
        res.status(500).json({ reply: "AI Model load nahi ho pa raha. Error: " + error.message });
    }
});

// --- AUTH & OTHER ROUTES ---
app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json({ message: 'Registration Successful!' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/login', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({ email });
        if (user && user.username === username) res.status(200).json({ message: 'Login Successful!' });
        else res.status(401).json({ message: 'Invalid credentials.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
