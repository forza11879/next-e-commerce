import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { productStarController } from '@/controllers/product';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'PUT':
      await authCheck(req, res, next);
      await productStarController(req, res);
      break;
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
