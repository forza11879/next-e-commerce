import { createSlice, createSelector } from '@reduxjs/toolkit';
import * as actions from './action/saga.js';

export const initialState = false;

// export const initialState = () => null;
// action, actionTypes and reducer
const slice = createSlice({
  name: 'drawer',
  initialState: initialState,
  // reducers
  reducers: {
    drawerSetVisible: (state, action) => action.payload.visible,
    // drawerReseted: (state) => initialState(),
  },
});

export const { drawerSetVisible } = slice.actions;
export default slice.reducer;

// Action creators
export const getSetVisibleDrawer = (visible) =>
  actions.sagaDrawerCallBegan({
    visible: visible,
    onSuccess: drawerSetVisible.type,
    onError: actions.sagaDrawerCallFailed.type,
  });

// Selectors - Memoized Selector - it does not cause multiple re-renders
const drawerSelector = (state) => state.entities.drawer;

export const selectDrawer = createSelector(
  drawerSelector,
  // if thedrawer remains the same
  // resolve function will not recalculate again
  (drawer) => drawer
);
