import { getUserCart, userCart, emptyCart } from '@/Models/Cart/index';

export const getUserCartController = async (req, res) => {
  const { email } = req.user;
  try {
    const cart = await getUserCart(email);
    res.status(200).json(cart);
  } catch (error) {
    console.log('cart getUserCartController controller error: ', error);
  }
};

export const userCartController = async (req, res) => {
  const { cart } = req.body;
  const { email } = req.user;
  try {
    const result = await userCart(cart, email);
    res.status(200).json({ ok: result });
  } catch (error) {
    console.log('cart userCartController controller error: ', error);
  }
};

export const emptyCartController = async (req, res) => {
  const { email } = req.user;
  console.log({ email });
  try {
    const cart = await emptyCart(email);
    res.status(200).json(cart);
  } catch (error) {
    console.log('cart emptyCartController controller error: ', error);
  }
};

emptyCartController;
