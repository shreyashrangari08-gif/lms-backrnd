const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDesc: String,
    longDesc: String,
    imageUrl: String,
    videoUrl: String, // YouTube Embed Link
    source: String
});

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
