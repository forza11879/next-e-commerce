import { takeEvery, put } from 'redux-saga/effects';
import * as actions from '../action/saga.js';

function* drawer(action) {
  const { visible, onSuccess, onError } = action.payload;
  // console.log({ visible });
  try {
    if (onSuccess) {
      yield put({
        type: onSuccess,
        payload: { visible: visible },
      });
    }
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchDrawer() {
  yield takeEvery(actions.sagaDrawerCallBegan.type, drawer);
}
