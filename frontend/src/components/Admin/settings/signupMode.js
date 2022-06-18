import React, { useEffect, useState } from "react";
import CustomizedSwitches from "./switch";
import { API_URL } from "../../common/CONST";

function SignupMode({ setLoading, signupmode, handlesignupmode }) {

  const handleSubmit = () => {
    handlesignupmode(!signupmode)
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signupmode: !signupmode,

      }),
    };
    fetch(API_URL + "/admin/signupmode", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        getsignupmode();
      })
      .catch((err) => setLoading(false));
  };

  useEffect(() => [getsignupmode()], []);

  const getsignupmode = () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/admin/getsignupmode", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setLoading(false);
          handlesignupmode(response.data[0]['signupmode'] ? response.data[0]['signupmode'] : false)
        }
      })
      .catch((err) => setLoading(false));
  };

  return (
    <div className="d-flex ai-center jc-sb px-lg-3 p-2">
      <div>
        <p className="mb-0">Disable New Sign Up</p>
      </div>
      {/* form-switch */}
      <CustomizedSwitches
        checked={signupmode}
        onChange={() => handleSubmit()}
      />
    </div>
  );
}

export default SignupMode;
