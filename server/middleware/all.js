// import nc from 'next-connect';
import authCheck from './auth.js';
// import database from './db.js';

// const all = nc();

// all.use(database).use('/user', authCheck);

// export default all;

import dbMiddleware from './db';
import nc from 'next-connect';

export default function createHandler(...middlewares) {
  return nc().use(dbMiddleware, authCheck, ...middlewares);
}
