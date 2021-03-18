import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from './firebase.js';
import { getUserLoggedIn } from '../store/user.js';

// const url = '/user/create-or-update';
// // const url = '/user';
// const method = 'post';

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
