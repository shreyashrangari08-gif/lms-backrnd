const mongoose = require('mongoose'); // <--- YE LINE SABSE ZAROORI HAI

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String
});

module.exports = mongoose.model('Course', courseSchema);
