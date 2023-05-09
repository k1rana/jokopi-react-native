import {combineReducers} from 'redux';

import authSlice from './auth.slice';
import cartSlice from './cart.slice';

const reducers = combineReducers({
  auth: authSlice,
  cart: cartSlice,
});

export default reducers;
