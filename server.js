const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); // Ensure path is correct
const Course = require('./course');    // Ensure path is correct

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ DB Error:', err));

// Auth Routes
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

// Course Routes
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

// NAYA ROUTE: Specific course ke liye
app.get('/course/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
