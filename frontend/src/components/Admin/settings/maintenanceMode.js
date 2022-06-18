import React, { useState, useEffect, useRef } from "react";
import CustomizedSwitches from "./switch";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { API_URL } from "../../common/CONST";

const MaintenanceMode = ({ setLoading, signupmode }) => {
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;
    setLoading(true);
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
        if (response.success) {
          if (isComponentMounted.current) {
            setIsMaintenance(response.data.maintenance);
            setLoading(false);
          }
        }
      })
      .catch((err) => setLoading(false));

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const onSave = async (mode) => {
    setLoading(true);
    const data = {
      maintenance: mode.toString(),
      message: "off",
      signupmode:signupmode
    };
    if (mode) {
      data.message = msg;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("auth"),
      },
      body: JSON.stringify(data),
    };

    var ret = false;

    await fetch(API_URL + "/admin/maintenancemode", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        ret = response.success;
      })
      .catch((err) => setLoading(false));
    setLoading(false);
    return ret;
  };
  const onHide = () => {
    setShowMsg(false);
    setIsMaintenance(false);
  };

  return (
    <>
      <div className="d-flex ai-center jc-sb px-lg-3 p-2">
        <div>
          <p className="mb-0">Maintenance Mode</p>
        </div>
        {/* form-switch */}
        <CustomizedSwitches
          checked={isMaintenance}
          onChange={async () => {
            const curr = isMaintenance;
            setIsMaintenance(!curr);
            var ret = true;
            if (!curr === true) {
              setShowMsg(true);
            } else {
              ret = await onSave(false);
            }
            if (!ret) {
              setIsMaintenance(curr);
            }
          }}
        />
      </div>
      <Modal
        onHide={onHide}
        show={showMsg && isMaintenance}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Maintenance Mode
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Add Messege</h4>
          <textarea
            className="w-100 form-control"
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
            cols="9"
            rows="4"
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={async () => {
              const ret = await onSave(true);
              if (ret) {
                setShowMsg(false);
              } else {
                setIsMaintenance(false);
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MaintenanceMode;
