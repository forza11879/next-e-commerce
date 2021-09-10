import initMiddleware from '@/middleware/init-middelware';
// import admin from '@/firebase/index';
import { getSession } from 'next-auth/client';

// import { setCookie } from 'nookies';
// import { session } from 'next-auth/client';

const authCheck = async (req, res, next) => {
  const session = await getSession({ req });
  console.log({ session });

  if (!session) {
    res.status(401).json({
      error: {
        code: 'Unauthenticated user',
        message: 'Unauthenticated user',
      },
    });
  } else {
    console.log('authCheck');
    req.user = session.user;
    // res.status(200).json({ message: 'Success', session });
    next();
  }
  // const { token } = req.headers;

  // console.log('authCheck');

  // try {
  //   const firebaseUser = token
  //     ? await admin.auth().verifyIdToken(token)
  //     : undefined;

  //   // console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);

  //   if (firebaseUser) {
  //     // req.firebaseUser = firebaseUser;
  //     req.user = firebaseUser;

  //     setCookie({ res }, 'appToken', token, {
  //       // maxAge: 72576000,
  //       httpOnly: true,
  //       path: '/',
  //     });

  //     // nookies.set({ res }, 'appToken', token, {
  //     //   // maxAge: 72576000,
  //     //   httpOnly: true,
  //     //   path: '/',
  //     // });
  //   }

  //   next();
  // } catch (error) {
  //   res.status(401).json({
  //     error: {
  //       code: 'invalid_token',
  //       message: 'Invalid or Expired Token',
  //     },
  //   });
  // }
};

export default initMiddleware(authCheck);
