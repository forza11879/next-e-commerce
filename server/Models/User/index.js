import { User } from './User.js';

const createOrUpdateUser = async ({ name, picture, email }) => {
  const query = { email };
  const update = { name: email.split('@')[0], picture };
  const options = { new: true };

  const user = await User.findOneAndUpdate(query, update, options);
  if (user) {
    console.log('USER UPDATED', user);
    return user;
  } else {
    const newUser = await User.create({
      email,
      name: email.split('@')[0],
      picture,
    });
    console.log('USER CREATED', newUser);
    return newUser;
  }
};

export { createOrUpdateUser };
