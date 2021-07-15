import Stripe from 'stripe';

const stripe = new Stripe(process.env.stripeKey);

const paymentIntent = async (cart, couponApplied) => {
  const { cartTotal, totalAfterDiscount } = cart;
  console.log({ totalAfterDiscount });

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  console.log({ finalAmount });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'usd',
    });

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
