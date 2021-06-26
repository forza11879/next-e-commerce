import { takeEvery, put } from 'redux-saga/effects';
import * as actions from '../action/saga.js';

function update(product, color, count) {
  let cart = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    const duplicate = cart.find((item) => item._id === product._id);

    if (!duplicate) {
      cart.push({
        ...product,
        count: 1,
      });
    } else {
      cart = cart.map((item) =>
        item._id === product._id && color
          ? { ...item, color: color }
          : item._id === product._id && count
          ? { ...item, count: Number(count) }
          : item._id === product._id
          ? { ...item, count: item.count + 1 }
          : item
      );
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  return cart;
}

function remove(product) {
  let cart = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }

    cart = cart.filter((item) => item._id !== product._id);

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  return cart;
}

function* cart(action) {
  const { product, color, count, onSuccess, onError } = action.payload;
  console.log({ color });
  console.log({ count });

  const cart = yield update(product, color, count);

  try {
    if (onSuccess) {
      yield put({
        type: onSuccess,
        payload: { cart: cart },
      });
    }
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchCart() {
  yield takeEvery(actions.sagaCartCallBegan.type, cart);
}

function* deleteCart(action) {
  const { product, onSuccess, onError } = action.payload;

  const cart = yield remove(product);

  try {
    if (onSuccess) {
      yield put({
        type: onSuccess,
        payload: { cart: cart },
      });
    }
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchDeleteCart() {
  yield takeEvery(actions.sagaDeleteCartCallBegan.type, deleteCart);
}
