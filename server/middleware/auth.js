import admin from '../firebase/index.js';
import nookies from 'nookies';

const authCheck = async (req, res, next) => {
  const { token } = req.headers;
  // console.log('req.headers.token: ', token);
  console.log('authCheck');
  try {
    if (!token) {
      console.log('authCheck !!!token');
      nookies.destroy(null, 'appToken');
      console.log('destroyCookie');
    } else {
      console.log('authCheck token');
      const firebaseUser = await admin.auth().verifyIdToken(token);
      // console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);
      req.user = firebaseUser;
      nookies.set({ res }, 'appToken', token, {
        // maxAge: 72576000,
        httpOnly: true,
        path: '/',
      });
    }
    next();
  } catch (err) {
    res.status(401).json({
      err: 'Invalid or expired token',
    });
  }
};

export default authCheck;
