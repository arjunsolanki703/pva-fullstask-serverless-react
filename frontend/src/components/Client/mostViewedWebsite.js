import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { API_URL } from "../common/CONST";
import InSufficientBalanceModal from "../Modals/InsufficientBalanceModal";
import moment from "moment";
const defaultLocationSelected = {
  name: "Select Location...(Optional)",
  short_name: "",
};
function MostViewedWebsite(props) {
  const [addCredits, setAddCredits] = useState(false);
  const [locationselected, setLocationSelected] = useState({
    name: "Select A Location",
    short_name: "",
  });
  const [isInSufficientBalance, setIsInsufficientBalance] = useState(false);

  const history = useHistory();

  const createService = (selected) => {
    props.setLoading(true);
    var endTime = moment(localStorage.getItem(`endTime_${selected.id}`))
    var checkTime = moment(new Date())
    var serviceId = localStorage.getItem(`serviceId_${selected.id}`)
    const data = {};
    const serviceIds = [selected.id];
    data.serviceIds = serviceIds;
    data.is_ltr = selected.is_ltr;

    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    if (checkTime < endTime && serviceId === selected.id && !selected.is_ltr) {
      alert(`You're blocked for ${Math.round(moment.duration(endTime).asMinutes() - moment.duration(checkTime).asMinutes())} minutes, please come back later.`)
      props.setLoading(false);
    } else if (checkTime > endTime && serviceId === selected.id && !selected.is_ltr) {
      localStorage.removeItem(`endTime_${selected.id}`);
      localStorage.removeItem(`serviceId_${selected.id}`);
      localStorage.removeItem("isBlocked");
      fetch(API_URL + "/autoservices/service/create", requestOptions)
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            getNumber(response.data._id, locationselected);
          } else {
            if (response.messageCode === "INSUFFICIENT_BALANCE") {
              setIsInsufficientBalance(true);
            }
            props.setLoading(false);
          }
        });
    } else {
      fetch(API_URL + "/autoservices/service/checkAlreadyExist", requestOptions)
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            fetch(API_URL + "/autoservices/service/create", requestOptions)
              .then((response) => response.json())
              .then((response) => {
                if (response.success) {
                  getNumber(response.data._id, locationselected);
                } else {
                  if (response.messageCode === "INSUFFICIENT_BALANCE") {
                    setIsInsufficientBalance(true);
                  }
                  props.setLoading(false);
                }
              });
          } else {
            if (response.messageCode === "USER_BLOCKED_FOR_1_HOUR") {
              localStorage.setItem("isBlocked", response.data.isBlocked)
              localStorage.setItem(`serviceId_${response.data.serviceId}`, response.data.serviceId)
              localStorage.setItem(`endTime_${response.data.serviceId}`, moment(new Date()).add(60, 'minute'))
              alert("You're blocked for 60 minutes, please come back later.")
              props.setLoading(false);
            }
          }
        });
    }
  };
  const getNumber = (reqId, locationsdata) => {
    props.setLoading(true);
    const API = API_URL + `/autoservices/service/${reqId}`;
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(locationsdata)
    };
    fetch(API, requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        if (response.success) {
          history.push({
            pathname: "/client/request/" + reqId
          });
        } else {
          if (response.messageCode === "INSUFFICIENT_BALANCE") {
            setIsInsufficientBalance(true);
          }
          alert(response.data)
        }
        props.setLoading(false);
      });
  };
  if (addCredits) {
    return <Redirect to="/client/refill-credits" />;
  }
  return (
    <>
      <div className="mostViewed mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-4 py-4 bg-white border-radius-10 box-shadow-gray">
        <h4 className="f-20 fw-600">Most Used Website</h4>
        <div className="my-3">
          <div className="text-center f-20 fw-600 text-deep-blue">
            Click To Request
          </div>
        </div>
        <div className="row text-center">
          {props.websites &&
            props.websites.filter((website, index) => !website.is_ltr).map((website, index) => (
              <div
                className="col-lg-4 col-md-4 col-12 mt-lg-4 mt-3 text-center"
                key={index}
              >
                <div
                  className="most-used-website text-primary f-400"
                  style={
                    website.enable === false ||
                      (website.is_ltr === false && website.available === "0") ||
                      (website.is_ltr === true && website.ltr_available === "0")
                      ? { cursor: "default", backgroundColor: "#ebebeb" }
                      : {}
                  }
                  onClick={(e) => {
                    if (
                      website.enable === false ||
                      (website.is_ltr === false && website.available === "0") ||
                      (website.is_ltr === true && website.ltr_available === "0")
                    ) {
                    } else {
                      createService(website);
                    }
                  }}
                >
                  {/* {website.name} {website.custom_name} ({website.is_ltr ? "LTR" : "STR"}) $ */}
                  {website.custom_name ? website.custom_name : website.name} ({website.is_ltr ? "LTR" : "STR"}) $
                  {website.is_ltr ? website.ltr_price : website.credit}
                </div>
              </div>
            ))}
        </div>
      </div>
      <InSufficientBalanceModal
        show={isInSufficientBalance}
        handleClose={() => setIsInsufficientBalance(false)}
        onAddCredits={() => setAddCredits(true)}
      />
    </>
  );
}

export default MostViewedWebsite;
