import {
  setAuthData,
  setUserTokens,
  setStatus,
  logout,
} from "./store/appSlice";
import { setNotifications, reset } from "./store/userSettings";
import { setTransactions, startFetching } from "./store/transactionsSlice";
import { setContacts } from "./store/contactSlice";

import { get, post, tokenInfoApi } from "./apiService";

const signOut = (dispatch) => {
  localStorage.removeItem("authCred");
  return dispatch(logout());
};

const checkCred = (dispatch) => {
  const cred = localStorage.getItem("authCred");
  if (cred) {
    const credObj = JSON.parse(cred);
    console.log(credObj);
    dispatch(setAuthData(credObj));
  }
};

const saveCredentials = (dispatch) => (data) => {
  localStorage.setItem("authCred", JSON.stringify(data));

  dispatch(setAuthData(data));
};

const getTokens = (dispatch) => async (organizationId) => {
  try {
    const tokens = await get(
      `/getTrackedTokens?organizationId=${organizationId}`
    );
    if (tokens) {
      for (let i = 0; i < tokens.length; i++) {
        const details = await fetch(tokenInfoApi + tokens[i].address);
        const { data } = await details.json();
        tokens[i].symbol = data?.symbol || "token_name";
      }

      dispatch(setUserTokens(tokens));
    }
  } catch (e) {
    dispatch(setStatus(e.message));
  }
};

const getNotifications = (dispatch) => async (userId) => {
  try {
    const notifs = await get(`/getNotifications?userId=${userId}`);
    console.log(notifs);
    if (notifs) {
      dispatch(setNotifications(notifs));
    }
  } catch (e) {
    console.log(e);
  }
};

const saveNotification = (dispatch) => async (body) => {
  try {
    const res = await post(`/setNotification`, body, dispatch);
    if (res) {
      await getNotifications(dispatch)(body.userId);
    }
  } catch (e) {
    console.log(e);
  }
};

const deleteNotification = (dispatch) => async (body) => {
  try {
    const res = await post(`/deleteNotification`, body, dispatch);
    if (res) {
      dispatch(reset());
      await getNotifications(dispatch)(body.userId);
    }
  } catch (e) {
    console.log(e);
  }
};

const getTransactions = (dispatch) => async (tokenId) => {
  try {
    dispatch(startFetching());

    const res = await get(
      `/getTokenTransactions?tokenId=${tokenId}&last=${Date.now()}`
    );

    if (res) {
      dispatch(setTransactions(res));
    }
  } catch (e) {
    console.log(e);
  }
};

const getOrganizationContacts = (dispatch) => async (organizationId) => {
  try {
    const res = await get(
      `/getOrganizationContacts?organizationId=${organizationId}`
    );
    console.log(res);
    if (res) {
      dispatch(setContacts(res));
    }
  } catch (e) {
    alert(e);
  }
};

const setOrganizationContact = (dispatch) => async (data) => {
  try {
    const res = await post(`/setOrganizationContacts`, data);

    if (res) {
      await getOrganizationContacts(dispatch)(data.organizationId);
    }
  } catch (e) {
    alert(e);
  }
};

const removeOrganizationContact = (dispatch) => async (data) => {
  console.log(data);
  try {
    const res = await post(`/deleteOrganizationContacts`, data);
    console.log(res);

    if (res) {
      await getOrganizationContacts(dispatch)(data.organizationId);
    }
  } catch (e) {
    alert(e);
  }
};

export {
  saveCredentials,
  checkCred,
  getTokens,
  getNotifications,
  saveNotification,
  deleteNotification,
  getTransactions,
  getOrganizationContacts,
  setOrganizationContact,
  removeOrganizationContact,
  signOut,
};
