import { handler, authCheck, adminCheck } from '@/middleware/index';
import {
  readController,
  updateController,
  removeController,
} from '@/controllers/category';

handler.get(readController);
handler.put(authCheck, adminCheck, updateController);
handler.delete(authCheck, adminCheck, removeController);

export default handler;
