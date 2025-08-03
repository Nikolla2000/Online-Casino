const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { comparePasswords } = require('../helpers/auth');
const { generateAccessToken, generateRefreshToken } = require('../helpers/tokens');


const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });

    if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
}


const refresh = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user || user.refreshToken !== token) return res.sendStatus(403);

        const accessToken = generateAccessToken(user._id);
        res.json({ accessToken });
    } catch (err) {
        res.status(403).json({ error: err });
    }
}


const logout = async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.sendStatus(204);

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
    } catch {}

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
    res.sendStatus(204);
}

module.exports = {
    login,
    refresh,
    logout,
}