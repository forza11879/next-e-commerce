import admin from '../firebase/index.js';
import nookies from 'nookies';

const authCheck = async (req, res, next) => {
  const { token } = req.headers;
  // console.log('req.headers.token: ', token);
  console.log('authCheck');
  try {
    const firebaseUser = await admin.auth().verifyIdToken(token);
    // console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);
    req.user = firebaseUser;

    next();
  } catch (err) {
    res.status(401).json({
      err: 'Invalid or expired token',
    });
  }
};

export default authCheck;
