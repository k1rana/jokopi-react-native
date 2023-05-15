import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    id_user: '',
    token: '',
    exp: 0,
    role: 0,
    isLogin: false,
  },
  logoutOpen: false,
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
    reset: () => {
      return {...initialState};
    },
    toggleModal: prevState => {
      return {
        ...prevState,
        logoutOpen: !prevState.logoutOpen,
      };
    },
    openModal: prevState => {
      return {
        ...prevState,
        logoutOpen: true,
      };
    },
    closeModal: prevState => {
      return {
        ...prevState,
        logoutOpen: false,
      };
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
