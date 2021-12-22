import React, { useEffect } from "react";
import {
  Routes as Switch,
  Route,
  Redirect,
  useNavigate,
} from "react-router-dom";
import { get } from "../../apiService";
import "./main.scss";

import TransactionsTable from "../TransactionsTable";
import ContactsTable from "../ContactsTable";
import Navigation from "../Navigation";
import Notification from "../Notifications";

import ContactForm from "../Contacts/ContactForm";
import { useSelector, useDispatch } from "react-redux";
import { getTokens, getOrganizationContacts } from "../../actions";

const Main = () => {
  const organizationId = useSelector(
    ({
      appSlice: {
        authData: { organizationId },
      },
    }) => organizationId
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const page = useSelector(({ appSlice: { page } }) => page);

  useEffect(async () => {
    await getTokens(dispatch)(organizationId);
    await getOrganizationContacts(dispatch)(organizationId);
  }, []);

  useEffect(() => {
    if (organizationId) {
      navigate("transactions");
    }
  }, [organizationId]);

  return (
    <div className="Main">
      <Navigation />
      <Switch>
        <Route path="/notifications" element={<Notification />} />
        <Route path="/transactions" exact element={<TransactionsTable />} />
        <Route path="/contacts" exact element={<ContactsTable />} />
      </Switch>
    </div>
  );
};

export default Main;
