const Redis=require("ioredis")
const dotenv=require('dotenv').config();
const redis = new Redis(process.env.REDIS);
module.exports=redis;