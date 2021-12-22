import React, { useEffect, useLayoutEffect } from "react";
import {
  getTransactions,
  getOrganizationContacts,
  getNotifications,
} from "../../actions";
import { useTable, useSortBy } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";

const withData = (Wrapped) => {
  return function Wrapper(props) {
    const dispatch = useDispatch();

    const { selectedToken, tokens, fetching, contacts, notifications } =
      useSelector(
        ({
          appSlice: { selectedToken, userTokens },
          transactionsSlice: { fetching },
          contactSlice: { contacts },
          userSettingsSlice: { notifications },
        }) => ({
          selectedToken,
          tokens: userTokens,
          fetching,
          contacts,
          notifications,
        })
      );

    const userId = useSelector(({ appSlice: { authData } }) => authData._id);

    console.log(notifications, "notif");

    useEffect(async () => {
      await getNotifications(dispatch)(userId);
    }, []);

    const data = React.useMemo(() => notifications, [notifications]);

    const columns = React.useMemo(
      () => [
        {
          Header: "Title",
          attrs: {
            className: "notificationsTitle",
          },
          accessor: "name", // accessor is the "key" in the data,
        },
        {
          Header: "Token",
          attrs: {
            className: "notificationsToken",
          },
          accessor: "token.symbol",
        },
        {
          Header: "Mehtods",
          attrs: {
            className: "notificationsMethods",
          },
          accessor: "methods",
          Cell: ({ value: methods }) => {
            return (
              <ul>
                {methods.map((method, i) => (
                  <li key={i + "methodTrans"}>{method}</li>
                ))}
              </ul>
            );
          },
        },
        {
          Header: "Minimun amount",
          attrs: {
            className: "notificationsMin",
          },
          accessor: "minAmountDollar",
        },
        {
          Header: "Maximum amount",
          attrs: {
            className: "notificationsMax",
          },
          accessor: "maxAmountDollar",
        },

        {
          Header: "Emails",
          attrs: {
            className: "notificationsEmails",
          },
          accessor: "emails",
          Cell: ({ value: emails }) => {
            return (
              <ul>
                {emails.map((email, i) => (
                  <li key={i + "emails"}>{email}</li>
                ))}
              </ul>
            );
          },
        },
      ],
      [notifications]
    );

    const tableInstance = useTable({ columns, data }, useSortBy);

    return (
      <Wrapped
        tableInstance={tableInstance}
        selectedToken={selectedToken}
        tokens={tokens}
        fetching={fetching}
      />
    );
  };
};

export default withData;
