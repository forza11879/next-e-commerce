import axios from 'axios';
import { takeEvery, call, put } from 'redux-saga/effects';
import getConfig from 'next/config';

import * as actions from '../action/saga.js';
const { publicRuntimeConfig } = getConfig();

// const port = process.env.REACT_APP_PORT;
// const hostname = process.env.REACT_APP_LOCALHOST;
const baseURL = publicRuntimeConfig.api;
// console.log('baseURL: ', baseURL);

const fetchApi = async ({ baseURL, url, method, token }) =>
  await axios.request({
    baseURL,
    url,
    method,
    headers: { token },
  });

function* auth(action) {
  const { url, method, token, onSuccess, onError } = action.payload;
  const options = {
    baseURL,
    url,
    method,
    token,
  };
  try {
    const res = yield call(fetchApi, options);
    console.log('response back-end saga: ', res);
    if (onSuccess)
      yield put({
        type: onSuccess,
        payload: {
          name: res.data.name,
          email: res.data.email,
          token: token,
          role: res.data.role,
          _id: res.data._id,
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
