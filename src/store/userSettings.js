import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  tokenSymbol: "",
  name: "",
  telegramCred: {
    token: "",
    chatId: "",
  },
  emails: [],
  methods: [],
  notifyAtAny: true,
  minAmountDollar: 0,
  maxAmountDollar: 9999999,
  showOver: false,
  selectedToken: 0,
  notificationId: null,
  selectedNotif: null,
};

export const userSettingsSlice = createSlice({
  name: "userSettingsSlice",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setTokenSymbol: (state, action) => {
      state.tokenSymbol = action.payload;
    },
    setTelegramCred: (state, action) => {
      state.telegramCred.token = action.payload.token;
    },
    setMethods: (state, action) => {
      state.methods = action.payload;
    },
    setMin: (state, action) => {
      state.minAmountDollar = action.payload;
    },
    setMax: (state, action) => {
      state.maxAmountDollar = action.payload;
    },
    toggleOver: (state) => {
      state.showOver = !state.showOver;
      state.maxAmountDollar = state.showOver
        ? initialState.maxAmountDollar
        : state.maxAmountDollar;
    },
    toggleNotifiy: (state) => {
      state.notifyAtAny = !state.notifyAtAny;
    },
    selectToken: (state, action) => {
      state.selectedToken = action.payload;
    },
    setEmails: (state, action) => {
      state.emails = action.payload;
    },
    setNotificationId: (state, action) => {
      state.notificationId = action.payload;
    },
    setNotificationName: (state, action) => {
      state.name = action.payload;
    },
    setSelectedNoif: (state, action) => {
      state.selectedNotif = action.payload;
    },
    reset: (state) => {
      return {
        ...initialState,
        notifications: state.notifications,
      };
    },
  },
});

export const {
  setTokens,
  setNotifications,
  setTelegramCred,
  setMin,
  setMax,
  toggleSending,
  selectToken,
  setMethods,
  setEmails,
  setNotificationId,
  reset,
  toggleNotifiy,
  setTokenSymbol,
  setNotificationName,
  toggleOver,
  setSelectedNoif,
} = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
