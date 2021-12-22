import React, { useEffect, useState } from "react";

import { Input, Button, Select, Modal } from "antd";
import { validateEmail } from "../../helpers";
import web3 from "web3";
import {
  setOrganizationContact,
  removeOrganizationContact,
} from "../../actions";

import { useSelector, useDispatch } from "react-redux";

import {
  setFiltred,
  setSearchInput,
  setContactAddresInput,
  setContactNameInput,
  setValidationError,
  setSelectedContact,
  setContactId,
  setContactAddressess,
  setEmails,
  setDetails,
  reset,
} from "../../store/contactSlice";
import { on } from "events";

const { TextArea } = Input;

const ContactForm = ({ onCancel }) => {
  const initState = {
    confirm: false,
    cb: null,
    text: "",
  };

  const [state, setState] = useState(initState);

  const dispatch = useDispatch();

  const organizationId = useSelector(
    ({
      appSlice: {
        authData: { organizationId },
      },
    }) => organizationId
  );

  const {
    contacts,
    contactNameInput,
    validationError,
    selectedContact,
    contactId,
    contactAddresses,
    emails,
    details,
  } = useSelector(
    ({
      contactSlice: {
        contacts,
        contactNameInput,
        contactAddressInput,
        validationError,
        selectedContact,
        contactId,
        filtred,
        searchInput,
        contactAddresses,
        emails,
        details,
      },
    }) => ({
      contacts,
      contactNameInput,
      contactAddressInput,
      validationError,
      selectedContact,
      contactId,
      filtred,
      searchInput,
      contactAddresses,
      emails,
      details,
    })
  );

  const onAddContact = async () => {
    const data = {
      organizationId,
      addresses: contactAddresses,
      contactName: contactNameInput,
      emails,
      details,
      contactId,
    };

    await setOrganizationContact(dispatch)(data);
    onCancel();
  };

  const onRemoveContact = async () => {
    const data = {
      organizationId,
      contactId,
    };

    await removeOrganizationContact(dispatch)(data);
    onCancel();
  };

  const handleChange = (arr) => {
    if (
      web3.utils.isAddress(arr[contactAddresses.length]) ||
      arr.length < contactAddresses.length
    )
      dispatch(setContactAddressess(arr));
  };

  const handleEmail = (arr) => {
    if (validateEmail(arr[emails.length]) || arr.length < emails.length)
      dispatch(setEmails(arr));
  };

  useEffect(() => {
    if (selectedContact) {
      dispatch(setEmails(selectedContact.emails));
      dispatch(
        setContactAddressess(selectedContact.address.map((adr) => adr.address))
      );
      dispatch(setContactNameInput(selectedContact.contactName));
      dispatch(setDetails(selectedContact.details));
      dispatch(setContactId(selectedContact._id));
    }
  }, [selectedContact]);

  return (
    <div className="ContactForm">
      <Modal
        title={state.text}
        visible={state.confirm}
        bodyStyle={null}
        onCancel={() => setState(initState)}
        onOk={() => {
          state.cb();
          setState(initState);
        }}
      />
      <div className="row">
        <label htmlFor="">Alias</label>
        <Input
          placeholder="Contant Name"
          className="contactNameInput"
          value={contactNameInput}
          onChange={(e) => dispatch(setContactNameInput(e.target.value))}
        />
      </div>
      <div className="row">
        <label htmlFor="">Email</label>
        <Select
          mode="tags"
          size="medium"
          style={{ width: "100%" }}
          placeholder="Add Emails"
          onChange={handleEmail}
          value={emails}
        ></Select>
      </div>
      <div className="row">
        <label htmlFor="">Additional Info</label>
        <TextArea
          placeholder="..."
          className="textarea"
          value={details}
          onChange={(e) => dispatch(setDetails(e.target.value))}
        />
      </div>
      <div className="row">
        <label htmlFor="">Addresses</label>
        <Select
          mode="tags"
          size="large"
          style={{ width: "100%" }}
          placeholder="Add Address"
          onChange={handleChange}
          value={contactAddresses}
        ></Select>
      </div>
      <div className="row">
        <Button
          type="primary"
          onClick={() =>
            setState({
              confirm: true,
              cb: onAddContact,
              text: "Confirm contact creation",
            })
          }
        >
          Save
        </Button>
        <Button
          type="danger"
          style={{ marginLeft: "14px" }}
          onClick={() =>
            setState({
              confirm: true,
              cb: onRemoveContact,
              text: "Confirm deletion",
            })
          }
        >
          Delete
        </Button>
        <Button type="ghost" style={{ marginLeft: "14px" }} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ContactForm;
