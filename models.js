const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String
});

// Course Schema
const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    videoUrl: String
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = { User, Course };

