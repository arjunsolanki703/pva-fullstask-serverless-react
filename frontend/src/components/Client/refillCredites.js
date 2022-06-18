import React, { useEffect, useRef, useState } from "react";

import { API_URL } from "../common/CONST";
import { useHistory } from "react-router-dom";

function RefillCredits({ setLoading }) {
  const [value, setValue] = useState("3");
  const currency_types = [
    { label: "Bitcoin", value: ["BTC", "bitcoin"] },
    { label: "Litecoin", value: ["LTC", "litecoin"] },
    { label: "Paypal", value: ["PAYPAL", "paypal"] },
  ];
  // if (process.env.REACT_APP_ENV !== "production" || process.env.REACT_APP_ENV !== "development")
  //   currency_types.push({ label: "LTCT", value: ["LTCT", "LTCT"] });

  const [checked, setChecked] = useState(currency_types[0]);

  const history = useHistory();
  const isComponentMounted = useRef(true);

  const refill = () => {
    setLoading(true);
    if(checked.value[0] === "PAYPAL"){
      history.push({
        pathname: "/client/paypal_payment",
        state: {
          data: {amount: value},
        },
      });
    } else{
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: value,
        currency: checked.value[0],
        coinid: checked.value[1],
      }),
    };
    fetch(API_URL + "/payments/AddFunds", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success && isComponentMounted.current) {
          response.data.type = checked.value[0];
          response.data.timeout =
            new Date().getTime() + response.data.timeout * 1000;
          history.push({
            pathname: "/client/refill-credits-success",
            state: {
              data: response.data,
            },
          });
        }
        if (isComponentMounted.current) setLoading(false);
      });
    }
  };

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const thres = 3;
  return (
    <>
      <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 p-3 bg-white border-radius-10">
        <div className="my-3">
          <div className="w-50 mx-auto my-3">
            <div className="form-group">
              <div>Enter Amount in USD</div>
              <input
                className="form-control mt-2 h-5"
                value={value}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setValue("");
                    return;
                  }
                  const regex = /^[0-9]*$/;
                  if (regex.test(value)) {
                    setValue(value);
                  }
                }}
              />
            </div>
            <div className="row">
              {currency_types.map((type, index) => {
                return (
                  <div key={index} className="col-lg-3 col-6 col-md-3">
                    <input
                      type="radio"
                      value={type.value[0]}
                      checked={type.label === checked.label}
                      onChange={() => {
                        setChecked(type);
                        // convert(value, type);
                      }}
                    />
                    {"   "}
                    {type.label}
                  </div>
                );
              })}
            </div>
            {/* <div className="form-group">
              <div>Converted Amount in {checked.label}</div>
              <input
                readOnly={true}
                className="form-control mt-2 h-5"
                value={convertedValue}
              />
            </div> */}
            <div className="form-group">
              <div className="row my-4">
                <div className="col-12">
                  <input
                    type="submit"
                    value="Make Payment"
                    className="btn w-100 bg-dark-blue text-white h-5"
                    disabled={parseFloat(value, 10) >= thres ? false : true}
                    onClick={refill}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="text-center text-danger fw-500 my-lg-5 my-3"
          hidden={parseFloat(value, 10) >= thres ? true : false}
        >
          Please add minimum $3 to proceed.
        </div>
      </div>
    </>
  );
}

export default RefillCredits;
