import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import isAuthorized from "../common/Auth";
import Maintenance from "../Modals/Maintenence";
import Navbar from "../common/navbar";
import TimeLeft from "../common/timeLeft";
import { API_URL } from "../common/CONST";

function RefillcreditesContainer(props) {
  const data = props.location.state.data;

  /*
  address: "3GpvEpivZmQLLNdsZ6FDKacZjdUasw5KaE"
  ​​​​​
  amount: "0.00012954"
  ​​​​​
  checkout_url: "https://www.coinpayments.net/index.php?cmd=checkout&id=CPFG5WPMVWQ3SKXC5R6P6AXC3U&key=dd25d0de03c5451316c2c16da2cb6911"
  ​​​​​
  confirms_needed: "2"
  ​​​​​
  qrcode_url: "https://www.coinpayments.net/qrgen.php?id=CPFG5WPMVWQ3SKXC5R6P6AXC3U&key=dd25d0de03c5451316c2c16da2cb6911"
  ​​​​​
  status_url: "https://www.coinpayments.net/index.php?cmd=status&id=CPFG5WPMVWQ3SKXC5R6P6AXC3U&key=dd25d0de03c5451316c2c16da2cb6911"
  ​​​​​
  timeout: 12600
  ​​​​​
  txn_id: "CPFG5WPMVWQ3SKXC5R6P6AXC3U"
*/
  const [redirect, setRedirect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    const pooling = setInterval(() => {
      const requestOptions = {
        method: "POST",
        headers: {
          accept: "*/*",
          Authorization: localStorage.getItem("auth"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
        }),
      };
      fetch(API_URL + "/payments/getpaymentstatus", requestOptions)
        .then((response) => response.json())
        .then((response) => {
          if (
            response.data === "Complete" ||
            response.data === "Cancelled / Timed Out"
          ) {
            setRedirect(true);
          }
        });
    }, 10 * 1000);
    return () => {
      clearInterval(pooling);
    };
  }, []);

  if (redirect) {
    return <Redirect to="/" />;
  }
  if (isAuthorized()) {
    return (
      <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
        <Navbar
          setSidebar={props.setSidebar}
          sidebar={props.sidebar}
          currentPage="Refill Credits"
        />
        <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 p-3 bg-white border-radius-10">
          <h2 className="col-12 text-center">
            <b>Payment Information</b>
          </h2>

          <p>
            Transaction ID{": "}
            <b>{data.txn_id}</b>
          </p>

          <div>
            <img src={data.qrcode_url} alt="QR Code" />
          </div>

          <TimeLeft setIsFinishedFunc={setIsFinished} isFinished={isFinished} destination={data.timeout} show={"HMS"} color={"black"} />

          <p>
            Total Amount To Send{": "}
            <b>
              {data.amount} {data.type}
            </b>{" "}
          </p>

          <p>
            Send To Address{": "}
            <b>{data.address}</b>
          </p>

          <div>
            <a
              className="btn bg-dark-blue text-white col-6 col-lg-3"
              href={data.status_url}
              alt="QR Code"
              target="_blank"
              rel="noreferrer"
            >
              Check Status
            </a>
          </div>

          <div className="mt-3">
            <p>
              <b>Note : </b>
              The amount will be credited to your account itself within 10-120
              minutes.
              <br /> <br />
              If it takes longer than that to credit, email us at
              support@serverlessadeals.com
              <br /> Subject: Pending Refill Credits
              <br /> Message: Registered Email id, the exact amount of
              cryptocurrency sent, Transaction ID.
            </p>
          </div>
        </div>
        <Maintenance />
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default RefillcreditesContainer;
