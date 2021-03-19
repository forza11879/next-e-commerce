import { handler, authCheck } from '../../server/middleware';
import {
  postCreateOrUpdateUser,
  getUser,
} from '../../server/controllers/user.js';

handler.get(getUser);
handler.post(authCheck, postCreateOrUpdateUser);

export default handler;
