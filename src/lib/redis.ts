import { createClient } from 'redis';

const password = process.env.REDIS_PASS ?? '';
const host = process.env.REDIS_HOST ?? 'localhost';
const port = parseInt(process.env.REDIS_PORT ?? '6379');

export const client = createClient({
  password,
  socket: {
    host,
    port,
  },
});
