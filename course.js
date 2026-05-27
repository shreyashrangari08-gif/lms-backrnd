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

// Ye fix error ko rok dega
module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
