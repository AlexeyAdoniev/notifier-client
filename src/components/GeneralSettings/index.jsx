import React, { useEffect, useState } from "react";
import { Input, List, Typography, Button, Modal, InputNumber } from "antd";
import { get, post } from "../../apiService";
import { setTokens } from "../../store/userSettings";

import { useSelector, useDispatch } from "react-redux";

const GeneralSettings = ({ service }) => {
  const auth = useSelector((state) => state.userSlice.authData);

  const trackedTokens = useSelector(
    ({ generalSettingsSlice: { trackedTokens } }) => trackedTokens
  );
  const dispatch = useDispatch();

  const [state, setState] = useState({
    pendingDelete: null,
    wallets: [],
    threshold: 1000,
    inputWallet: "",
    inputSearch: "",
    isModalVisible: false,
    filtred: [],
    tokenInput: "",
  });

  const {
    threshold,
    pendingDelete,
    wallets,
    inputWallet,
    isModalVisible,
    inputSearch,
    filtred,
    tokenInput,
  } = state;

  const onClickDelete = (i) => {
    setState({ ...state, pendingDelete: i, isModalVisible: true });
  };

  const addToken = async () => {
    const token = await post("/trackToken", {
      organizationId: auth.organizationId,
      trackData: {
        address: tokenInput,
        network: "test",
        method: "test",
      },
      dispatch,
    });
    dispatch(setTokens([...trackedTokens, token]));
    setState({ ...state, tokenInput: "" });
  };

  const handleDelete = async () => {
    const deletedId = await post("/untrackToken", {
      organizationId: auth.organizationId,
      tokenId: trackedTokens[pendingDelete]._id,
      dispatch,
    });

    if (deletedId)
      dispatch(
        setTokens([
          ...trackedTokens.slice(0, pendingDelete),
          ...trackedTokens.slice(pendingDelete + 1),
        ])
      );

    setState({
      ...state,
      isModalVisible: false,
      pendingDelete: null,
    });
  };

  const cancelDelete = () => {
    setState({ ...state, isModalVisible: false, pendingDelete: null });
  };

  const onSearchChange = (e) => {
    const filterTxt = e.target.value;

    const filtred = wallets.filter((wallet) => wallet.includes(filterTxt));

    setState({ ...state, filtred: filtred, inputSearch: filterTxt });
  };

  useEffect(async () => {
    const res = await get(
      `/getTrackedTokens?organizationId=${auth.organizationId}`,
      dispatch
    );
    console.log(res);
    if (res) dispatch(setTokens(res));
  }, []);

  const changeField = (txt, field) => setState({ ...state, [field]: txt });

  return (
    <div className="GeneralSettins">
      <div className="row">
        {false && (
          <InputNumber
            min={1}
            max={99999}
            defaultValue={10000}
            value={threshold}
            onChange={(val) => setState({ ...state, threshold: val })}
            className="numberInput"
          />
        )}
      </div>

      <div className="row col">
        <div className="walletWrapper">
          <Input
            placeholder="Search Token"
            value={inputSearch}
            onChange={onSearchChange}
            className="walletSearch"
          />
          <div className="listWrapper">
            <List
              size="small"
              className="walletsList"
              bordered
              dataSource={trackedTokens}
              renderItem={(item, i) => (
                <List.Item>
                  <Typography.Text mark></Typography.Text> {item.address}
                  <i
                    className="fas fa-trash-alt"
                    onClick={() => onClickDelete(i)}
                  ></i>
                </List.Item>
              )}
            />
          </div>
          <div className="row">
            <Input
              placeholder="Add New Token"
              className="walletInput"
              value={tokenInput}
              onChange={(e) => changeField(e.target.value, "tokenInput")}
            />
            <Button disabled={!tokenInput && true} onClick={addToken}>
              Track It
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Removing confirmation"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={cancelDelete}
      >
        <p>
          Are you sure you want to stop tracking wallet {wallets[pendingDelete]}
        </p>
      </Modal>
    </div>
  );
};

export default GeneralSettings;
