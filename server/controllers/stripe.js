import { parseCookies, setCookie } from 'nookies';
import { paymentIntent } from '@/Models/Stripe';
import { cartByUser } from '@/Models/Cart';
import { currentUser } from '@/Models/User';

export const createPaymentIntentController = async (req, res) => {
  const { email } = req.user;
  const { couponApplied } = req.body;

  const { appPaymentIntentId } = parseCookies({ req });
  console.log({ appPaymentIntentId });

  try {
    const user = await currentUser(email);
    const cart = await cartByUser(user._id);
    const result = await paymentIntent(cart, couponApplied, appPaymentIntentId);

    if (!appPaymentIntentId) {
      console.log({ appPaymentIntentId });
      const paymentIntendId = result.paymentIntent.id;
      console.log(
        'paymentIntendId: ',
        JSON.parse(JSON.stringify(paymentIntendId))
      );
      // JSON.parse(JSON.stringify(paymentIntendId))

      setCookie({ res }, 'appPaymentIntentId', paymentIntendId, {
        // maxAge: 72576000,
        httpOnly: true,
        path: '/',
      });
    }

    res.send(result);
  } catch (error) {
    console.log(`createPaymentIntentController error: ${error}`);
  }
};
