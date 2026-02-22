const { default: rateLimit } = require("express-rate-limit");
const redis = require('../config/redis');
const { createHandler } = require("./rateLimiter");
const RedisStore = require('../config/redisRateLimitStore');
/**
 * Redis-backed rate limiting for production scalability.
 * 
 * - Persistent rate limits across server restarts
 * - Shared state across multiple server instances if any (horizontal scaling)
 * - Centralized rate limit tracking
 * 
 * Falls back to in-memory store if Redis is unavailable
 */


const generalLimiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    client: redis,
    prefix: 'rl:general:'
  }),

  handler: (req, res) => {
    const secondsRemaining = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);

    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait,',
      retryAfter: secondsRemaining
    })
  }
});

const authLimiter = rateLimit({
  windowMs: 1000 * 60 * 7,
  max: 7,
  skipSuccessfulRequests: true,
  legacyHeaders: false,

  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),

  handler: createHandler('Too many login attempts. Please wait.', true)
});

const gameLimiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    client: redis,
    prefix: 'rl:game:',
  }),

  handler: createHandler('Too many game requests. Slow down!')
});

const chatbotLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    client: redis,
    prefix: 'rl:chatbot:'
  }),

  handler: createHandler('Too many chatbot messages. Please wait!')
});

module.exports = {
  generalLimiter,
  authLimiter,
  gameLimiter,
  chatbotLimiter,
}