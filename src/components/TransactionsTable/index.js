import React from "react";

import TokensList from "../Elements/tokenList";
import { Table } from "../Elements/table";
import withData from "./withDataHoc";

import "./transactionsTable.scss";

const TransactionsTable = ({
  tokens,
  tableInstance,
  selectedToken,
  fetching,
}) => {
  return (
    <div className="transactionsTable content-part">
      <h2>Transactions Timeline</h2>

      <div className="row">
        <TokensList tokens={tokens} selectedToken={selectedToken} />
      </div>
      <Table tableInstance={tableInstance} fetching={fetching} />
    </div>
  );
};

export default withData(TransactionsTable);

/** <button
          onClick={async () => {
            const num = Date.parse(rows[rows.length - 1].values.createdAt);
            const res = await fetch(
              `http://localhost:3100/getTokenTransactions?tokenId=61b8993aecb9d37ca8f619a9&last=${num}`
            );
            console.log(await res.json());
            // console.log(new Date(rows[rows.length - 1].values.createdAt))
          }}
        ></button> */
