import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { orderStatusController } from '@/controllers/admin';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'PUT':
      await authCheck(req, res, next);
      await adminCheck(req, res, next);
      await orderStatusController(req, res);
      break;
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
