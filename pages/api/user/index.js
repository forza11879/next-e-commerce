import db from '@/middleware/db';
import { handler, authCheck } from '@/middleware/index';
import { postCreateOrUpdateUser, getCurrentUser } from '@/controllers/user';

export default async function userHandler(req, res, next) {
  const { method } = req;
  await db(req, res, next);

  switch (method) {
    case 'GET':
      await authCheck(req, res, next);
      await getCurrentUser(req, res);
      break;
    case 'POST':
      await authCheck(req, res, next);
      await postCreateOrUpdateUser(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// handler.use(authCheck).get(getCurrentUser);
// handler.use(authCheck).post(postCreateOrUpdateUser);

// export default handler;
