import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
  fetching: false,
};

export const transactionsSlice = createSlice({
  name: "transactionsSlice",
  initialState,
  reducers: {
    startFetching: (state) => {
      state.fetching = true;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.fetching = false;
    },
  },
});

export const { setTransactions, startFetching } = transactionsSlice.actions;

export default transactionsSlice.reducer;
