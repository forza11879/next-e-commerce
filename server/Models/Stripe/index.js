import Stripe from 'stripe';

const stripe = new Stripe(process.env.stripeKey);

console.log('process.env.stripeKey: ', process.env.stripeKey);

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
