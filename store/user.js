import { createSlice, createSelector } from '@reduxjs/toolkit';
import { sagaAuthCallBegan, sagaAuthCallFailed } from './action/saga.js';

export const initialState = () => ({
  email: '',
  token: '',
});

// action, actionTypes and reducer
const slice = createSlice({
  name: 'user',
  initialState: initialState(),
  // reducers
  reducers: {
    userLoggedIn: (state, action) => {
      Object.assign(state, action.payload);
    },

    userStoreReseted: (state) => initialState(),
  },
});

export const { userLoggedIn, userStoreReseted } = slice.actions;
export default slice.reducer;

// Action creators
export const getUserLoggedIn = ({ email, token }) =>
  sagaAuthCallBegan({
    email,
    token,
    onSuccess: userLoggedIn.type,
    onError: sagaAuthCallFailed.type,
  });
