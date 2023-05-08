import {createSlice} from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    message: 'Initial message',
  },
  reducers: {
    setMessage: (prevState, action) => {
      return {
        ...prevState,
        message: action.payload,
      };
    },
  },
});

export const authActions = messageSlice.actions;
export default messageSlice.reducer;
