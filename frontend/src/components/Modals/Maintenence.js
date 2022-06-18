import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { API_URL } from "../common/CONST";

const Maintenance = (props) => {
  const [show, setShow] = useState(false);
  const [logout, setLogout] = useState(false);
  const [msg, setMsg] = useState("");

  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;

    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/admin/getmaintenancemode", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (isComponentMounted.current) {
          setShow(response.data.maintenance);
          setMsg(response.data.message);
        }
      });

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  // const handleClose = () => setShow(false);
  return (
    <>
      <Modal show={show} onHide={() => {}} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Maintenance Mode is On</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              localStorage.setItem("auth", "");
              localStorage.setItem("role", "");
              localStorage.setItem("name", "");
              localStorage.setItem("credit", "");
              setLogout(true);
            }}
          >
            Log Out
          </Button>
        </Modal.Footer>
      </Modal>
      {logout && <Redirect to="/" />}
    </>
  );
};

export default Maintenance;
