import nextConnect from 'next-connect';

const post = (...middleware) => {
  return nextConnect().post(...middleware);
};

export default post;
