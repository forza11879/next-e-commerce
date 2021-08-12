import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { ordersController } from '@/controllers/user';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'GET':
      await authCheck(req, res, next);
      await ordersController(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
