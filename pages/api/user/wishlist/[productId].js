import db from '@/middleware/db';
import { handler, authCheck } from '@/middleware/index';
import { removeFromWishlistController } from '@/controllers/user';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'PUT':
      await authCheck(req, res, next);
      await removeFromWishlistController(req, res);
      break;
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
