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

const findUserOrders = async (userId) => {
  const query = { orderedBy: userId };
  try {
    const userOrders = await Order.find(query).populate('products.product');

    return userOrders;
  } catch (error) {
    console.log('user findUserOrders: ', error);
  }
};

export { createOrder, findUserOrders };
