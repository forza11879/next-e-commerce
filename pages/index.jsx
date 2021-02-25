import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../lib/firebase.js';
import { getUserLoggedIn } from '../store/user.js';

function HomePage() {
  const dispatch = useDispatch();
  const email = 'forza1879@gmail.com';
  const token = 'asaskfskjdfsjdf';

  // to check firebase auth state
  useEffect(() => {
    // const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //   if (user) {
    //     const idTokenResult = await user.getIdTokenResult();
    //     // console.log('user', user);
    //     // console.log('user.email:', user.email);
    //     // console.log('idTokenResult.token: ', idTokenResult.token);
    //     dispatch(
    //       getUserLoggedIn({
    //         email: user.email,
    //         token: idTokenResult.token,
    //       })
    //     );
    //   }
    // });
    dispatch(
      getUserLoggedIn({
        email: email,
        token: token,
      })
    );
    // cleanup
    // return () => unsubscribe();
  }, []);
  return (
    <div>
      <p>Hello HomePage!!</p>
    </div>
  );
}

export default HomePage;
