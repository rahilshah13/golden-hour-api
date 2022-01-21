const redis = require('redis');
 
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost', 
    port: 6379,
});

(async () => await redisClient.connect())();

redisClient.on('connect', () => {
    console.log("connected to redis.");
});

redisClient.on('error', err => {
    console.log('Error ' + err);
});

module.exports = {
    redisClient
}