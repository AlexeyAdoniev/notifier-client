import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authData: {},
  userTokens: [],
  selectedToken: 1,
  page: "",
  status: "",
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.authData = action.payload;
    },
    setUserTokens: (state, action) => {
      state.userTokens = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    selectToken: (state, action) => {
      state.selectedToken = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { setAuthData, setUserTokens, setStatus, selectToken, logout } =
  appSlice.actions;

export default appSlice.reducer;
