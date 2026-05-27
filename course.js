// course.js update karein
const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    modules: [{
        title: String,
        videoUrl: String, // Yahan video ka direct path ya link
        content: String   // Padhne ka material
    }],
    assessment: [{
        question: String,
        options: [String],
        correctAnswer: String
    }]
});
