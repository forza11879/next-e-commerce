import { takeEvery, put } from 'redux-saga/effects';
import * as actions from '../action/saga.js';

function* cart(action) {
  const { product, onSuccess, onError } = action.payload;
  let cart = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    // push new product to cart
    const duplicate = cart.find(
      (item) => item._id === product._id
      // && item.color === product.color
    );
    if (!duplicate) {
      cart.push({
        ...product,
        count: 1,
      });
    } else {
      cart = cart.map((item) =>
        item._id === product._id ? { ...item, count: item.count + 1 } : item
      );
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  try {
    if (onSuccess)
      yield put({
        type: onSuccess,
        payload: { cart: cart },
      });
  } catch (error) {
    if (onError) yield put({ type: onError, payload: error.message });
  }
}

export function* watchCart() {
  yield takeEvery(actions.sagaCartCallBegan.type, cart);
}
