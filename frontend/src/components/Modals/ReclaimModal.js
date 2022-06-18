import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const LogoutModal = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.msg}</Modal.Body>
        <Modal.Footer>
          <Button className="btn bg-dark-blue text-white" onClick={props.onOk}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogoutModal;
