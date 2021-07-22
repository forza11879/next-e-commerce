import nookies, { parseCookies, setCookie } from 'nookies';
import { paymentIntent } from '@/Models/Stripe';
import { cartByUser } from '@/Models/Cart';
import { currentUser } from '@/Models/User';

export const createPaymentIntentController = async (req, res) => {
  const { email } = req.user;
  const { couponApplied } = req.body;

  const { appPayment } = parseCookies({ req });
  console.log({ appPayment });

  try {
    const user = await currentUser(email);
    const cart = await cartByUser(user._id);
    const result = await paymentIntent(cart, couponApplied, appPayment);

    if (!appPayment) {
      console.log({ appPayment });
      const paymentIntendId = result.paymentIntent.id;
      console.log({ paymentIntendId });

      // Set
      // nookies.set(ctx, 'appPayment', paymentIntendId, {
      //   maxAge: 30 * 24 * 60 * 60,
      //   path: '/',
      // });
    }

    res.send(result);
  } catch (error) {
    console.log(`createPaymentIntentController error: ${error}`);
  }
};
