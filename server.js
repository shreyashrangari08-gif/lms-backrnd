const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Course } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
// Render ke Environment variables se URI utha raha hai
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 LMS Database Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Register Route
app.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = new User({ username, email });
        await newUser.save();
        res.status(200).json({ message: `Welcome ${username}, Registration Successful!` });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Database Error: User save nahi hua." });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username } = req.body;
    res.status(200).json({ message: `Welcome back, ${username}! Login Successful.` });
});

// Home route
app.get('/', (req, res) => res.send("SmartLMS Backend is Running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
