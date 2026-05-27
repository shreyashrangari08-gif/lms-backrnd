Const mongoose = require('mongoose');

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

const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = { User, Course };

