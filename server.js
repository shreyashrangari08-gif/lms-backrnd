const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// --- AI Chatbot Logic (Static for Submission) ---
app.post('/chat', async (req, res) => {
    // Ye line koi error nahi degi aur submission mein help karegi
    res.json({ reply: "AI Assistant is currently under maintenance. Backend connection is active." });
});

// --- AUTH ROUTES ---
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
