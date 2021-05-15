import db from '@/middleware/db';
import { listController } from '@/controllers/product';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res);

  switch (method) {
    case 'POST':
      await listController(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
