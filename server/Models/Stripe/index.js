import Stripe from 'stripe';

const stripe = new Stripe(process.env.stripeKey);

console.log('process.env.stripeKey: ', process.env.stripeKey);

const paymentIntent = async (cart, couponApplied) => {
  const { cartTotal, totalAfterDiscount } = cart;
  // console.log('couponApplied', couponApplied);
  // console.log({ cart });
  // console.log({ cartTotal, totalAfterDiscount });

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }
  // console.log('couponApplied: ', couponApplied);
  // console.log('finalAmount typeof: ', typeof finalAmount);
  // console.log('finalAmount: ', finalAmount);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'usd',
    });

    // return paymentIntent.client_secret;
    return {
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalAfterDiscount,
      payable: finalAmount,
    };
  } catch (error) {
    console.log(`paymentIntent error: ${error}`);
  }
};

export { paymentIntent };
