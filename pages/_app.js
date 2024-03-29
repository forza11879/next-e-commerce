import { useRef } from 'react';
// import { Router } from 'next/dist/client/router';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// import nProgress from 'nprogress';
import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import '../styles/stripe.css';

import AuthComponent from '@/lib/auth';
import configureAppStore from '@/store/configureAppStore';
// import { wrapper } from '@/store/configureAppStore';
import Header from '@/components/nav/Header';
import SideDrawer from '@/components/drawer/SideDrawer';

// Router.events.on('routeChangeStart', nProgress.start);
// Router.events.on('routeChangeComplete', nProgress.done);
// Router.events.on('routeChangeError', nProgress.done);

// const queryClient = new QueryClient();
const store = configureAppStore();

function MyApp({ Component, pageProps }) {
  const queryClientRef = useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        // https://tkdodo.eu/blog/react-query-render-optimizations
        queries: {
          notifyOnChangeProps: 'tracked', // With this, you never have to think about re-renders again
          // refetchOnWindowFocus: false,
          // retry: false,
          // staleTime: 30000,
        },
      },
    }); // https://react-query.tanstack.com/guides/ssr#using-nextjs
  }
  return (
    <>
      <NextAuthProvider session={pageProps.session}>
        <QueryClientProvider client={queryClientRef.current}>
          <Hydrate state={pageProps.dehydratedState}>
            <Provider store={store}>
              {/* <AuthComponent> */}
              <Header />
              <SideDrawer />
              <ToastContainer />
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
              {/* </AuthComponent> */}
            </Provider>
          </Hydrate>
        </QueryClientProvider>
      </NextAuthProvider>
    </>
  );
}

// const makeStore = () => store;
export default MyApp;
// export default wrapper.withRedux(MyApp);
