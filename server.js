const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // AI Import
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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ reply: "AI abhi busy hai." });
    }
});

// --- AUTH ROUTES ---
app.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = new User({ username, email });
        await newUser.save();
        res.status(200).json({ message: 'Registration Successful!' });
    } catch (err) {
        res.status(500).json({ message: 'DB Error: ' + err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({ email });
        if (user && user.username === username) {
            res.status(200).json({ message: 'Login Successful!' });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Login Error: ' + err.message });
    }
});

// --- COURSE ROUTES ---
app.post('/add-course', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({ message: 'Course added successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error: ' + err.message });
    }
});

app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Error: ' + err.message });
    }
});

// --- ADMIN ROUTE ---
app.get('/api/admin/dashboard-data', async (req, res) => {
    try {
        const userEmail = req.query.email;
        if (userEmail !== 'shreyashrangari08@gmail.com') {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }
        const totalUsers = await User.countDocuments();
        const totalCertificates = await User.countDocuments({ certificateEarned: true });
        res.status(200).json({ success: true, totalUsers, totalCertificates });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
