const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User } = require('./models'); // Aapka purana User model
const Course = require('./course');   // Nayi file (course.js)

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 Connected to MongoDB"))
  .catch(err => console.error("❌ DB Error:", err));

// Auth Routes (Register/Login)
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

// Course Routes
// Is route se aap database mein naye courses add kar sakte ho
app.post('/add-course', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({ message: "Course added successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error adding course: " + err.message });
    }
});

// Saare courses fetch karne ke liye
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: "Error fetching courses: " + err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
