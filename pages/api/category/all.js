import { handler } from '@/middleware/index';
import { listController } from '@/controllers/category';

handler.get(listController);

export default handler;
