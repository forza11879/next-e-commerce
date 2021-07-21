import Stripe from 'stripe';

const stripe = new Stripe(process.env.stripeKey);

const paymentIntent = async (
  cart,
  couponApplied,
  appPaymentIntentId = null
) => {
  let paymentIntent;
  const { cartTotal, totalAfterDiscount } = cart;

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  try {
    if (appPaymentIntentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(appPaymentIntentId);
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: 'usd',
      });
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntent,
      cartTotal,
      totalAfterDiscount,
      payable: finalAmount,
    };
  } catch (error) {
    console.log(`paymentIntent error: ${error}`);
  }
};

export { paymentIntent };
