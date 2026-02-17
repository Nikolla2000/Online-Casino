const rateLimit = require('express-rate-limit');
const logger = require('../helpers/logger');

const generalLimiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 180,
    message: 'Too many requests from this IP address, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
    const secondsRemaining = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
        res.status(429).json({
            success: false,
            message: 'Too many requests. Please wait.',
            retryAfter: secondsRemaining
        });
    }
});

const authLimiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 5,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn('User exceeded rate limit on logging', {
            ip: req.ip,
            endpoint: req.originalUrl,
            method: req.method
        });

        const secondsRemaining = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);

        res.status(429).json({
            success: false,
            message: 'Too many requests',
            retryAfter: secondsRemaining
        });
    }
});

const gameLimiter = rateLimit({
    windowMs: 1000 * 60,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const secondsRemaining = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
        res.status(429).json({
            success: false,
            message: 'Too many game requests. Slow down!',
            retryAfter: secondsRemaining
        });
    }
})

const chatbotLimiter = rateLimit({
    windowMs: 1000 * 60,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const secondsRemaining = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
        res.status(429).json({
            success: false,
            message: 'Too many chatbot messages. Please wait!',
            retryAfter: secondsRemaining
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    gameLimiter,
    chatbotLimiter
}
