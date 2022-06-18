import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AreYouSure = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>{
          props.fromService ? <Modal.Title> Are you sure?</Modal.Title>: <Modal.Title>{props.title}</Modal.Title>
        }
        </Modal.Header>
        {props.fromService ? <></>: <Modal.Body>Are you sure?</Modal.Body>}
        <Modal.Footer>
          <Button className="btn bg-dark-blue text-white" onClick={props.onOk}>
            Yes
          </Button>
          <Button variant="secondary" onClick={props.onHide}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AreYouSure;
