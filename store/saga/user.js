import { takeEvery, put } from 'redux-saga/effects';

import * as actions from '../action/saga.js';

function* auth(action) {
  const { email, token, onSuccess, onError } = action.payload;
  // console.log('action.payload saga: ', action.payload);
  // console.log('email saga: ', email);
  // console.log('token saga: ', token);
  try {
    if (onSuccess)
      yield put({
        type: onSuccess,
        payload: { email: email, token: token },
      });
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchAuth() {
  yield takeEvery(actions.sagaAuthCallBegan.type, auth);
}
