import express from 'express';
import { getListRoutes } from './list.js';

function getRoutes() {
  // All routes in our Node API are placed on this router
  const router = express.Router();

  // router.use() prefixes our route (i.e. /api/v1/auth)
  router.use('/list', getListRoutes());
  // app.use(errorHandler);

  return router;
}

export { getRoutes };
