import { createSlice, createSelector } from '@reduxjs/toolkit';
import { sagaAuthCallBegan, sagaAuthCallFailed } from './action/saga.js';

export const initialState = () => ({
  user: { email: '', token: '' },
});

// action, actionTypes and reducer
const slice = createSlice({
  name: 'user',
  initialState: initialState(),
  // reducers
  reducers: {
    userLoggedIn: (state, action) => {
      console.log('action.payload userLoggedIn: ', action.payload);
      console.log('state userLoggedIn: ', state);
      const { entities, result } = action.payload;
      Object.assign(state.user, entities.user);
    },

    userStoreReseted: (state) => initialState(),
  },
});

export const { userLoggedIn, userStoreReseted } = slice.actions;
export default slice.reducer;

// Action creators
export const getUserLoggedIn = ({ email, token }) => {
  console.log('email getUserLoggedIn: ', email);
  console.log('token getUserLoggedIn: ', token);
  sagaAuthCallBegan({
    email: email,
    token: token,
    onSuccess: userLoggedIn.type,
    onError: sagaAuthCallFailed.type,
  });
};
