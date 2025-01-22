const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Logged in successfully' });
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router; 