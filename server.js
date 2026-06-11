const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Env variables secure rakhne ke liye

const adminRoute = require('./adminroute'); 

const app = express();

// --- CRITICAL FIX: CORS Configuration ---
// Yeh ensure karta hai ki aapka Vercel frontend, Render backend ko hit kar paye
app.use(cors({
    origin: '*', // Aap chahein toh '*' ki jagah apni Vercel app ka exact URL daal sakte hain safety ke liye
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- MONGODB CONNECTION ---
// (Apna MongoDB URL yahan properly configured hona chahiye env ya hardcoded)
const mongoURI = process.env.MONGO_URI || "mongodb+srv://..."; 

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- ROUTES ---
app.use('/admin', adminRoute); 

app.get('/', (req, res) => {
    res.send('🚀 LMS Backend Server is Live and Running!');
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("🔥 Server Error Stack:", err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🎧 Server running on port ${PORT}`);
});
