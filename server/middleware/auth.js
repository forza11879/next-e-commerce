import admin from '../firebase/index.js';

const authCheck = async (req, res, next) => {
  console.log('authCheck');
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.token);
    console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (err) {
    res.status(401).json({
      err: 'Invalid or expired token',
    });
  }
};

export default authCheck;
