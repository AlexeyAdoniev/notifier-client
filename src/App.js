import "./App.css";

//import Settings from "./Settings";
import Auth from "./components/Auth";
import Main from "./components/Main";
import { useNavigate } from "react-router-dom";

import { checkCred } from "./actions";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    checkCred(dispatch);
  }, []);

  const auth = useSelector((state) => state.appSlice.authData);

  console.log(auth);

  return <div className="App">{auth.name ? <Main /> : <Auth />}</div>;
}

export default App;
