import { handler, authCheck, adminCheck } from '@/middleware/index';
import { createController } from '@/controllers/category';

handler.post(authCheck, adminCheck, createController);

export default handler;
