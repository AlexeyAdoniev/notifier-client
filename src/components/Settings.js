import {
  Button,
  InputNumber,
  Breadcrumb,
  List,
  Typography,
  Input,
  Modal,
} from "antd";
import { useState } from "react";

import { wallets as arr } from "../constants";

import { withSettingsEffects } from "../hocs/withSettingsEffects";

import { useSelector, useDispatch } from "react-redux";

import { setWallets, setMoney } from "../store/appSlice";

function Settings({}) {
  //const dispatch = useDispatch();

  //const wallets = useSelector((state) => state.wallets);
  //const thresholdMoney = useSelector((state) => state.thresholdMoney);

  const [state, setState] = useState({
    pendingDelete: null,
    wallets: arr,
    threshold: 1000,
    inputWallet: "",
    inputSearch: "",
    isModalVisible: false,
    filtred: [],
  });

  const {
    threshold,
    pendingDelete,
    wallets,
    inputWallet,
    isModalVisible,
    inputSearch,
    filtred,
  } = state;

  const onClickDeleteWallet = (i) => {
    setState({ ...state, pendingDelete: i, isModalVisible: true });
  };

  const onInputWallet = (txt) => {
    console.log(txt);
    setState({ ...state, inputWallet: txt.target.value });
  };

  const handleDelete = () => {
    /* setSettings(
      setWallets({
        wallets: [
          ...wallets.slice(0, pendingDelete),
          ...wallets.slice(pendingDelete + 1),
        ],
      })
    );*/

    setState({
      ...state,
      isModalVisible: false,
      pendingDelete: null,
    });
  };

  const cancelDelete = () => {
    setState({ ...state, isModalVisible: false, pendingDelete: null });
  };

  const addWallet = () =>
    setState({ ...state, wallets: [...wallets, inputWallet] });

  const onSearchChange = (e) => {
    const filterTxt = e.target.value;

    const filtred = wallets.filter((wallet) => wallet.includes(filterTxt));

    setState({ ...state, filtred: filtred, inputSearch: filterTxt });
  };

  return (
    <div className="settingsWrapper">
      <div className="row">
        <label htmlFor="">Money Threshold ($)</label>
        <InputNumber
          min={1}
          max={99999}
          defaultValue={10000}
          value={threshold}
          onChange={(val) => setState({ ...state, threshold: val })}
          className="numberInput"
        />
      </div>

      <div className="row col">
        <div className="walletWrapper">
          <Input
            placeholder="Search Wallet"
            value={inputSearch}
            onChange={onSearchChange}
            className="walletSearch"
          />
          <div className="listWrapper">
            <List
              size="small"
              className="walletsList"
              bordered
              dataSource={inputSearch ? filtred : wallets}
              renderItem={(item, i) => (
                <List.Item>
                  <Typography.Text mark></Typography.Text> {item}
                  <i
                    className="fas fa-trash-alt"
                    onClick={() => onClickDeleteWallet(i)}
                  ></i>
                </List.Item>
              )}
            />
          </div>
          <div className="row">
            <Input
              placeholder="Add New Wallet"
              className="walletInput"
              value={inputWallet}
              onChange={onInputWallet}
            />
            <Button disabled={!inputWallet && true} onClick={addWallet}>
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
}

export default withSettingsEffects(Settings);
