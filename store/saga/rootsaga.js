import { fork } from 'redux-saga/effects';
import { watchAuth, watchLogout } from './user';
import { watchSearch } from './search';
import { watchCart, watchDeleteCart } from './cart';

export default function* rootSaga() {
  yield fork(watchAuth);
  yield fork(watchLogout);
  yield fork(watchSearch);
  yield fork(watchCart);
  yield fork(watchDeleteCart);
}
