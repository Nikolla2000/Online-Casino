const redis = require('./redis');

/**
 * Custom Redis store for express-rate-limit
 * 
 * Implements the Store interface required by express-rate-limit.
 * Uses native Redis commands (INCR, PEXPIRE, PTTL) for efficient rate limiting.
 */
class RedisRateLimitStore {
  constructor(options = {}) {
    this.prefix = options.prefix || 'rl:';
    this.client = options.client || redis;
    this.windowMs = null;
  }

  init(options) {
    this.windowMs = options.windowMs;
  }

  async increment(key) {
    const redisKey = `${this.prefix}${key}`;
    
    try {
      const totalHits = await this.client.incr(redisKey);
      
      if (totalHits === 1) {
        await this.client.pExpire(redisKey, this.windowMs);
      }
      
      const ttl = await this.client.pTTL(redisKey);
      const resetTime = new Date(Date.now() + ttl);
      
      return { totalHits, resetTime };
    } catch (err) {
      console.error('Redis rate limit error:', err);
      return {
        totalHits: 0,
        resetTime: new Date(Date.now() + this.windowMs)
      };
    }
  }

  async decrement(key) {
    const redisKey = `${this.prefix}${key}`;
    try {
      const current = await this.client.get(redisKey);
      if (current && parseInt(current) > 0) {
        await this.client.decr(redisKey);
      }
    } catch (err) {
      console.error('Redis decrement error:', err);
    }
  }

  async resetKey(key) {
    const redisKey = `${this.prefix}${key}`;
    try {
      await this.client.del(redisKey);
    } catch (err) {
      console.error('Redis reset error:', err);
    }
  }
}

module.exports = RedisRateLimitStore;