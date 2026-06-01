const express = require('express');
const router = express.Router();

// Tumhare models.js se User aur Certificate models ko connect kiya
// Note: Agar tumhari models file ka naam 'models.js' hai, toh ye bilkul sahi chalega
const { User, Certificate } = require('./models'); 

// 📊 Strict Admin Dashboard API Route
router.get('/dashboard-data', async (req, res) => {
    try {
        const userEmail = req.query.email; // Frontend se aane wali email

        // 🔒 STRICT SECURITY LOCK: Sirf tumhari email allowed hai
        if (userEmail !== "shreyashrangari08@gmail.com") {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: Sirf Shreyash hi is data ko dekh sakta hai!" 
            });
        }

        // 📈 Database se shuruwaat se lekar ab tak ka saara data count karna
        const totalUsers = await User.countDocuments({}); 
        const totalCertificates = await Certificate.countDocuments({}); 

        // Safe data frontend ko bhejna
        res.status(200).json({
            success: true,
            totalUsers: totalUsers,
            totalCertificates: totalCertificates
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

module.exports = router;
