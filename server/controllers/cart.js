import { userCart } from '@/Models/Cart/index';

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
