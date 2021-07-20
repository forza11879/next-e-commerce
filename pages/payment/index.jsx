import { useState } from 'react';
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

// load stripe outside of components render to avoid recreating stripe object on every render
const promise = loadStripe(process.env.stripeKeyPublic);

const Payment = ({ userName, token, coupon }) => {
  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const options = {
    name: userName,
    token,
    coupon,
    props: {
      setCartTotal,
      setTotalAfterDiscount,
      setPayable,
    },
  };

  const stripePaymentUseQuery = useQueryStripePayment(options);
  return (
    <div className="container p-5 text-center">
      <h4>Complete your purchase</h4>
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
          <StripeCheckout
            clientSecret={stripePaymentUseQuery.data?.clientSecret}
            coupon={coupon}
            cartTotal={cartTotal}
            totalAfterDiscount={totalAfterDiscount}
            payable={payable}
            token={token}
            userName={userName}
          />
        </div>
      </Elements>
    </div>
  );
};

export async function getServerSideProps(context) {
  // const { req, res } = context;
  const { appToken, appCoupon } = nookies.get(context);
  try {
    const { email } = await admin.auth().verifyIdToken(appToken);
    const user = await currentUser(email);
    // Using Hydration
    const queryClient = new QueryClient();

    if (user) {
      queryClient.prefetchQuery(
        stripeQueryKeys.stripePayment(user.name),
        async () => {
          const cart = await cartByUser(user._id);
          const result = await paymentIntent(cart, appCoupon);
          return JSON.stringify(result);
        }
      );
    }
    return {
      props: {
        token: appToken,
        coupon: appCoupon,
        userName: user.name,
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

export default Payment;
