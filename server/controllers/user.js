import { createOrUpdateUser } from '../Models/User/index.js';

export const postUser = async (req, res) => {
  console.log('postUser from api/user route');
};

export const getUser = async (req, res) => {
  console.log('getUser from api/user route');
  res.status(200).json({ message: 'getUser route' });
};

export const postCreateOrUpdateUser = async (req, res) => {
  console.log('postCreateOrUpdateUser from api/user route');
  const { name, picture, email } = req.user;
  const args = { name, picture, email };
  const user = await createOrUpdateUser(args);
  console.log('user: ', user);
  res.json(user);
};
