import { handler, authCheck, adminCheck } from '@/middleware/index';
import { getCurrentUser } from '@/controllers/user';

handler.post(authCheck, adminCheck, getCurrentUser);

export default handler;
