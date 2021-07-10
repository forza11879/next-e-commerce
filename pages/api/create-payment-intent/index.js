import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { createPaymentIntentController } from '@/controllers/stripe';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'POST':
      await authCheck(req, res, next);
      await createPaymentIntentController(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
