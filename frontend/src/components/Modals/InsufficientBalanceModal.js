import React from "react";
import Modal from "react-bootstrap/Modal";

const InSufficientBalanceModal = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header>
          <Modal.Title>Error Occured</Modal.Title>
        </Modal.Header>

        <Modal.Body>Insufficient Credits</Modal.Body>

        <Modal.Footer>
          <button className="btn btn-secondary" onClick={props.handleClose}>
            Close
          </button>
          <button
            className="btn bg-dark-blue text-white"
            onClick={props.onAddCredits}
          >
            Add Credits
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default InSufficientBalanceModal;
