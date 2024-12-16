const express = require('express');
const { getUserByEmail, createUser} = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { email, password: hashedPassword };
        const result = await createUser(user);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        return res.status(200).json({ message: 'Logged in', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
