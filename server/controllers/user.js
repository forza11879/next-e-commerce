import {
  createOrUpdateUser,
  currentUser,
  logOut,
  saveAddress,
  updateUserWishList,
  findUserWishList,
  removeProductFromUserWishList,
} from '@/Models/User/index';
import { findUserOrders } from '@/Models/Order/index';
import dbMiddleware from '@/middleware/db';

export const postUser = async (req, res) => {
  // console.log('postUser from api/user route');
};

export const getCurrentUser = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await currentUser(email);
    // console.log('user: ', user);
    res.status(200).json({ user: user });
  } catch (error) {
    console.log('getCurrentUser error:', error);
  }
};

export const postCreateOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;
  const args = { name, picture, email };
  try {
    const user = await createOrUpdateUser(args);
    // console.log('user: ', user);
    res.status(201).json({ user: user });
  } catch (error) {
    console.log('postCreateOrUpdateUser error: ', error);
  }
};

export const getLogOutUser = async (req, res) => {
  try {
    // console.log('req.user', req.user);
    logOut(res);
    // console.log('user: ', user);
    res.status(200).json({ message: 'user logged out' });
  } catch (error) {
    console.log('getLogOutUser error: ', error);
    res.status(400).json({
      error: 'something went wrong',
    });
  }
};

export const saveAddressController = async (req, res) => {
  const { email } = req.user;
  const { address } = req.body;
  try {
    const result = await saveAddress(email, address);
    res.status(200).json(result);
  } catch (error) {
    console.log('saveAddressController error: ', error);
    res.status(400).json({
      error: 'something went wrong',
    });
  }
};

export const ordersController = async (req, res) => {
  const { email } = req.user;
  // console.log({ email });
  try {
    const user = await currentUser(email);
    const userOrders = await findUserOrders(user._id);
    res.status(200).json(userOrders);
  } catch (error) {
    console.log('ordersController error: ', error);
    res.status(400).json({
      error: 'something went wrong',
    });
  }
};

export const addToWishlistController = async (req, res) => {
  const { productId } = req.body;
  const { email } = req.user;
  try {
    await updateUserWishList(email, productId);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log('user addToWishlistController error: ', error);
    res.status(400).json({
      error: 'something went wrong',
    });
  }
};

export const wishlistController = async (req, res) => {
  const { email } = req.user;
  try {
    const userWishList = await findUserWishList(email);
    res.status(200).json(userWishList);
  } catch (error) {
    console.log('user wishlistController error: ', error);
    res.status(400).json({
      error: 'something went wrong',
    });
  }
};

export const removeFromWishlistController = async (req, res) => {
  const { email } = req.user;
  const { productId } = req.params;
  try {
    await removeProductFromUserWishList(email, productId);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log('user removeFromWishlistController error: ', error);
    res.status(400).json({
      error: 'something went wrong',
    });
  }
};
