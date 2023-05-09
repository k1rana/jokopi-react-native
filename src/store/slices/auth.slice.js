import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    id_user: '',
    token: '',
  },
};

const authSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    assign: (prevState, action) => {
      const {id, token} = action.payload;
      return {
        ...prevState,
        data: {
          id_user: id,
          token: token,
        },
      };
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
