import { createSlice, createSelector } from '@reduxjs/toolkit';
import * as actions from './action/saga.js';

export let initialState = [];

// load cart items from local storage
if (typeof window !== 'undefined') {
  if (localStorage.getItem('cart')) {
    initialState = JSON.parse(localStorage.getItem('cart'));
  } else {
    initialState = [];
  }
}

// export const initialState = () => null;
// action, actionTypes and reducer
const slice = createSlice({
  name: 'cart',
  initialState: initialState,
  // reducers
  reducers: {
    cartAdded: (state, action) => {
      Object.assign(state, action.payload.cart);
    },

    // cartStoreReseted: (state) => Object.assign(state, []),
  },
});

export const { cartAdded } = slice.actions;
export default slice.reducer;

// Action creators
export const getAddProduct = (product) =>
  actions.sagaCartCallBegan({
    product: product,
    onSuccess: cartAdded.type,
    onError: actions.sagaCartCallFailed.type,
  });

// Selectors - Memoized Selector - it does not cause multiple re-renders
const cartSelector = (state) => state.entities.cart;

export const selectCart = createSelector(
  cartSelector,
  // if the list of user remains the same
  // resolve function will not recalculate again
  (cart) => cart
);
