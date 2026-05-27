const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 Connected to MongoDB"))
  .catch(err => console.error("❌ DB Error:", err));

// Register Route
app.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = new User({ username, email });
        await newUser.save();
        res.status(200).json({ message: `Welcome ${username}, Registration Successful!` });
    } catch (err) {
        res.status(500).json({ message: "DB Error: " + err.message });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({ email });
        if (user && user.username === username) {
            res.status(200).json({ message: `Welcome back, ${username}! Login Successful.` });
        } else {
            res.status(401).json({ message: "Invalid username or email." });
        }
    } catch (err) {
        res.status(500).json({ message: "Login Error: " + err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
