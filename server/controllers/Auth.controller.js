const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { comparePasswords } = require('../helpers/auth');
const { generateAccessToken, generateRefreshToken } = require('../helpers/tokens');
const generateUsername = require('../helpers/generateUsername');
const asyncHandler = require('../helpers/asyncHandler');
const { UnauthorizedError, ValidationError } = require('../helpers/errors');

/**
 * Authenticate user with username and password
 * 
 * @route POST /server/v1/auth/login
 * @accesss Public
 * @param {string} req.body.username - User username
 * @param {string} req.body.password - User password
 * @returns {Promise<Object>} JSON response with access token
 */
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new ValidationError('Username and password are required');
    }

    const user = await User.findOne({ username });

    if (!user || !(await comparePasswords(password, user.password))) {
        throw new UnauthorizedError('Password is wrong');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.isOnline = true;
    user.lastSeen = new Date()
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: false,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'Strict',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
});

/**
 * Refreshes access token using valid refresh token from cookies
 * 
 * @route POST /server/v1/auth/refresh
 * @access Private
 * @param {string} req.cookies.refreshToken - Refresh token stored in HTTP-only cookie
 * @returns {Promise<Object>} JSON response with new access token or error
 */
const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ error: 'Invalid refresh token' });

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

/**
 * Logs out user by invalidating refresh token and clearing cookies
 * 
 * @route POST /server/v1/auth/logout
 * @access Private
 * @param {string} req.cookies.refreshToken - Refresh token to invalidate
 * @returns {Promise<void>} No content response on success
 */
const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

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

    res.clearCookie('refreshToken', { 
        httpOnly: true,
        // sameSite: 'Strict', 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV === 'production', 
        path: '/' 
    });
    res.sendStatus(204);
}

/**
 * Return the current authenticated user's profile information
 * 
 * @route GET /server/v1/auth/me
 * @access Private
 * @param {string} req.headers.authorization - Bearer token in format "Bearer <access_token>"
 * @returns {Promise<Object>} JSON response with user data, excluding sensitive fields
 */
const me = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password -refreshToken');

    if (!user) {
        throw new NotFoundError('User not found');
    }
    
    return res.status(200).json(user);
});

/**
 * Handles OAuth authentication (Google)
 * 
 * @route /server/v1/auth/oauth
 * @access Public
 * @param {string} email - User email 
 * @param {string} firstName - User first name
 * @param {string} lastName - User last name
 * @param {string} oauthId - Unique identifier from OAuth provider
 * @param {string} oauthProvider - OAuth provier name ('google', 'facebook'...)
 * @returns {Promise<Object>} JSON response with access token and sets refresh token cookie
 */
const oauthLogin = asyncHandler(async (req, res) => {
    const { email, firstName, lastName, oauthId, oauthProvider } = req.body;

    if (!email) throw new ValidationError('Email is required');
    if (!oauthProvider) throw new ValidationError('OAuth provider is required');

    let user = await User.findOne({ 
        $or: [
            { email },
            { oauthId, oauthProvider }
        ]
    });

    if (user && user.oauthId !== oauthId && user.oauthProvider === oauthProvider) {
        throw new ConflictError('Email is already associated with a different account from this provider');
    }

    if (user && user.hasPassword && !user.oauthId) {
        throw new ConflictError('An account with this email already exists. Please log in with your password first.');
    }


    if (!user) {
        let username = generateUsername(email, firstName, lastName);
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
        });
    } 

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.isOnline = true;
    user.lastSeen = new Date()

    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: false,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'Strict',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
});


module.exports = {
    login,
    refresh,
    logout,
    me,
    oauthLogin,
}