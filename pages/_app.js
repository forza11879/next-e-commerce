import { useRef } from 'react';
// import { Router } from 'next/dist/client/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// import nProgress from 'nprogress';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

import AuthComponent from '@/lib/auth';
import configureAppStore from '@/store/configureAppStore';
import Header from '@/components/nav/Header';

// Router.events.on('routeChangeStart', nProgress.start);
// Router.events.on('routeChangeComplete', nProgress.done);
// Router.events.on('routeChangeError', nProgress.done);

// const queryClient = new QueryClient();
const store = configureAppStore();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: 'tracked',
    },
  },
});

function MyApp({ Component, pageProps }) {
  const queryClientRef = useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        // https://tkdodo.eu/blog/react-query-render-optimizations
        queries: {
          notifyOnChangeProps: 'tracked', // With this, you never have to think about re-renders again
        },
      },
    }); // https://react-query.tanstack.com/guides/ssr#using-nextjs
  }
  return (
    <>
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider store={store}>
            <AuthComponent>
              <Header />
              <ToastContainer />
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
            </AuthComponent>
          </Provider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
