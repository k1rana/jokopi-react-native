import {combineReducers} from 'redux';

import authSlice from './auth.slice';
import cartSlice from './cart.slice';
import priceSlice from './price.slice';
import profileSlice from './profile.slice';

const reducers = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  price: priceSlice,
  profile: profileSlice,
});

export default reducers;
