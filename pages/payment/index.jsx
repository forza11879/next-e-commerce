import nookies from 'nookies';
import axios from 'axios';
import admin from '@/firebase/index';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { currentUser } from '@/Models/User/index';
// import { paymentIntent } from '@/Models/Stripe/index';
// import { cartByUser } from '@/Models/Cart/index';
import StripeCheckout from '@/components/stripe/StripeCheckout';

// load stripe outside of components render to avoid recreating stripe object on every render
const promise = loadStripe(process.env.stripeKeyPublic);

const Payment = ({
  token,
  clientSecret,
  coupon,
  userName,
  cartTotal,
  totalAfterDiscount,
  payable,
}) => {
  return (
    <div className="container p-5 text-center">
      <h4>Complete your purchase</h4>
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
          <StripeCheckout
            clientSecret={clientSecret}
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

    const baseURL = process.env.api;

    async function fetchStripePayment(appToken, appCoupon) {
      console.log(`${baseURL}/create-payment-intent`);
      try {
        const { data } = await axios.request({
          baseURL,
          url: '/create-payment-intent',
          method: 'post',
          headers: { token: appToken },
          data: { couponApplied: appCoupon },
        });
        // console.log({ data });
        return data;
        // return JSON.stringify(data);
      } catch (error) {
        console.log('fetchStripePayment error:', error);
      }
    }

    // const result =
    const { clientSecret, cartTotal, totalAfterDiscount, payable } =
      await fetchStripePayment(appToken, appCoupon);
    // console.log({ result });

    // const cart = await cartByUser(user._id);
    // const { clientSecret, cartTotal, totalAfterDiscount, payable } =
    //   await paymentIntent(cart, appCoupon);

    return {
      props: {
        token: appToken,
        clientSecret,
        coupon: appCoupon,
        userName: user.name,
        cartTotal,
        totalAfterDiscount,
        payable,
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
