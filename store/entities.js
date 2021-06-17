import { combineReducers } from 'redux';
import userReducer from './user';
import searchReducer from './search';
import cartReducer from './cart';
// combining multiple reducers into one entity
export default combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
});
