require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Course } = require('./models'); // Naya file import kiya

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 LMS Database Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Register Route
app.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = new User({ username, email });
        await newUser.save();
        res.json({ message: `Welcome ${username}, Registration Successful!` });
    } catch (err) {
        res.status(500).json({ error: "Registration Failed" });
    }
});

// Home route
app.get('/', (req, res) => res.send("SmartLMS Backend is Running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
