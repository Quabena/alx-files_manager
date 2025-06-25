const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err.message || err);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          console.error(`Error getting key ${key}:`, err.message || err);
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }

  set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          console.error(`Error setting key ${key}:`, err.message || err);
          return reject(err);
        }
        return resolve(true);
      });
    });
  }

  del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          console.error(`Error deleting key ${key}:`, err.message || err);
          return reject(err);
        }
        return resolve(true);
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
