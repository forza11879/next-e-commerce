import nookies, { destroyCookie } from 'nookies';
import User from './User';

const createOrUpdateUser = async ({ name, picture, email }) => {
  const query = { email };
  const update = { name: email.split('@')[0], picture };
  const options = { new: true };
  try {
    const user = await User.findOneAndUpdate(query, update, options);
    if (user) {
      // console.log('USER UPDATED', user);
      return user;
    } else {
      const newUser = await User.create({
        email,
        name: email.split('@')[0],
        picture,
      });
      // console.log('USER CREATED', newUser);
      return newUser;
    }
  } catch (error) {
    console.log('createOrUpdateUser error: ', error);
  }
};

const currentUser = async (email) => {
  const query = { email };
  try {
    const user = await User.findOne(query);
    // console.log('user: ', user);
    return user;
  } catch (error) {
    console.log('currentUser error: ', error);
  }
};

const logOut = (res) => {
  try {
    // nookies.destroy({ res }, 'appToken');
    destroyCookie({ res }, 'appToken');
  } catch (error) {
    console.log('logout error: ', error);
  }
};

export { createOrUpdateUser, currentUser, logOut };
