import dbMiddleware from './db';
import nextConnect from 'next-connect';

export const post = (middleware) => {
  return nextConnect().post(middleware);
};

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
}).use(dbMiddleware);

export default apiRoute;
