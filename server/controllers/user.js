import {
  createOrUpdateUser,
  currentUser,
  logOut,
  saveAddress,
} from '@/Models/User/index';
import dbMiddleware from '@/middleware/db';

export const postUser = async (req, res) => {
  console.log('postUser from api/user route');
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
    console.log('req.user', req.user);
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
