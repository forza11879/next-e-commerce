import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from './firebase';
import { getUserLoggedIn } from '@/store/user';

function AuthComponent() {
  const dispatch = useDispatch();
  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // console.log('user Auth: ', user);
      if (user) {
        const { token } = await user.getIdTokenResult();
        dispatch(
          getUserLoggedIn({
            token: token,
          })
        );
      }
    });

    // cleanup
    return () => unsubscribe();
  }, []);
  return null;
}

export default AuthComponent;
