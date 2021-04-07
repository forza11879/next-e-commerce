import { handler } from '@/middleware/index';
import { getLogOutUser } from '@/controllers/user';

handler.get(getLogOutUser);

export default handler;
