import React, { useState } from "react";

import { Table } from "../Elements/table";
import withData from "./withDataHoc";
import { Button, Modal } from "antd";
import { reset, setSelectedNoif } from "../../store/userSettings";
//import { setSelectedContact, reset } from "../../store/contactSlice";
import { getNotifications } from "../../actions";
import NotificationForm from "./notifForm";
import ContactForm from "../Contacts/ContactForm";
import { useSelector, useDispatch } from "react-redux";

import "./notif.scss";

const ContactsTable = ({ tableInstance, fetching }) => {
  const [state, setState] = useState({
    modalVisible: false,
  });

  const dispatch = useDispatch();

  const cancelModal = () => {
    dispatch(reset());
    setState({ ...state, modalVisible: false });
  };

  return (
    <div className="content-part notifTable">
      <h2>Notifications</h2>
      <div className="row">
        <Button
          type="ghost"
          onClick={() => {
            dispatch(reset());
            setState({ ...state, modalVisible: true });
          }}
        >
          Add Notifications
        </Button>
      </div>

      <Table
        tableInstance={tableInstance}
        fetching={fetching}
        onRowClick={({ original }) => {
          setState({ ...state, modalVisible: true });
          console.log(original);
          return dispatch(setSelectedNoif(original));
        }}
      />

      <Modal
        footer={null}
        title="Notification From"
        visible={state.modalVisible}
        onCancel={cancelModal}
      >
        <NotificationForm onCancel={cancelModal} />
      </Modal>
    </div>
  );
};

export default withData(ContactsTable);
