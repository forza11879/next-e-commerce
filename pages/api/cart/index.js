import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { getUserCartController, userCartController } from '@/controllers/cart';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'GET':
      await authCheck(req, res, next);
      await getUserCartController(req, res);
      break;
    case 'POST':
      await authCheck(req, res, next);
      await userCartController(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
