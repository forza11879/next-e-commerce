import { createSlice, createSelector } from '@reduxjs/toolkit';
import * as actions from './action/saga.js';

export const initialState = false;
// action, actionTypes and reducer
const slice = createSlice({
  name: 'coupon',
  initialState: initialState,
  // reducers
  reducers: {
    couponApplied: (state, action) => action.payload.coupon,

    // userStoreReseted: (state) => initialState(),
  },
});

export const { couponApplied } = slice.actions;
export default slice.reducer;

// Action creators
export const getCouponApplied = (coupon) =>
  actions.sagaCouponCallBegan({
    coupon: coupon,
    onSuccess: couponApplied.type,
    onError: actions.sagaCouponCallFailed.type,
  });
