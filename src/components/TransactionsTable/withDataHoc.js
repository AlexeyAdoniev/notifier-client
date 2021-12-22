import React, { useEffect } from "react";
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
          transactionsSlice: { transactions, fetching },
          contactSlice: { contacts },
        }) => ({
          selectedToken,
          tokens: userTokens,
          transactions,
          fetching,
          contacts,
        })
      );

    console.log(contacts, "ctxt");

    useEffect(() => {
      tokens[selectedToken] &&
        getTransactions(dispatch)(tokens[selectedToken]._id);
    }, [tokens, selectedToken]);

    const data = React.useMemo(() => transactions, [transactions]);

    const columns = React.useMemo(
      () => [
        {
          Header: "Transaction ID",
          attrs: {
            className: "tableHash",
          },
          headerClassName: "sticky",
          accessor: "hash", // accessor is the "key" in the data,
          Cell: ({ value }) => (
            <a href={`https://bscscan.com/tx/${value}`} target="_blank">
              {value}
            </a>
          ),
        },
        {
          Header: "Method",
          attrs: {
            className: "tableMethod",
          },
          accessor: "method",
          Cell: ({ row: { original } }) => {
            let tr = original.method;
            for (let i = 0; i < original.translations.length; i++) {
              if (
                original.translations[i].methodNames.includes(original.method)
              ) {
                tr = original.translations[i].translation;
              }
            }

            return tr;
          },
        },
        {
          Header: "From",
          attrs: {
            className: "tableFrom",
          },
          accessor: "address.address",
          Cell: ({ value }) => (
            <a href={`https://bscscan.com/address/${value}`} target="_blank">
              {contacts.find((contact) =>
                contact.address.find(
                  (addressItem) =>
                    addressItem.address.toLowerCase() === value.toLowerCase()
                )
              )?.contactName || value}
            </a>
          ),
        },
        {
          Header: "To",
          attrs: {
            className: "tableTo",
          },
          accessor: "to",
          Cell: ({ value }) => (
            <a href={`https://bscscan.com/address/${value}`} target="_blank">
              {contacts.find((contact) =>
                contact.address.find(
                  (addressItem) =>
                    addressItem.address.toLowerCase() === value.toLowerCase()
                )
              )?.contactName || value}
            </a>
          ),
        },
        {
          Header: "Amount",
          attrs: {
            className: "tableAmount",
          },
          accessor: "dollarAmount",
        },
        {
          Header: "Price",
          attrs: {
            className: "tablePrice",
          },
          accessor: "exchangeRate",
        },
        {
          Header: "Date",
          attrs: {
            className: "tableDate",
          },
          accessor: "createdAt",
          Cell: ({ value }) => {
            return format(new Date(value), "dd/MM/yyyy - HH:mm:ss");
          },
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
