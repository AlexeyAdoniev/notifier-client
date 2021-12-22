import { store } from "./store/index";
import { saveCredentials } from "./actions";

const _base = "https://token-notifier-staging.herokuapp.com";

export const tokenInfoApi = "https://api.pancakeswap.info/api/v2/tokens/";

const _headers = {
  Accept: "*",
  "Content-Type": "application/json",
};

export const get = async (route, dispatch) => {
  const state = store.getState();

  const {
    appSlice: { authData },
  } = state;

  try {
    const res = await fetch(_base + route, {
      mode: "cors",
      headers: {
        ..._headers,
        authorization: `Bearer ${authData.token}`,
      },
    });
    if (res.ok) {
      const { result } = await res.json();

      if (result === "invalid token") {
        const resfeshed = await fetch(
          `${_base}/refresh?token=${authData.refreshToken}`,
          { headers: _headers }
        );

        const obj = await resfeshed.json();

        console.log(obj);

        saveCredentials(dispatch)(obj.result);

        return await get(route, dispatch);
      }

      return result;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const post = async (route, body, dispatch) => {
  const state = store.getState();

  const {
    appSlice: { authData },
  } = state;
  try {
    const res = await fetch(_base + route, {
      method: "POST",
      headers: {
        ..._headers,
        authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify(body),
    });
    const { ok, result } = await res.json();
    if (ok) {
      if (result === "invalid token") {
        const resfeshed = await fetch(
          `${_base}/refresh?token=${authData.refreshToken}`,
          { headers: _headers }
        );

        const obj = await resfeshed.json();

        console.log(obj);

        saveCredentials(dispatch)(obj.result);

        return await post(route, body, dispatch);
      }

      return result;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
