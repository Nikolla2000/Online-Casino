const rateLimit = require('express-rate-limit');
const logger = require('../helpers/logger');

const createHandler = (message, shouldLog = false) => (req, res) => {
    const secondsRemaining = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);

    if (shouldLog) {
        logger.warn(`Rate limit exceeded: ${message}`, {
            ip: req.ip,
            endpoint: req.originalUrl,
            method: req.method
        });
    }
    res.set('Retry-After', String(secondsRemaining));
    res.status(429).json({
        success: false,
        message,
        retryAfter: secondsRemaining
    });
};

const generalLimiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 180,
    message: 'Too many requests from this IP address, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: createHandler('Too many requests. Please wait.')
});

const authLimiter = rateLimit({
    windowMs: 1000 * 60 * 5,
    max: 5,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    handler: createHandler('Too many login attempts. Please wait.', true)
});

const gameLimiter = rateLimit({
    windowMs: 1000 * 60,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    handler: createHandler('Too many game requests. Slow down!')
})

const chatbotLimiter = rateLimit({
    windowMs: 1000 * 60,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: createHandler('Too many chatbot messages. Please wait!')
});

module.exports = {
    generalLimiter,
    authLimiter,
    gameLimiter,
    chatbotLimiter
}
