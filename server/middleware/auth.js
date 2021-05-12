import initMiddleware from '@/middleware/init-middelware';
import admin from '@/firebase/index';

import nookies from 'nookies';

const authCheck = async (req, res, next) => {
  const { token } = req.headers;
  console.log('authCheck');

  try {
    const firebaseUser = token
      ? await admin.auth().verifyIdToken(token)
      : undefined;

    // console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);

    if (firebaseUser) {
      req.user = firebaseUser;
      nookies.set({ res }, 'appToken', token, {
        // maxAge: 72576000,
        httpOnly: true,
        path: '/',
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      error: {
        code: 'invalid_token',
        message: 'Invalid or Expired Token',
      },
    });
  }
};

export default initMiddleware(authCheck);
