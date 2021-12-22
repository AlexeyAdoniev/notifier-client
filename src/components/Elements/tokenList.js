import React, { Component, useEffect } from "react";
import { List, Typography, Button } from "antd";
import { useDispatch } from "react-redux";

import { selectToken } from "../../store/appSlice";
import { spawn } from "child_process";

const TokensList = ({ tokens, selectedToken }) => {
  const dispath = useDispatch();

  return (
    <div className="TokensList">
      <div className="tokensWrapper">
        <h3>Organization Tokens:</h3>
        <List
          size="small"
          className="tokensList"
          bordered
          dataSource={tokens}
          renderItem={(item, i) => (
            <>
              <List.Item onClick={() => dispath(selectToken(i))}>
                <Typography.Text mark> {item.symbol}</Typography.Text>
                {selectedToken === i && (
                  <i className="fas fa-check floating_btn"></i>
                )}
              </List.Item>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default TokensList;
