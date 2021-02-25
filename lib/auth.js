import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from './firebase.js';
import { getUserLoggedIn } from '../store/user.js';

function auth() {
  const dispatch = useDispatch();
  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        dispatch(
          getUserLoggedIn({
            email: user.email,
            token: idTokenResult.token,
          })
        );
      }
    });

    // cleanup
    return () => unsubscribe();
  }, []);
  //   return <div></div>;
}

export default auth;
