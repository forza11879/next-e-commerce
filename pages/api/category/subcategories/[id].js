import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { getSubCategoriesController } from '@/controllers/subcategory';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);
  switch (method) {
    case 'GET':
      await getSubCategoriesController(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
