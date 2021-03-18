import axios from 'axios';
import { takeEvery, call, put } from 'redux-saga/effects';
import getConfig from 'next/config';

import * as actions from '../action/saga.js';
const { publicRuntimeConfig } = getConfig();
const baseURL = publicRuntimeConfig.api;
// const url = '/user/create-or-update';
const url = '/user';
const method = 'post';

const fetchApi = async (token) =>
  await axios.request({
    baseURL,
    url,
    method,
    headers: { token },
  });

function* auth(action) {
  const { token, onSuccess, onError } = action.payload;
  try {
    const { data } = yield call(fetchApi, token);
    // console.log('response back-end saga: ', res);
    if (onSuccess)
      yield put({
        type: onSuccess,
        payload: {
          name: data.name,
          email: data.email,
          token: token,
          role: data.role,
          _id: data._id,
        },
      });
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchAuth() {
  yield takeEvery(actions.sagaAuthCallBegan.type, auth);
}

function* logout(action) {
  const { onSuccess, onError } = action.payload;
  try {
    yield put({
      type: onSuccess,
      payload: null,
    });
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchLogout() {
  yield takeEvery(actions.sagaLogoutCallBegan.type, logout);
}
