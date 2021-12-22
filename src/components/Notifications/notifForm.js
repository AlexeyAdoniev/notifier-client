import React, { Component, useEffect, useState } from "react";
import { Input, InputNumber, Button, Collapse, Checkbox, Modal } from "antd";

import { useSelector, useDispatch } from "react-redux";
import {
  setTelegramCred,
  setMin,
  setMax,
  setNotificationId,
  setMethods,
  setEmails,
  reset,
  toggleNotifiy,
  setTokenSymbol,
  setNotificationName,
  toggleOver,
} from "../../store/userSettings";

import {
  getNotifications,
  saveNotification,
  deleteNotification,
} from "../../actions";

import { Select } from "antd";

import TokensList from "../Elements/tokenList";
import { validateEmail } from "../../helpers";

import "./notif.scss";

const { Panel } = Collapse;
const { Option } = Select;

const NotificationForm = ({ onCancel }) => {
  const initState = {
    confirm: false,
    cb: null,
    text: "",
  };

  const [state, setState] = useState(initState);

  const dispath = useDispatch();
  const userId = useSelector(({ appSlice: { authData } }) => authData._id);
  const { selectedToken, tokens } = useSelector(
    ({ appSlice: { selectedToken, userTokens } }) => ({
      selectedToken,
      tokens: userTokens,
    })
  );
  const {
    emails,
    methods,
    name,
    minAmountDollar,
    maxAmountDollar,
    telegramCred,
    notificationId,
    notifyAtAny,
    showOver,
    selectedNotif,
  } = useSelector(
    ({
      userSettingsSlice: {
        emails,
        methods,
        name,
        minAmountDollar,
        maxAmountDollar,
        telegramCred,
        notificationId,
        notifyAtAny,
        tokenSymbol,
        showOver,
        selectedNotif,
      },
    }) => ({
      emails,
      methods,
      name,
      minAmountDollar,
      maxAmountDollar,
      telegramCred,
      notificationId,
      notifyAtAny,
      tokenSymbol,
      showOver,
      selectedNotif,
    })
  );

  function handleMultiSelect(value, field) {
    switch (field) {
      case "methods": {
        dispath(setMethods(value));
        break;
      }
      case "emails": {
        if (
          validateEmail(value[emails.length]) ||
          value.length < emails.length
        ) {
          dispath(setEmails(value));
        }
        break;
      }
    }
  }

  const onDeleteNotification = async () => {
    await deleteNotification(dispath)({
      userId,
      notificationId,
    });
    onCancel();
  };

  const onSaveNotification = async () => {
    await saveNotification(dispath)({
      userId,
      tokenId: tokens[selectedToken]._id,
      methods: methods,
      name,
      aboutContacts: notifyAtAny,
      minAmountDollar,
      maxAmountDollar,
      telegram: telegramCred,
      emails,
      notificationId,
    });

    onCancel();
  };

  const theToken = tokens[selectedToken] && tokens[selectedToken].translations;

  useEffect(async () => {
    await getNotifications(dispath)(userId);
  }, []);

  useEffect(() => {
    //dispath(reset());
    if (tokens[selectedToken]) {
      dispath(
        setMethods(
          tokens[selectedToken].translations.map((tr) => tr.translation)
        )
      );
    }
  }, [selectedToken]);

  useEffect(() => {
    if (selectedNotif) {
      dispath(setNotificationName(selectedNotif.name));
      //dispath(toggleNotifiy())
      dispath(setNotificationId(selectedNotif._id));
      dispath(setMin(selectedNotif.minAmountDollar));
      dispath(setMax(selectedNotif.maxAmountDollar));
      dispath(setEmails(selectedNotif.emails));
      dispath(setMethods(selectedNotif.methods));
      dispath(setTelegramCred(selectedNotif.telegram));
    }
  }, [selectedNotif]);

  return (
    <div className="notifForm">
      <Modal
        title={state.text}
        visible={state.confirm}
        onCancel={() => setState(initState)}
        onOk={() => {
          state.cb();
          setState(initState);
        }}
      />
      <div className="row">
        <label htmlFor="">Title</label>
        <Input
          placeholder="Notification title"
          value={name}
          onChange={(e) => dispath(setNotificationName(e.target.value))}
        />
      </div>
      <div className="row">
        <label htmlFor="">Token</label>
        <TokensList tokens={tokens} selectedToken={selectedToken} />
      </div>

      <div className="row">
        <label htmlFor="">Methods</label>
        <Select
          mode="multiple"
          allowClear
          defaultValue={methods}
          value={methods}
          style={{ width: "100%" }}
          onChange={(val) => handleMultiSelect(val, "methods")}
        >
          {theToken &&
            theToken.map((t, i) => (
              <Option
                key={i.toString(36) + i}
                value={t.translation}
                selected="selected"
              >
                {t.translation}
              </Option>
            ))}
        </Select>
      </div>
      <div className="row">
        <Checkbox
          onChange={() => dispath(toggleNotifiy())}
          checked={notifyAtAny}
        >
          Notify about all transactions of your contacts
        </Checkbox>
      </div>
      <div className="row">
        <label htmlFor="">Notify from amount</label>
        <InputNumber
          onChange={(val) => dispath(setMin(val))}
          min={0}
          value={minAmountDollar}
        />
      </div>
      <div className="row">
        <Checkbox onChange={() => dispath(toggleOver())} checked={showOver}>
          Set maximum amount to notify
        </Checkbox>
      </div>
      {showOver && (
        <div className="row">
          <label htmlFor="">Notify under</label>
          <InputNumber
            onChange={(val) => dispath(setMax(val))}
            min={minAmountDollar}
            value={maxAmountDollar}
            disabled={!showOver}
          />
        </div>
      )}
      <div className="row">
        <label htmlFor="">Telegram:</label>
        <div className="col">
          <div className="row">
            <Input
              disabled
              //placeholder="token id"
              value={telegramCred.token}
              onChange={(e) =>
                dispath(
                  setTelegramCred({
                    token: e.target.value,
                  })
                )
              }
            />
          </div>
        </div>
      </div>
      <div className="row">
        <label htmlFor="">Emails</label>
        <Select
          mode="tags"
          value={emails}
          style={{ width: "100%" }}
          placeholder=""
          onChange={(val) => handleMultiSelect(val, "emails")}
        ></Select>
      </div>

      <Button
        type="primary"
        onClick={() =>
          setState({
            confirm: true,
            cb: onSaveNotification,
            text: `Confirm Notification ${notificationId ? "Update" : "Save"}`,
          })
        }
        style={{ marginRight: "10px" }}
      >
        {notificationId ? "Update" : "Save"}
      </Button>
      <Button
        type="ghost"
        onClick={() => dispath(reset())}
        style={{ marginRight: "10px" }}
      >
        Reset
      </Button>
      {notificationId && (
        <Button
          type="danger"
          onClick={() =>
            setState({
              confirm: true,
              cb: onDeleteNotification,
              text: "Confirm Notification Deletion",
            })
          }
        >
          Delete
        </Button>
      )}
    </div>
  );
};

export default NotificationForm;
