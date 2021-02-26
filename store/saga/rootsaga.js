import { fork } from 'redux-saga/effects';
import { watchAuth, watchLogout } from './user.js';

export default function* rootSaga() {
  yield fork(watchAuth);
  yield fork(watchLogout);
}
