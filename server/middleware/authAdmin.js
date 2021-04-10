import initMiddleware from '@/middleware/init-middelware';
import { currentUser } from '@/Models/User/index';

const adminCheck = async (req, res, next) => {
  const { email } = req.user;
  console.log('adminCheck');
  try {
    const user = await currentUser(email);

    if (user.role !== 'admin') {
      res.status(403).json({
        error: 'Admin resource. Access denied.',
      });
    } else {
      next();
    }
  } catch (error) {
    console.log('error adminCheck: ', error);
  }
};

export default initMiddleware(adminCheck);
