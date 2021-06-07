import { fork } from 'redux-saga/effects';
import { watchAuth, watchLogout } from './user.js';
import { watchSearch } from './search';

export default function* rootSaga() {
  yield fork(watchAuth);
  yield fork(watchLogout);
  yield fork(watchSearch);
}
