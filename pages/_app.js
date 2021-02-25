import React, { useEffect } from 'react';
import { Router } from 'next/dist/client/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import nProgress from 'nprogress';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

import { auth } from '../lib/firebase.js';

import configureAppStore from '../store/configureAppStore.js';

import Header from '../components/nav/Header.jsx';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeComplete', nProgress.done);
Router.events.on('routeChangeError', nProgress.done);

const queryClient = new QueryClient();
const store = configureAppStore();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Header />
          <ToastContainer />
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
