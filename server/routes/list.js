import express from 'express';
import { getList } from '../controllers/list.js';

function getListRoutes() {
  const router = express.Router();

  router.get('/', getList);

  return router;
}
export { getListRoutes };
