import { takeEvery, put } from 'redux-saga/effects';
import * as actions from '../action/saga.js';

function* cashOnDelivery(action) {
  const { cashondelivery, onSuccess, onError } = action.payload;
  // console.log({ coupon });
  try {
    if (onSuccess) {
      yield put({
        type: onSuccess,
        payload: { cashondelivery: cashondelivery },
      });
    }
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchCashOnDelivery() {
  yield takeEvery(actions.sagaCashOnDeliveryCallBegan.type, cashOnDelivery);
}
