import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    id_user: '',
    token: '',
    exp: 0,
    role: 0,
    isLogin: false,
  },
};

const authSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    assign: (prevState, action) => {
      const {id, token, profile} = action.payload;
      return {
        ...prevState,
        data: {
          id_user: id,
          token: token,
          isLogin: true,
          ...profile,
        },
      };
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
