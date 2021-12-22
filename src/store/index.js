import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import userSettingsReducer from "./userSettings";
import transactionsReducer from "./transactionsSlice";
import contactReducer from "./contactSlice";

export const store = configureStore({
  reducer: {
    appSlice: appReducer,
    userSettingsSlice: userSettingsReducer,
    transactionsSlice: transactionsReducer,
    contactSlice: contactReducer,
  },
});
