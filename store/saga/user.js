import axios from 'axios';
import { takeEvery, call, put } from 'redux-saga/effects';

import * as actions from '../action/saga.js';
const baseURL = process.env.api;

export const fetchApi = async ({ url, method, token }) =>
  await axios.request({
    baseURL,
    url,
    method,
    headers: { token },
  });

export const fetchApiData = async (data = {}, { url, method, token }) =>
  await axios.request({
    baseURL,
    url,
    method,
    data,
    headers: { token },
  });

export const fetchDeleteApiData = async (data = {}, { url, token }) =>
  await axios.delete(url, {
    headers: {
      token,
    },
    data: data,
  });

function* auth(action) {
  const { url, method, token, onSuccess, onError } = action.payload;
  const options = {
    url,
    method,
    token,
  };
  try {
    const { data } = yield call(fetchApi, options);
    // console.log('response back-end saga: ', data);
    const { user } = data;
    if (onSuccess)
      yield put({
        type: onSuccess,
        payload: {
          name: user.name,
          email: user.email,
          token: token,
          role: user.role,
          _id: user._id,
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
  // const options = {
  //   url,
  //   method,
  // };

  try {
    // yield call(fetchApi, options);
    if (onSuccess)
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
