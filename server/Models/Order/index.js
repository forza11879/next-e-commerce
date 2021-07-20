import Order from './Order';

const createOrder = async ({ products, orderedBy, paymentIntent }) => {
  try {
    await new Order({
      products,
      orderedBy,
      paymentIntent,
    }).save();

    return { ok: true };
  } catch (error) {
    console.log('order createOrder error: ', error);
  }
};

export { createOrder };
