import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { productBrandController } from '@/controllers/product';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'GET':
      await productBrandController(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
