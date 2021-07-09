import { combineReducers } from 'redux';
import userReducer from './user';
import searchReducer from './search';
import cartReducer from './cart';
import drawerReducer from './drawer';
import couponReducer from './coupon';
// combining multiple reducers into one entity
export default combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: drawerReducer,
  coupon: couponReducer,
});
