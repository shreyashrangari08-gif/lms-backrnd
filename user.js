const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    certificateEarned: { type: Boolean, default: false }, // Naya field
    courseProgress: { type: Number, default: 0 }           // Naya field
}, { timestamps: true }); // Yeh line important hai - ye apne aap 'createdAt' date add karegi

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
