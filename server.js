app.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = new User({ username, email });
        await newUser.save();
        // Ye object return hona chahiye: { "message": "..." }
        res.status(200).json({ message: `Welcome ${username}, Registration Successful!` });
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json({ message: "Database Error: User save nahi hua." });
    }
});
