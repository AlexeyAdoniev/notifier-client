import React, { useState } from "react";

import { Table } from "../Elements/table";
import withData from "./withDataHoc";
import { Button, Modal } from "antd";
import { setSelectedContact, reset } from "../../store/contactSlice";

import ContactForm from "../Contacts/ContactForm";
import { useSelector, useDispatch } from "react-redux";

import "./contactsTable.scss";

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
    <div className="content-part contactsTable">
      <h2>Contacts</h2>
      <div className="row">
        <Button
          type="ghost"
          onClick={() => {
            dispatch(reset());
            setState({ ...state, modalVisible: true });
          }}
        >
          Add Contact
        </Button>
      </div>

      <Table
        tableInstance={tableInstance}
        fetching={fetching}
        onRowClick={({ original }) => {
          setState({ ...state, modalVisible: true });
          return dispatch(setSelectedContact(original));
        }}
      />

      <Modal
        footer={null}
        title="Contact From"
        visible={state.modalVisible}
        onCancel={cancelModal}
      >
        <ContactForm onCancel={cancelModal} />
      </Modal>
    </div>
  );
};

export default withData(ContactsTable);

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
