import { fork } from 'redux-saga/effects';
import { watchAuth } from './user.js';

export default function* rootSaga() {
  yield fork(watchAuth);
}
