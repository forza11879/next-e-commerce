import { fork } from 'redux-saga/effects';
import { watchAuth, watchLogout } from './user';
import { watchSearch } from './search';
import { watchCart, watchDeleteCart, watchResetCart } from './cart';
import { watchDrawer } from './drawer';
import { watchCoupon } from './coupon';

export default function* rootSaga() {
  yield fork(watchAuth);
  yield fork(watchLogout);
  yield fork(watchSearch);
  yield fork(watchCart);
  yield fork(watchDeleteCart);
  yield fork(watchResetCart);
  yield fork(watchDrawer);
  yield fork(watchCoupon);
}
