import ncc from 'next-connect';
import database from './db.js';

const all = nc();

all.use(database);

export default all;
