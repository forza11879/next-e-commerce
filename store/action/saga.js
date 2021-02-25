import { createAction } from '@reduxjs/toolkit';

export const sagaAuthCallBegan = createAction('saga/authCallBegan');
export const sagaAuthCallSuccess = createAction('saga/authCallSuccess');
export const sagaAuthCallFailed = createAction('saga/authCallFailed');
