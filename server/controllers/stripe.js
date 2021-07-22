// import nookies, { parseCookies, setCookie } from 'nookies';
import { paymentIntent } from '@/Models/Stripe';
import { cartByUser } from '@/Models/Cart';
import { currentUser } from '@/Models/User';

export const createPaymentIntentController = async (req, res) => {
  const { email } = req.user;
  const { couponApplied, appPaymentId } = req.body;

  try {
    const user = await currentUser(email);
    const cart = await cartByUser(user._id);
    const result = await paymentIntent(cart, couponApplied, appPaymentId);

    res.send(result);
  } catch (error) {
    console.log(`createPaymentIntentController error: ${error}`);
  }
};
