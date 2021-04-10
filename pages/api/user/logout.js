// import { handler } from '@/middleware/index';
import { getLogOutUser } from '@/controllers/user';

export default async function userHandler(req, res, next) {
  const { method } = req;

  switch (method) {
    case 'GET':
      await getLogOutUser(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// handler.get(getLogOutUser);

// export default handler;
