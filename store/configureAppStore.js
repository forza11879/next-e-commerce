import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer.js';

import rootSaga from './saga/rootsaga';

const configureAppStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  const middleware = [
    ...getDefaultMiddleware({ thunk: false }),
    ...middlewares,
  ];

  const store = configureStore({
    reducer,
    middleware,
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureAppStore;
