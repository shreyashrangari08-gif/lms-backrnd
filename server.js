require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 LMS Database Connected"))
  .catch(err => console.log("❌ DB Error:", err));

app.get('/', (req, res) => res.send("SmartLMS Backend is Running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
