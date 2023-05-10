import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  list: [],
  payment_id: '',
  delivery_id: '',
  delivery_address: '',
  notes: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addtoCart: (prevState, action) => {
      const exsistIdx = prevState.list.findIndex(
        item =>
          item.id === action.payload.id &&
          item.size_id === action.payload.size_id,
      );

      const updatedItem = {
        ...action.payload,
        qty:
          exsistIdx !== -1
            ? prevState.list[exsistIdx].qty + action.payload.qty
            : action.payload.qty,
        subtotal:
          exsistIdx !== -1
            ? prevState.list[exsistIdx].subtotal + action.payload.subtotal
            : action.payload.subtotal,
      };

      const updatedCart =
        exsistIdx !== -1
          ? [
              ...prevState.list.slice(0, exsistIdx),
              updatedItem,
              ...prevState.list.slice(exsistIdx + 1),
            ]
          : [...prevState.list, updatedItem];

      return {
        ...prevState,
        list: updatedCart,
      };
    },
    incrementQty: (prevState, action) => {
      return {
        ...prevState,
        list: prevState.list.map(item => {
          if (
            item.id === action.payload.id &&
            item.size_id === action.payload.size_id
          ) {
            return {
              ...item,
              qty: item.qty + 1,
              subtotal: item.subtotal + item.price,
            };
          }
          return item;
        }),
      };
    },
    decrementQty: (prevState, action) => {
      return {
        ...prevState,
        list: prevState.list.map(item => {
          if (
            item.id === action.payload.id &&
            item.size_id === action.payload.size_id
          ) {
            if (item.qty === 1) {
              return item;
            }
            return {
              ...item,
              qty: item.qty - 1,
              subtotal: item.subtotal + item.price,
            };
          }
          return item;
        }),
      };
    },
    removeFromCart: (prevState, action) => {
      return {
        ...prevState,
        list: prevState.list.filter(item => {
          return !(
            item.id === action.payload.id &&
            item.size_id === action.payload.size_id
          );
        }),
      };
    },
    resetCart: (prevState, action) => {
      return {...prevState, ...initialState};
    },
    setDelivery: (prevState, action) => {
      return {
        ...prevState,
        delivery_id: action.payload.delivery_id,
        delivery_address: action.payload.delivery_address,
        notes: action.payload.delivery_address,
      };
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
