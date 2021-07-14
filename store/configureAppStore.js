import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer.js';
// import { createWrapper } from 'next-redux-wrapper';
// import auth from './middleware/auth.js';

import rootSaga from './saga/rootsaga';

const configureAppStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];
  // const middlewares = [auth];

  const middleware = [
    ...getDefaultMiddleware({ thunk: false }),
    ...middlewares,
  ];

  const store = configureStore({
    reducer,
    middleware,
    devTools: true,
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureAppStore;
// export const wrapper = createWrapper(configureAppStore);
