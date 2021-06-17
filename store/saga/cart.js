import { takeEvery, put } from 'redux-saga/effects';
import * as actions from '../action/saga.js';

function* cart(action) {
  const { product, onSuccess, onError } = action.payload;
  try {
    if (onSuccess)
      yield put({
        type: onSuccess,
        payload: { product: product },
      });
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchCart() {
  yield takeEvery(actions.sagaCartCallBegan.type, cart);
}
