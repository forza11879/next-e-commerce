import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import {
  readController,
  updateController,
  removeController,
} from '@/controllers/subcategory';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);
  switch (method) {
    case 'GET':
      await readController(req, res);
      break;
    case 'PUT':
      await authCheck(req, res, next);
      await adminCheck(req, res, next);
      await updateController(req, res);
      break;
    case 'DELETE':
      await authCheck(req, res, next);
      await adminCheck(req, res, next);
      await removeController(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
