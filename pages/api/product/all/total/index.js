import db from '@/middleware/db';
import { productsCountController } from '@/controllers/product';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res);

  switch (method) {
    case 'GET':
      await productsCountController(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
