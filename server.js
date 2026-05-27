const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User } = require('./models'); // Check kar lena ki models.js mein User define hai

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 LMS Database Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Register Route (Isi ko humne update kiya hai)
app.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = new User({ username, email });
        await newUser.save();
        res.status(200).json({ message: `Welcome ${username}, Registration Successful!` });
    } catch (err) {
        // Yahan ab asli error message dikhega
        res.status(500).json({ message: "DB Error: " + err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
