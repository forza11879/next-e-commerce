import { handler, authCheck } from '@/middleware/index';
import { postCreateOrUpdateUser, getUser } from '@/controllers/user';

handler.get(getUser);
handler.post(authCheck, postCreateOrUpdateUser);

export default handler;
