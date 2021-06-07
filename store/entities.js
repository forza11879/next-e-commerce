import { combineReducers } from 'redux';
import userReducer from './user.js';
import searchReducer from './search.js';
// combining multiple reducers into one entity
export default combineReducers({
  user: userReducer,
  search: searchReducer,
});
