import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { createController } from '@/controllers/product';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'POST':
      await authCheck(req, res, next);
      await adminCheck(req, res, next);
      await createController(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
