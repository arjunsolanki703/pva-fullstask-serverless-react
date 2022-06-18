import React, { useEffect, useRef, useState } from "react";

import { API_URL } from "../common/CONST";
import BoyImg from "../../images/account/boy.svg";
import Header from "./header";
import Loader from "../common/Loader";
import { Redirect } from "react-router";
import eyeOff from "../../images/eyeOff.png";
import eyeOn from "../../images/eyeOn.png";
import info from "../../images/info.png";
import logo from "../../images/logo.svg";

const VerifyAccount = (props) => {
  const isComponentMounted = useRef(true);

  const [code, setCode] = useState("");
  const [passValid, setPassValid] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isConfirmPassOkay, setIsConfirmPassOkay] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const [success, setSuccess] = useState(false);

  const [eye, setEye] = useState(false);
  const [reye, setREye] = useState(false);

  const [loading, setLoading] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    isComponentMounted.current = true;

    setCode(props.match.params.token);

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
          setMaintenance(response.data.maintenance);
          setMsg(response.data.message);
          setLoading(false);
        }
      });

    return () => {
      isComponentMounted.current = false;
    };
  }, [props]);
  const isPass = (value) => {
    if (value === "") return true;
    const regex = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return regex.test(value);
  };
  const onPassChange = (e) => {
    const value = e.target.value;

    setPassValid(isPass(value));
    setPassword(value);

    if (value !== "" && value === confirmPass) {
      setIsConfirmPassOkay(true);
      if (isPass(value)) setCanSubmit(true);
    }
    if (value === "" || value !== confirmPass) {
      if (confirmPass !== "") setIsConfirmPassOkay(false);
      setCanSubmit(false);
    }
  };
  const onConfirmPassChange = (e) => {
    const value = e.target.value;

    setConfirmPass(value);

    if (value !== "" && value === password) {
      setIsConfirmPassOkay(true);
      if (isPass(value)) setCanSubmit(true);
    }
    if (value !== "" && value !== password) {
      setIsConfirmPassOkay(false);
      setCanSubmit(false);
    }
    if (value === "") setIsConfirmPassOkay(true);
  };
  const onSubmit = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        password: password,
      }),
    };
    fetch(API_URL + "/auth/AdminCustomerVerification", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (isComponentMounted.current) setSuccess(response.success);
      });
  };
  if (success) {
    return <Redirect to="/" />;
  }
  return (
    <>
      {loading ? <Loader /> : <></>}
      <div className="row mx-auto ai-center sec bg-light-blue">
        <div className="col-lg-6 col-md-12 col-12 hide-on-med-and-down">
          <div className="text-center w-75 mx-auto">
            <img src={BoyImg} alt="verify-account" />
          </div>
        </div>
        <div className="col-lg-6 col-md-12 col-12 sec bg-white d-flex ai-center py-5">
          <div className="w-60 mx-auto">
            <img className="logo" src={logo} alt="logo" />
            {maintenance === false ? (
              <>
                <h1 className="f-28 fw-400 text-secondary">Set Password</h1>

                <div className="form-wrapper mt-4">
                  <div className="form-group mt-4">
                    <label htmlFor="password">Password</label>
                    <div className="input-group">
                      <input
                        className={
                          "form-control col-12 " + (passValid ? "" : "invalid")
                        }
                        type={eye ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={onPassChange}
                      />
                      {eye ? (
                        <img
                          className="input-eye"
                          src={eyeOn}
                          alt="off"
                          onClick={() => {
                            setEye(!eye);
                          }}
                        />
                      ) : (
                        <img
                          className="input-eye"
                          src={eyeOff}
                          alt="on"
                          onClick={() => {
                            setEye(!eye);
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        visibility: passValid ? "hidden" : "",
                      }}
                    >
                      <img
                        src={info}
                        alt="info"
                        width="15px"
                        height="15px"
                        style={{ margin: "3px" }}
                      />
                      <div
                        style={{
                          color: "red",
                          fontSize: "10px",
                          paddingRight: "5px",
                        }}
                      >
                        Password length must be 8 characters, including 1
                        UpperCase, 1 Number, 1 Special Character.
                      </div>
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="password">Confirm Password</label>

                    <div className="input-group">
                      <input
                        className={
                          "form-control col-12 " +
                          (!isConfirmPassOkay ? "invalid" : "")
                        }
                        type={reye ? "text" : "password"}
                        name="password"
                        value={confirmPass}
                        onChange={onConfirmPassChange}
                      />
                      {reye ? (
                        <img
                          className="input-eye"
                          src={eyeOn}
                          alt="off"
                          onClick={() => {
                            setREye(!reye);
                          }}
                        />
                      ) : (
                        <img
                          className="input-eye"
                          src={eyeOff}
                          alt="on"
                          onClick={() => {
                            setREye(!reye);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="form-group mt-4">
                    <button
                      className="btn bg-dark-blue text-white w-100"
                      onClick={onSubmit}
                      disabled={canSubmit ? false : true}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
             ) : (
              <>
                <Header />
                <div className="text-white bg-dark-blue w-100 mode text-center mb-3 mt-4">
                  Maintenance Mode is On!
                </div>
                <div className="w-100 msg-mode">{msg}</div>
              </>
            )} 
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyAccount;
