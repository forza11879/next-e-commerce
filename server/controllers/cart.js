import {
  getUserCart,
  userCart,
  emptyCart,
  cartByUser,
} from '@/Models/Cart/index';
import { currentUser } from '@/Models/User/index';

export const getUserCartController = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await currentUser(email);
    const cart = await getUserCart(user._id);
    console.log({ cart });
    res.status(200).json(cart);
  } catch (error) {
    console.log('cart getUserCartController controller error: ', error);
  }
};

export const userCartController = async (req, res) => {
  const { cart } = req.body;
  const { email } = req.user;
  try {
    const user = await currentUser(email);
    const cartOfUser = await cartByUser(user._id);
    const result = await userCart(cart, cartOfUser, user._id);
    res.status(200).json({ ok: result });
  } catch (error) {
    console.log('cart userCartController controller error: ', error);
  }
};

export const emptyCartController = async (req, res) => {
  const { email } = req.user;
  try {
    const cart = await emptyCart(email);
    res.status(200).json(cart);
  } catch (error) {
    console.log('cart emptyCartController controller error: ', error);
  }
};

emptyCartController;
