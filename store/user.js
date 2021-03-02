import { createSlice, createSelector } from '@reduxjs/toolkit';
import * as actions from './action/saga.js';

export const initialState = () => ({
  name: '',
  email: '',
  token: '',
  role: '',
  _id: '',
});
// export const initialState = () => null;
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
// export const getUserLoggedIn = ({ url, method, token }) =>
//   actions.sagaAuthCallBegan({
//     url,
//     method,
//     token,
//     onSuccess: userLoggedIn.type,
//     onError: actions.sagaAuthCallFailed.type,
//   });

export const getUserLoggedIn = ({ name, email, token, role, _id }) =>
  actions.sagaAuthCallBegan({
    name,
    email,
    token,
    role,
    _id,
    onSuccess: userLoggedIn.type,
    onError: actions.sagaAuthCallFailed.type,
  });

export const getUserLoggedOut = () =>
  actions.sagaLogoutCallBegan({
    onSuccess: userStoreReseted.type,
    onError: actions.sagaLogoutCallFailed.type,
  });

//
const userSelector = (state) => state.entities.user;

// Selectors - Memoized Selector - it does not cause multiple re-renders
export const selectUser = createSelector(
  userSelector,
  // if the list of user remains the same
  // resolve function will not recalculate again
  (user) => user
);
