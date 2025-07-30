const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { comparePasswords } = require('../helpers/auth');

const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await comparePasswords(password, user.password);
    if (match) {
        const token = jwt.sign({ id: user.id, username: user.username },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' });
            return res.json({ token });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
}

const validateToken = (req, res) => {
    const token = res.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: { id: decoded.id, username: decoded.username } });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = {
    login,
    validateToken,
}