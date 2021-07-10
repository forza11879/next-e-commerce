import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

const paymentIntent = async () => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency: 'usd',
    });

    return paymentIntent.client_secret;
  } catch (error) {
    console.log(`paymentIntent error: ${error}`);
  }
};

export { paymentIntent };
