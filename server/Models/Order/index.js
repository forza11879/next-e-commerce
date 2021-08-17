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

export { createOrder, findUserOrders, findAllOrders, updateOrder };
