const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    instructor: String,
    quiz: [{ 
        question: String, 
        options: [String], 
        answer: String 
    }]
});

module.exports = mongoose.model('Course', courseSchema);
