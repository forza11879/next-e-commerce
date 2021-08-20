import { createSlice, createSelector } from '@reduxjs/toolkit';
import * as actions from './action/saga.js';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = false;
// action, actionTypes and reducer
const slice = createSlice({
  name: 'cashondelivery',
  initialState: initialState,
  // reducers
  reducers: {
    cashOnDeliveryApplied: (state, action) => action.payload.cashondelivery,

    // userStoreReseted: (state) => initialState(),
  },

  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     console.log('HYDRATE', state, action.payload);
  //     console.log(
  //       'action.payload.entities.coupon',
  //       action.payload.entities.coupon
  //     );
  //     return {
  //       ...state,
  //       ...action.payload.entities.coupon,
  //     };
  //   },
  // },
});

export const { cashOnDeliveryApplied } = slice.actions;
export default slice.reducer;

// Action creators
export const getCashOnDeliveryApplied = (cashondelivery) =>
  actions.sagaCashOnDeliveryCallBegan({
    cashondelivery: cashondelivery,
    onSuccess: cashOnDeliveryApplied.type,
    onError: actions.sagaCashOnDeliveryCallFailed.type,
  });

// Selectors - Memoized Selector - it does not cause multiple re-renders
const cashOnDeliverySelector = (state) => state.entities.cashondelivery;

export const selectCashOnDelivery = createSelector(
  cashOnDeliverySelector,
  // if the drawer remains the same
  // resolve function will not recalculate again
  (cashondelivery) => cashondelivery
);
