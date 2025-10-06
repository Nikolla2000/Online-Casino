const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { comparePasswords } = require('../helpers/auth');
const { generateAccessToken, generateRefreshToken } = require('../helpers/tokens');
const generateUsername = require('../helpers/generateUsername');


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


const oauthLogin = async (req, res) => {
    try {
        const { email, firstName, lastName, oauthId, oauthProvider } = req.body;
    
        if (!email) return res.status(400).json({ error: 'Email is required' });
        if (!oauthProvider) return res.status(400).json({ error: 'OAuth provider is required' });

        let user = await User.findOne({ 
            $or: [
                { email },
                { oauthId, oauthProvider }
            ]
        });

        if (user && user.oauthId !== oauthId && user.oauthProvider === oauthProvider) {
            return res.status(400).json({ 
                error: 'Email is already associated with a different account from this provider' 
            });
        }

        if (user && user.hasPassword && !user.oauthId) {
            // Could offer linking accs in future
            return res.status(400).json({ 
                error: 'An account with this email already exists. Please log in with your password first.' 
            });
        }
    
    
        if (!user) {
            const username = generateUsername(email, firstName, lastName);
            let usernameExists = await User.findOne({ username });
            let counter = 1;

            while (usernameExists) {
                username = `${generateUsername(email, firstName, lastName)}${counter}`;
                usernameExists = await User.findOne({ username });
                counter++;
                if (counter > 100) { // safety limit
                    username = `${generateUsername(email, firstName, lastName)}${Date.now()}`;
                    break;
                }
            }

            user = new User({
                firstName,
                lastName,
                username,
                email,
                oauthProvider,
                oauthId,
                hasPassword: false,
                isVerified: true,
                // password: null
            })
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
    
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


module.exports = {
    login,
    refresh,
    logout,
    me,
    oauthLogin,
}