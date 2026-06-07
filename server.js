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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ reply: "AI abhi busy hai." });
    }
});

// --- AUTH & COURSE ROUTES (Purane Wale) ---
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

// --- ADMIN ROUTES (NEW UPDATED) ---

// 1. Dashboard Stats
app.get('/api/admin/dashboard-data', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCertificates = await User.countDocuments({ certificateEarned: true });
        res.status(200).json({ totalUsers, totalCertificates });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Weekly/Monthly Stats
app.get('/api/admin/stats', async (req, res) => {
    const { type } = req.query;
    // Logic: Agar weekly hai to pichle 7 din ka data, monthly to 30 din ka
    const days = type === 'weekly' ? 7 : 30;
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    const count = await User.countDocuments({ createdAt: { $gte: date } });
    res.json({ period: type, count: count });
});

// 3. CSV Download Feature
app.get('/api/admin/download', async (req, res) => {
    try {
        const users = await User.find();
        let csv = "Name,Email,Date\n";
        users.forEach(u => csv += `${u.username},${u.email},${u.createdAt}\n`);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="users_data.csv"');
        res.send(csv);
    } catch (err) { res.status(500).send("Error"); }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
