import Order from './Order';
import uniqueid from 'uniqueid';

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

const createCashOrder = async ({ products, cartTotal, orderedBy }) => {
  try {
    await new Order({
      products,
      paymentIntent: {
        id: uniqueid(),
        amount: cartTotal,
        currency: 'usd',
        status: 'Cash On Delivery',
        created: Date.now(),
        payment_method_types: ['cash'],
      },
      orderedBy,
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
    console.log('order findUserOrders: ', error);
  }
};

const findAllOrders = async (userId) => {
  const query = {};
  try {
    const allOrders = await Order.find(query)
      .sort('-createdAt')
      .populate('products.product');
    // console.log({ allOrders });

    return allOrders;
  } catch (error) {
    console.log('order findAllOrders: ', error);
  }
};

const updateOrder = async (orderId, orderStatus) => {
  const query = { _id: orderId };
  const update = { orderStatus };
  const option = { new: true };
  try {
    const updated = await Order.findByIdAndUpdate(query, update, option);

    return updated;
  } catch (error) {
    console.log('order updateOrder error: ', error);
  }
};

export {
  createOrder,
  createCashOrder,
  findUserOrders,
  findAllOrders,
  updateOrder,
};
