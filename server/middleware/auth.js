import admin from '../firebase/index.js';

const authCheck = async (req, res, next) => {
  const { token } = req.headers;
  console.log('authCheck');
  // console.log('authCheck req.headers: ', req.headers);
  try {
    const firebaseUser = await admin.auth().verifyIdToken(token);
    // console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);
    req.user = firebaseUser;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};

export default authCheck;
