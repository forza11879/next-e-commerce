import { currentUser } from '@/Models/User/index';
import { cartByUser } from '@/Models/Cart/index';
import { createOrder } from '@/Models/Order/index';

export const createOrderController = async (req, res) => {
  //   console.log('req.body: ', req.body);
  const { paymentIntent } = req.body.stripeResponse;
  const { email } = req.user;
  console.log({ email });

  try {
    const user = await currentUser(email);
    console.log('user._id: ', user._id);
    const cart = await cartByUser(user._id);
    console.log({ cart });

    const args = {
      products: cart.products,
      orderedBy: user._id,
      paymentIntent,
    };

    const resultRes = await createOrder(args);

    res.status(200).json(resultRes);
  } catch (error) {
    console.log('order createOrderController error: ', error);
  }
};
