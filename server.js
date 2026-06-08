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
        // Updated model for latest SDK
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        const result = await model.generateContent(prompt);
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ reply: "Error: " + error.message });
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
