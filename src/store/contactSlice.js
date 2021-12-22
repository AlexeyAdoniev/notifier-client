import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
  filtred: [],
  searchInput: "",
  contactId: null,
  contactNameInput: "",
  contactAddressInput: "",
  contactAddresses: [],
  emails: [],
  details: "",
  selectedContact: null,
  validationError: false,
};

export const contactSlice = createSlice({
  name: "contactSlice",
  initialState,
  reducers: {
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    setFiltred: (state, action) => {
      state.filtred = action.payload;
    },
    setSearchInput: (state, action) => {
      state.searchInput = action.payload;
    },
    setSelectedContact: (state, action) => {
      console.log(action);
      state.selectedContact = action.payload;
    },
    setContactNameInput: (state, action) => {
      state.contactNameInput = action.payload;
    },
    setContactAddresInput: (state, action) => {
      state.contactAddressInput = action.payload;
      state.validationError = false;
    },
    setValidationError: (state) => {
      state.validationError = true;
    },
    setContactId: (state, action) => {
      state.contactId = action.payload;
    },

    setContactAddressess: (state, action) => {
      state.contactAddresses = action.payload;
    },

    setEmails: (state, action) => {
      state.emails = action.payload;
    },

    setDetails: (state, action) => {
      state.details = action.payload;
    },

    reset: (state) => {
      return {
        ...initialState,
        contacts: state.contacts,
      };
    },
  },
});

export const {
  setContacts,
  setFiltred,
  setSearchInput,
  setSelectedContact,
  setContactNameInput,
  setContactAddresInput,
  setValidationError,
  setContactId,
  setContactAddressess,
  setEmails,
  setDetails,
  reset,
} = contactSlice.actions;

export default contactSlice.reducer;
