import { takeEvery, put } from 'redux-saga/effects';
import * as actions from '../action/saga.js';

function* search(action) {
  const { text, onSuccess, onError } = action.payload;
  try {
    if (onSuccess)
      yield put({
        type: onSuccess,
        payload: { text: text },
      });
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchSearch() {
  yield takeEvery(actions.sagaSearchCallBegan.type, search);
}
