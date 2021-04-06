import admin from '../firebase/index.js';
import nookies from 'nookies';

const authCheck = async (req, res, next) => {
  const { token } = req.headers;
  console.log('authCheck');

  nookies.set({ res }, 'appToken', token, {
    // maxAge: 72576000,
    httpOnly: true,
    path: '/',
  });

  try {
    const firebaseUser = await admin.auth().verifyIdToken(token);
    // console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);
    req.user = firebaseUser;

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};

export default authCheck;
