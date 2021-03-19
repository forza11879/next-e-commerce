import { handler, post, authCheck } from '../../server/middleware';
import {
  postCreateOrUpdateUser,
  getUser,
} from '../../server/controllers/user.js';

handler.get(getUser);
handler.use(post(authCheck, postCreateOrUpdateUser));

export default handler;
