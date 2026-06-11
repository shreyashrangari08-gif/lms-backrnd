const express = require('express');
const router = express.Router();
const { User, Certificate } = require('./models'); //

// --- Strict Admin Dashboard API Route ---
router.get('/dashboard-data', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalCertificates = await Certificate.countDocuments({});
        res.status(200).json({
            success: true,
            totalUsers: totalUsers,
            totalCertificates: totalCertificates
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// --- Weekly / Monthly Activity Route ---
router.get('/stats', async (req, res) => {
    try {
        const type = req.query.type;
        if (type === 'weekly') {
            res.status(200).json([{ email: "testuser@gmail.com", action: "signed up", timestamp: new Date() }]);
        } else {
            res.status(200).json([{ email: "testuser@gmail.com", action: "logged in", timestamp: new Date() }]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Download CSV Route ---
router.get('/download', async (req, res) => {
    res.header('Content-Type', 'text/csv');
    res.attachment('users_data.csv');
    res.send('Email,Role,CreatedAT\nshreyashrangari08@gmail.com,Admin,' + new Date());
});

// --- REGISTER API (NEW) ---
router.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new User({ username, email });
        await newUser.save();
        
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration.", error: error.message });
    }
});

// --- LOGIN API (NEW) ---
router.post('/login', async (req, res) => {
    try {
        const { username, email } = req.body;

        const user = await User.findOne({ username, email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        res.status(200).json({ success: true, message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error during login.", error: error.message });
    }
});

module.exports = router; //
