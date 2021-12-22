import React, { useState } from "react";
import { Modal, Button } from "antd";

const withModal = (Wrapped) => (props) => {
  const [modal, setModal] = useState({
    visible: false,
    message: "",
    cb: null,
  });

  const onShowModal = (txt, cb) => {
    setModal({
      visible: true,
      message: txt,
      cb,
    });
  };

  const onModalOk = async () => {
    await modal.cb();
    setModal({
      visible: false,
      message: "",
      cb: null,
    });
  };

  const onModalCancel = () =>
    setModal({
      visible: false,
      message: "",
      cb: null,
    });

  return (
    <>
      <Wrapped {...props} onShowModal={onShowModal} />
      <Modal
        title="Basic Modal"
        visible={modal.visible}
        onOk={onModalOk}
        onCancel={onModalCancel}
      >
        <p>Are you sure you want to {modal.message}?</p>
      </Modal>
    </>
  );
};

export default withModal;
