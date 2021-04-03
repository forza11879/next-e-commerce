import { handler, authCheck } from '@/middleware/index';
import { postCreateOrUpdateUser, getCurrentUser } from '@/controllers/user';

handler.get(authCheck, getCurrentUser);
handler.post(authCheck, postCreateOrUpdateUser);

export default handler;
