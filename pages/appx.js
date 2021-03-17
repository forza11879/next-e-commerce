import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

import { auth } from '../lib/firebase.js';
import { getUserLoggedIn } from '../store/user.js';

import configureAppStore from '../store/configureAppStore.js';

import Header from '../components/nav/Header.jsx';

const store = configureAppStore();

function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        dispatch(
          getUserLoggedIn({
            // email: user.email,
            url: url,
            method: method,
            token: idTokenResult.token,
          })
        );
      }
    });

    // cleanup
    return () => unsubscribe();
  }, []);
  return (
    <>
      <Provider store={store}>
        <Header />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
