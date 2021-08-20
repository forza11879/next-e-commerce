import { createSlice, createSelector } from '@reduxjs/toolkit';
import * as actions from './action/saga.js';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = false;
// action, actionTypes and reducer
const slice = createSlice({
  name: 'coupon',
  initialState: initialState,
  // reducers
  reducers: {
    couponApplied: (state, action) => action.payload.coupon,
    couponStoreReseted: (state) => false,
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

export const { couponApplied, couponStoreReseted } = slice.actions;
export default slice.reducer;

// Action creators
export const getCouponApplied = (coupon) =>
  actions.sagaCouponCallBegan({
    coupon: coupon,
    onSuccess: couponApplied.type,
    onError: actions.sagaCouponCallFailed.type,
  });

// Selectors - Memoized Selector - it does not cause multiple re-renders
const couponSelector = (state) => state.entities.coupon;

export const selectCoupon = createSelector(
  couponSelector,
  // if thedrawer remains the same
  // resolve function will not recalculate again
  (coupon) => coupon
);
