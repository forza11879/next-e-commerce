import { createAction } from '@reduxjs/toolkit';

export const sagaAuthCallBegan = createAction('saga/authCallBegan');
export const sagaAuthCallSuccess = createAction('saga/authCallSuccess');
export const sagaAuthCallFailed = createAction('saga/authCallFailed');

export const sagaLogoutCallBegan = createAction('saga/logoutCallBegan');
export const sagaLogoutCallSuccess = createAction('saga/logoutCallSuccess');
export const sagaLogoutCallFailed = createAction('saga/logoutCallFailed');

export const sagaSearchCallBegan = createAction('saga/searchCallBegan');
export const sagaSearchCallSuccess = createAction('saga/searchCallSuccess');
export const sagaSearchCallFailed = createAction('saga/searchCallFailed');

export const sagaCartCallBegan = createAction('saga/cartCallBegan');
export const sagaCartCallSuccess = createAction('saga/cartCallSuccess');
export const sagaCartCallFailed = createAction('saga/cartCallFailed');
