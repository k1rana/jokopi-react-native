import {combineReducers} from 'redux';

import authSlice from './auth.slice';

const reducers = combineReducers({
  auth: authSlice,
});

export default reducers;
