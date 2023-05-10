import {combineReducers} from 'redux';

import authSlice from './auth.slice';
import cartSlice from './cart.slice';
import priceSlice from './price.slice';

const reducers = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  price: priceSlice,
});

export default reducers;
