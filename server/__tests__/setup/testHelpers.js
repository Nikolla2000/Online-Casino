const jwt = require('jsonwebtoken');

const generateTestToken = (userId = 'test_user_123') => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET || 'test_secret',
        { expiresIn: '1h' }
    );
};

module.exports = {
    generateTestToken
};