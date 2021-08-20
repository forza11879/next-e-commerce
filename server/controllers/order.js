import { currentUser } from '@/Models/User/index';
import { cartByUser } from '@/Models/Cart/index';
import { createOrder, createCashOrder } from '@/Models/Order/index';
import { decrementQuantityIncrementSoldProduct } from '@/Models/Product';

export const createOrderController = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const { email } = req.user;

  try {
    const user = await currentUser(email);
    const cart = await cartByUser(user._id);

    const args = {
      products: cart.products,
      orderedBy: user._id,
      paymentIntent,
    };
    const resultRes = await createOrder(args);

    await decrementQuantityIncrementSoldProduct(cart.products);

    res.status(200).json(resultRes);
  } catch (error) {
    console.log('order createOrderController error: ', error);
  }
};

export const createCashOrderController = async (req, res) => {
  const { COD } = req.body;
  const { email } = req.user;
  try {
    if (!COD) return res.status(400).send('Create cash order failed');

    const user = await currentUser(email);
    const cart = await cartByUser(user._id);

    const args = {
      products: cart.products,
      cartTotal: cart.cartTotal,
      orderedBy: user._id,
    };
    const resultRes = await createCashOrder(args);

    await decrementQuantityIncrementSoldProduct(cart.products);

    res.status(200).json(resultRes);
  } catch (error) {
    console.log('order createCashOrderController error: ', error);
  }
};
