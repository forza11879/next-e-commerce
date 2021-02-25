import { combineReducers } from 'redux';
import entitiesReducer from './entities.js';
// combining multiple reducers
export default combineReducers({
  entities: entitiesReducer,
});
