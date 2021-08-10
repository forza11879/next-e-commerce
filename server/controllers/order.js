import { currentUser } from '@/Models/User/index';
import { cartByUser } from '@/Models/Cart/index';
import { createOrder } from '@/Models/Order/index';
import { decrementQuantityIncrementSoldProduct } from '@/Models/Product';

export const createOrderController = async (req, res) => {
  //   console.log('req.body: ', req.body);
  const { paymentIntent } = req.body.stripeResponse;
  const { email } = req.user;

  try {
    const user = await currentUser(email);
    // console.log('user._id: ', user._id);
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
