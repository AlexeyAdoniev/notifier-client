import React, { PureComponent } from "react";

import { Modal, Input, Button } from "antd";

const ModalForm = ({ fields, title }) => {
  return (
    <div className="modalForm">
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h2>{title}</h2>

        {fields.map((field) => {
          return (
            <div className="row">
              <Input
                placeholder={
                  !validationError
                    ? "Contact Address"
                    : "You have to provide address"
                }
                className={`contactAddressInput ${
                  validationError ? "withError" : ""
                }`}
                value={contactAddressInput}
                onChange={(e) =>
                  dispatch(setContactAddresInput(e.target.value))
                }
              />
            </div>
          );
        })}
      </Modal>
    </div>
  );
};
