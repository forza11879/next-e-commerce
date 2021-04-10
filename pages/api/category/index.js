// import Cors from 'cors';
// import initMiddleware from '@/middleware/init-middelware';
import db from '@/middleware/db';
import { handler, authCheck, adminCheck } from '@/middleware/index';
import { createController } from '@/controllers/category';

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

// handler.use(authCheck).use(adminCheck).post(createController);

// export default handler;

// Initialize the cors middleware
// const cors = initMiddleware(
//   // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
//   Cors({
//     // Only allow requests with POST
//     methods: ['POST'],
//   })
// );
