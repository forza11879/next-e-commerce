import { createSlice, createSelector } from '@reduxjs/toolkit';
import * as actions from './action/saga.js';

export const initialState = () => ({
  text: '',
});
// export const initialState = () => null;
// action, actionTypes and reducer
const slice = createSlice({
  name: 'search',
  initialState: initialState(),
  // reducers
  reducers: {
    searchQuery: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { searchQuery } = slice.actions;
export default slice.reducer;

// Action creators
export const getSearchQuery = (text) =>
  actions.sagaSearchCallBegan({
    text: text,
    onSuccess: searchQuery.type,
    onError: actions.sagaSearchCallFailed.type,
  });

const searchSelector = (state) => state.entities.search;

// Selectors - Memoized Selector - it does not cause multiple re-renders
export const selectSearch = createSelector(
  searchSelector,
  // if the list of user remains the same
  // resolve function will not recalculate again
  (text) => text
);
