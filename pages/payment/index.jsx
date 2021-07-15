// import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import nookies from 'nookies';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import admin from '@/firebase/index';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { currentUser } from '@/Models/User/index';
import { paymentIntent } from '@/Models/Stripe/index';
import { cartByUser } from '@/Models/Cart/index';
import {
  stripeQueryKeys,
  useQueryStripePayment,
} from '@/hooks/query/stripe/index';
import StripeCheckout from '@/components/stripe/StripeCheckout';
import { selectCoupon } from '@/store/coupon';
import { wrapper } from '@/store/configureAppStore';

// load stripe outside of components render to avoid recreating stripe object on every render
const promise = loadStripe(process.env.stripeKeyPublic);

const Payment = ({ name, token, coupon }) => {
  // const coupon = useSelector(selectCoupon);
  // console.log({ coupon });
  const stripePaymentUseQuery = useQueryStripePayment(name, token, coupon);
  return (
    <div className="container p-5 text-center">
      <h4>Complete your purchase</h4>
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
          <StripeCheckout
            clientSecret={stripePaymentUseQuery.data?.clientSecret}
          />
        </div>
      </Elements>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;

  const { appToken, appCoupon } = nookies.get(context);
  console.log('ssr appCoupon: ', appCoupon);

  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const user = await currentUser(email);
    // Using Hydration
    const queryClient = new QueryClient();

    if (user) {
      // console.log('user.name: ', user.name);
      queryClient.prefetchQuery(
        stripeQueryKeys.stripePayment(user.name),
        async () => {
          const cart = await cartByUser(user._id);
          const result = await paymentIntent(cart, appCoupon);
          console.log('pre-fetch - result: ', result);
          // return result;
          return JSON.stringify(result);
        }
      );
    }

    return {
      props: {
        token: appToken,
        coupon: appCoupon,
        name: user.name,
        dehydratedState: dehydrate(queryClient),
      }, // will be passed to the page component as props. always return an object with the props key
    };
  } catch (error) {
    if (error) {
      return {
        // notFound: true,
        redirect: {
          destination: '/login',
          permanent: false,
          // statusCode - In some rare cases, you might need to assign a custom status code for older HTTP Clients to properly redirect. In these cases, you can use the statusCode property instead of the permanent property, but not both.
        },
      };
    }
  }
}

// export function getServerSideProps
//   async (context) {
//     // const { req, res } = context;
//     try {
//       // console.log({ state });
//       // const store = state.getState();
//       // console.log('store.entities: ', store.entities);
//       // const { coupon } = store.entities;
//       // console.log('coupon', coupon);

//       const { appToken } = nookies.get(context);
//       const { email } = await admin.auth().verifyIdToken(appToken);
//       const user = await currentUser(email);

//       // Using Hydration
//       // const queryClient = new QueryClient();

//       // if (user) {
//       //   // console.log('user.name: ', user.name);
//       //   queryClient.prefetchQuery(
//       //     stripeQueryKeys.stripePayment(user.name),
//       //     async () => {
//       //       const cart = await cartByUser(user._id);
//       //       const result = await paymentIntent(cart, coupon);
//       //       console.log('pre-fetch - result: ', result);
//       //       // return result;
//       //       return JSON.stringify(result);
//       //     }
//       //   );
//       // }

//       return {
//         props: {
//           token: appToken,
//           name: user.name,
//           // coupon: coupon,
//           // dehydratedState: dehydrate(queryClient),
//         }, // will be passed to the page component as props. always return an object with the props key
//       };
//     } catch (error) {
//       if (error) {
//         return {
//           // notFound: true,
//           redirect: {
//             destination: '/login',
//             permanent: false,
//             // statusCode - In some rare cases, you might need to assign a custom status code for older HTTP Clients to properly redirect. In these cases, you can use the statusCode property instead of the permanent property, but not both.
//           },
//         };
//       }
//     }
//   };

// export const getServerSideProps = wrapper.getServerSideProps((state) => {
//   return async (context) => {
//     // const { req, res } = context;
//     try {
//       // console.log({ state });
//       // const store = state.getState();
//       // console.log('store.entities: ', store.entities);
//       // const { coupon } = store.entities;
//       // console.log('coupon', coupon);

//       const { appToken } = nookies.get(context);
//       const { email } = await admin.auth().verifyIdToken(appToken);
//       const user = await currentUser(email);

//       // Using Hydration
//       // const queryClient = new QueryClient();

//       // if (user) {
//       //   // console.log('user.name: ', user.name);
//       //   queryClient.prefetchQuery(
//       //     stripeQueryKeys.stripePayment(user.name),
//       //     async () => {
//       //       const cart = await cartByUser(user._id);
//       //       const result = await paymentIntent(cart, coupon);
//       //       console.log('pre-fetch - result: ', result);
//       //       // return result;
//       //       return JSON.stringify(result);
//       //     }
//       //   );
//       // }

//       return {
//         props: {
//           token: appToken,
//           name: user.name,
//           // coupon: coupon,
//           // dehydratedState: dehydrate(queryClient),
//         }, // will be passed to the page component as props. always return an object with the props key
//       };
//     } catch (error) {
//       if (error) {
//         return {
//           // notFound: true,
//           redirect: {
//             destination: '/login',
//             permanent: false,
//             // statusCode - In some rare cases, you might need to assign a custom status code for older HTTP Clients to properly redirect. In these cases, you can use the statusCode property instead of the permanent property, but not both.
//           },
//         };
//       }
//     }
//   };
// });

export default Payment;
