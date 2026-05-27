require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Course } = require('./models');

const app = express(); // <--- Ye line sabse upar honi chahiye
app.use(cors());
app.use(express.json());

// Phir iske niche aapke routes aane chahiye
app.post('/register', async (req, res) => { ... });
