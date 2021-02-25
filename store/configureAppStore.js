import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
// import createSagaMiddleware from 'redux-saga';
import reducer from './reducer.js';
import auth from './middleware/auth.js';

// import rootSaga from './saga/rootsaga';

const configureAppStore = () => {
  // const sagaMiddleware = createSagaMiddleware();

  // const middlewares = [sagaMiddleware];
  const middlewares = [auth];

  const middleware = [...getDefaultMiddleware({ thunk: true }), ...middlewares];

  const store = configureStore({
    reducer,
    middleware,
  });

  // sagaMiddleware.run(rootSaga);

  return store;
};

export default configureAppStore;
