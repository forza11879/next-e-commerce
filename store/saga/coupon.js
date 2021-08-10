import { takeEvery, put } from 'redux-saga/effects';
import * as actions from '../action/saga.js';

function* coupon(action) {
  const { coupon, onSuccess, onError } = action.payload;
  // console.log({ coupon });
  try {
    if (onSuccess) {
      yield put({
        type: onSuccess,
        payload: { coupon: coupon },
      });
    }
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchCoupon() {
  yield takeEvery(actions.sagaCouponCallBegan.type, coupon);
}
