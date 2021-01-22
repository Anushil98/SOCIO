import Queue from "bull";

export const redisConfig: Queue.QueueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10)
  }
};
