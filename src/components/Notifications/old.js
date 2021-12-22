import React, { Component, useEffect } from "react";
import { Input, InputNumber, Button, Collapse, Checkbox } from "antd";

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
import { selectToken } from "../../store/appSlice";
import {
  getNotifications,
  saveNotification,
  deleteNotification,
} from "../../actions";
import { CaretRightOutlined } from "@ant-design/icons";
import { Select } from "antd";

import withModal from "../../hocs/withModal";

import TokensList from "../Elements/tokenList";
import { validateEmail } from "../../helpers";

import "./notif.scss";

const { Panel } = Collapse;
const { Option } = Select;

const toShow = ["method", "minAmountDollar", "token"];

const Notifications = ({ onShowModal }) => {
  const dispath = useDispatch();
  const userId = useSelector(({ appSlice: { authData } }) => authData._id);
  const { selectedToken, tokens } = useSelector(
    ({ appSlice: { selectedToken, userTokens } }) => ({
      selectedToken,
      tokens: userTokens,
    })
  );
  const {
    notifications,
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
  } = useSelector(
    ({
      userSettingsSlice: {
        notifications,
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
      },
    }) => ({
      notifications,
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

  const onDeleteNotification = () => {
    deleteNotification(dispath)({
      userId,
      notificationId,
    });
  };

  const onSaveNotification = () => {
    saveNotification(dispath)({
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
  };

  const selectToEdit = (notificationId, idx) => {
    console.log(idx);
    const {
      minAmountDollar,
      maxAmountDollar,
      emails,
      methods,
      telegram,
      token: { address },
      name,
    } = notifications[idx];

    console.log(notifications[idx]);

    dispath(setNotificationName(name));
    //dispath(toggleNotifiy())
    dispath(setNotificationId(notificationId));
    dispath(setMin(minAmountDollar));
    dispath(setMax(maxAmountDollar));
    dispath(setEmails(emails));
    dispath(setMethods(methods));
    dispath(setTelegramCred(telegram));
    dispath(
      setTokenSymbol(tokens.find((token) => token.address === address).symbol)
    );
  };

  const theToken = tokens[selectedToken] && tokens[selectedToken].translations;

  useEffect(async () => {
    await getNotifications(dispath)(userId);
  }, []);

  useEffect(() => {
    dispath(reset());
    if (tokens[selectedToken]) {
      dispath(
        setMethods(
          tokens[selectedToken].translations.map((tr) => tr.translation)
        )
      );
      dispath(setTokenSymbol(tokens[selectedToken].symbol));
    }
  }, [selectedToken]);

  return (
    <div className="Notifications content-part">
      <h2>Transactions Notifications Settings</h2>
      <div className="row">
        <div className="notificationsWrapper">
          <b>Currnet Notifications: </b>
          {Array.isArray(notifications) &&
            notifications.map((notif, i) => {
              return (
                <Collapse
                  key={notif._id}
                  bordered={false}
                  defaultActiveKey={null}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  className="site-collapse-custom-collapse"
                >
                  <Panel
                    header={notif.name}
                    key={i}
                    className="site-collapse-custom-panel"
                  >
                    {Object.keys(notif)
                      .filter((p) => toShow.includes(p))
                      .map((prop, j) => {
                        console.log(notif);
                        return (
                          <div key={prop + j} className="row">
                            <span className="propsCol">{prop}</span>
                            <span>
                              {prop === "token"
                                ? notif[prop].symbol
                                : notif[prop]}
                            </span>
                          </div>
                        );
                      })}
                    <span
                      className="editBtn"
                      onClick={() => selectToEdit(notif._id, i)}
                    >
                      edit
                    </span>
                  </Panel>
                </Collapse>
              );
            })}
        </div>
      </div>

      <div className="notifForm">
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
            Notify about contacts transactions
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
                placeholder="token id"
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
            onShowModal(
              `${notificationId ? "Update" : "Save"} this notification`,
              onSaveNotification
            )
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
              onShowModal(` Delete this notification`, onDeleteNotification)
            }
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default withModal(Notifications);
