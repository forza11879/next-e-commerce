// import nc from 'next-connect';
// import authCheck from '../../server/middleware/auth.js';
import { createHandler } from '../../server/middleware';
import {
  postCreateOrUpdateUser,
  getUser,
} from '../../server/controllers/user.js';

// const handler = nc();

// handler.use(all);
const handler = createHandler();

handler.post(postCreateOrUpdateUser);
// handler.get(getUser);

export default handler;
