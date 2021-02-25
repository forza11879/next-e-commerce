import { combineReducers } from 'redux';
import userReducer from './user.js';
// combining multiple reducers into one entity
export default combineReducers({
  user: userReducer,
});
