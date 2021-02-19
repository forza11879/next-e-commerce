import next from 'next';
import logger from 'loglevel';
import { startServer } from './start.js';

// const port = parseInt(process.env.PORT!) || 3000
const port = 300;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// export type NextHandlerType = typeof handle

app.prepare().then(() => {
  logger.setLevel('INFO');

  startServer(handle, port);
});
