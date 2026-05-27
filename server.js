app.post('/login', async (req, res) => {
    try {
        const { username, email } = req.body;
        // Check karenge ki user database mein hai ya nahi
        const user = await User.findOne({ email });
        
        if (user && user.username === username) {
            res.status(200).json({ message: `Welcome back, ${username}! Login Successful.` });
        } else {
            res.status(401).json({ message: "Invalid username or email." });
        }
    } catch (err) {
        res.status(500).json({ message: "Login Error: " + err.message });
    }
});
