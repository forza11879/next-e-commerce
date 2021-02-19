import express from 'express';
import logger from 'loglevel';
import 'express-async-errors';
// import { NextHandlerType } from '.'
// import errorHandler from './middleware/error';
import { promisify } from 'util';
import { setupCloseOnExit } from './utils.js';
// import getRoutes from './routes';
// import bodyParser from 'body-parser';
import { getRoutes } from './routes/index.js';

function startServer(handle, port) {
  const app = express();
  // You don't want people to know you are using express
  app.disable('x-powered-by');

  //   app.use(bodyParser.json());
  //   app.use(bodyParser.urlencoded({ extended: false }));

  // Takes the raw requests(like forms) and turns them into usable properties on req.body
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(express.json({ extended: false })); // Used to parse JSON bodies.

  // Mount Rout
  app.use('/api/v1', getRoutes());

  //   app.use(errorHandler);

  // next doing heavy lifting for us
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`>> Listening at ${port}`);

      const originalClose = server.close.bind(server);

      server.close = promisify(originalClose);

      setupCloseOnExit(server);

      resolve(server);
    });
  });
}

export { startServer };
