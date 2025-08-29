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
        return res.status(401).json({ error: "Invalid credentials", user: user });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.isOnline = true;
    user.lastSeen = new Date()
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure: false,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
}


const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user || user.refreshToken !== refreshToken) return res.sendStatus(403);  

        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save();

        const accessToken = generateAccessToken(payload.userId);
        res.json({ accessToken });
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            try {
                const decoded = jwt.decode(refreshToken);
                if (decoded && decoded.userId) {
                    await User.findByIdAndUpdate(
                        decoded.userId, {
                            $set: {
                                isOnline: false,
                                lastSeen: new Date()
                            }
                        }
                        )
                    }
                } catch (decodeError) {
                    console.error('Error decoding token during refresh failure:', decodeError);
            }
        }
        res.status(403).json({ error: err });

    }
}


const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    // try {
    //     const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    //     const user = await User.findById(payload.userId);
    //     if (user) {
    //       user.refreshToken = null;
          
    //       await user.save();
    //     }
    // } catch {}

    try {
        await User.findOneAndUpdate(
            { refreshToken: token },
            {
                $set: {
                    refreshToken: null,
                    isOnline: false,
                    lastSeen: new Date()
                }
            }
        );

    } catch (error) {
        console.error('Logout error:', error);
    }

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
    res.sendStatus(204);
}


const me = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.sendStatus(401);
        
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(payload.userId).select('-password -refreshToken');
        
        res.json(user);
    } catch (err) {
        res.status(403).json({ error: err });
    }
}


module.exports = {
    login,
    refresh,
    logout,
    me,
}