import nc from 'next-connect';
import { authCheck } from '../../server/middleware/auth.js';
import { all } from '../../server/middleware';
import {
  postCreateOrUpdateUser,
  getUser,
} from '../../server/controllers/user.js';

const handler = nc();

handler.use(all);

handler.post(authCheck, postCreateOrUpdateUser);
// handler.get(getUser);

export default handler;
