import React, { useEffect, useLayoutEffect } from "react";
import { getTransactions, getOrganizationContacts } from "../../actions";
import { useTable, useSortBy } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";

const withData = (Wrapped) => {
  return function Wrapper(props) {
    const dispatch = useDispatch();

    const { selectedToken, tokens, transactions, fetching, contacts } =
      useSelector(
        ({
          appSlice: { selectedToken, userTokens },
          transactionsSlice: { fetching },
          contactSlice: { contacts },
        }) => ({
          selectedToken,
          tokens: userTokens,
          fetching,
          contacts,
        })
      );

    useEffect(() => {}, []);

    const data = React.useMemo(() => contacts, [contacts]);

    const columns = React.useMemo(
      () => [
        {
          Header: "Contact Alias",
          attrs: {
            className: "contactAlias",
          },
          accessor: "contactName", // accessor is the "key" in the data,
        },
        {
          Header: "Email",
          attrs: {
            className: "contactEmail",
          },
          accessor: "emails",
          Cell: ({ value: emails }) => {
            return (
              <ul>
                {emails.map((email, i) => (
                  <li key={`emailsContact ${i}`}>{email}</li>
                ))}
              </ul>
            );
          },
        },
        {
          Header: "Wallets",
          attrs: {
            className: "contactWallets",
          },
          accessor: "address",
          Cell: ({ value: addresses }) => {
            return (
              <ul>
                {addresses.map(({ address, _id }) => (
                  <li key={_id}>{address}</li>
                ))}
              </ul>
            );
          },
        },
        {
          Header: "Details",
          attrs: {
            className: "contactDetails",
          },
          accessor: "details",
        },
      ],
      [contacts]
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
