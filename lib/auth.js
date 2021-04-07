import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from './firebase';
import { getHttpRequest } from '@/store/user';

function AuthComponent({ children }) {
  // console.log('AuthComponent ctx:', ctx);
  const dispatch = useDispatch();
  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // console.log('user AuthComponent: ', user);
      if (!user) return;

      const { token } = await user.getIdTokenResult();
      // nookies.set(undefined, 'token', token, {});
      dispatch(
        getHttpRequest({
          url: '/user',
          method: 'get',
          token: token,
        })
      );
    });

    // cleanup
    return () => unsubscribe();
  }, []);
  return <>{children}</>;
}

export default AuthComponent;
