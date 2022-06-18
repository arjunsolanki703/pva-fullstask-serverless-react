import { API_URL, convertToEDT } from "../common/CONST";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import AreYouSure from "../Modals/AreYouSure";
import CopyToClipboard from "./copyToClipboard";
import CustomizedSwitches from "../Admin/settings/switch";
import InsufficientBalanceModal from "../Modals/InsufficientBalanceModal";
import PhoneImg from "../../images/phone.png";
import TimeLeft from "./timeLeft";
import moment from "moment";
import { location } from "../Client/locations";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

const defaultLocationSelected = {
  name: "Select Location...(Optional)",
  short_name: "",
};
function ServiceNumber({ service, setRefresh, setLoading, sms_recive,update_creditdetail }) {
  const history = useHistory();
  const [_, setUpdate] = useState({});
  const isComponentMounted = useRef(true);
  const [close, setClose] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  // const [isLtrAutoRenew, setIsLtrAutoRenew] = useState(false);
  const [locationselected, setLocationSelected] = useState({
    name: "Select A Location",
    short_name: "",
  });
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [addCredits, setAddCredits] = useState(false);

  const getFormatted = useCallback((number) => {
    if (!number) return "";
    let formatted = "";
    formatted += "(" + number.substr(1, 3) + ") ";
    formatted += number.substr(4, 3) + "-";
    formatted += number.substr(7, 4);
    return formatted;
  }, []);

  const deleteService = async (request_id, name) => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestID: request_id,
        is_flag: true,
      }),
    };
    await fetch(API_URL + `/users/expirenumber`, requestOptions)
      .then((response) => {
        if (isComponentMounted.current) {
          setClose(true);
          setLoading(false);
        }
      })
      .catch((err) => setLoading(false));
  };

  const createService = (id, state) => {
    setLoading(true);
    const serviceIds = [id];
    if (state === "") {
      setLocationSelected(defaultLocationSelected)
    } else {
      const selectedState = location.filter((o) => o.short_name === service.credit.services[0].state)
      setLocationSelected(selectedState[0])
    }
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceIds: serviceIds,
        is_ltr: service.is_ltr,
      }),
    };
    var endTime = moment(localStorage.getItem(`endTime_${id}`))
    var checkTime = moment(new Date())
    var serviceId = localStorage.getItem(`serviceId_${id}`)
    if (checkTime < endTime && serviceId === id && !service.is_ltr) {
      alert(`You're blocked for ${Math.round(moment.duration(endTime).asMinutes() - moment.duration(checkTime).asMinutes())} minutes, please come back later.`)
      setLoading(false);
    } else if (checkTime > endTime && serviceId === id && !service.is_ltr) {
      localStorage.removeItem(`endTime_${id}`);
      localStorage.removeItem(`serviceId_${id}`);
      localStorage.removeItem("isBlocked");
      fetch(API_URL + "/autoservices/service/create", requestOptions)
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            getNumber(response.data._id, locationselected);
          } else {
            setIsInsufficientBalance(true);
            setLoading(false);
          }
        })
        .catch((err) => setLoading(false));
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
                  setIsInsufficientBalance(true);
                  setLoading(false);
                }
              })
              .catch((err) => setLoading(false));
          }
          else {
            if (response.messageCode === "USER_BLOCKED_FOR_1_HOUR") {
              localStorage.setItem("isBlocked", response.data.isBlocked)
              localStorage.setItem(`serviceId_${response.data.serviceId}`, response.data.serviceId)
              localStorage.setItem(`endTime_${response.data.serviceId}`, moment(new Date()).add(60, 'minute'))
              alert("You're blocked for 60 minutes, please come back later.")
              setLoading(false);
            }
          }
        });
    }
  };

  const getNumber = (reqId, locationsdata) => {
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
        setLoading(false);
        if (response.success) {
          update_creditdetail();
          history.push({
            pathname: "/client/request/" + reqId
          });
        } else {
          alert(response.data)
        }
      })
      .catch((err) => setLoading(false));
  };

  const autoRenew = async (ltr_autorenew, requestId, mdn) => {
    setUpdate(true);
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        autoRenew: !ltr_autorenew,
        requestId: requestId,
        mdn: mdn.toString(),
      }),
    };
    await fetch(API_URL + "/autoservices/service/LTRAutoReNew", requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        if (response.success) {
          // refreshing data
          setRefresh({});
          setLoading(false);
        } else {
          if (response.messageCode === "INSUFFICIENT_BALANCE") {
            setIsInsufficientBalance(true);
          }
          if (!response.success) {
            alert("Unable to change Extend Month status")
          }
          setLoading(false);
        }
      })
      .catch((err) => setLoading(false));
    setUpdate(false);
  };

  const LTRnumberActivate = async (mdn, requestId) => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mdn: mdn.toString(),
        requestId: requestId
      }),
    };
    await fetch(API_URL + `/autoservices/LTRnumberActivate`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          alert(response.data);
        }
        setRefresh({})
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const LTRnumberStatusCheck = async (mdn, requestId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mdn: mdn.toString(),
        requestId: requestId
      }),
    };
    await fetch(API_URL + `/autoservices/LTRnumberStatusCheck`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        window.location.reload()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setUpdate({});
  }, [service]);

  useEffect(() => {
    if (isFinished) {
      LTRnumberStatusCheck(service.number, service._id);
    }
  }, [isFinished])

  if (close) {
    return <Redirect to="/" />;
  }
  if (addCredits) {
    return <Redirect to="/client/refill-credits" />;
  }

  return (
    <>
      <div className="bg-white border-radius-10 box-shadow-gray mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 px-3 py-lg-5 py-4 ">
        <div className="d-flex jc-center">
          <div className="d-flex jc-center w-50 mx-lg-auto mx-md-auto mx-0">
            <div
              className="d-flex  ai-center bg-light-blue-one px-lg-5 px-md-5 pl-3 py-3 h-6 w-100 border-radius-6"
              style={{ justifyContent: "center" }}
            >
              <img
                alt=""
                src={PhoneImg}
                className="ml-lg-3 ml-md-3 ml-0 mr-lg-5 mr-md-5 mr-4"
              />
              <div className="mb-0  ml-lg-5 ml-md-5 mr-lg-5 mr-md-5 mr-3 f-16 text-bright-blue text-nowrap fw-600">
                {getFormatted(service.number?.toString())}
              </div>
            </div>
            <div className="ml-lg-3 ml-md-3 ml-2">
              <CopyToClipboard data={service.number?.toString().slice(1)} />
            </div>
          </div>
        </div>
        <div>
          <div className="text-center mt-lg-5 mt-md-4 mt-3">
            <div>
              {service.endtime && !service.is_ltr
                ?
                <TimeLeft setIsFinishedFunc={setIsFinished} isFinished={isFinished} destination={new Date(service.endtime)} show={"MS"} />
                :
                (service.is_ltr ? (
                  <>
                    {service.LTRNumberStatus === "offline" && Math.floor(moment(service.LTRActiveTimeDate) - moment()) > 0 ?
                      (<p className="text-muted font-weight-bolder">Number Active In: <TimeLeft setIsFinishedFunc={setIsFinished} isFinished={isFinished} is_ltr={service.is_ltr} destination={new Date(service.LTRActiveTimeDate)} show={"MS"} /></p>)
                      :
                      (service.LTRNumberStatus === "online" && Math.floor(moment(service.LTRActiveTimeDate) - moment()) > 0 ?
                        (<p className="text-success font-weight-bolder">Number Active For: <TimeLeft setIsFinishedFunc={setIsFinished} isFinished={isFinished} is_ltr={service.is_ltr} destination={new Date(service.LTRActiveTimeDate)} show={"MS"} /></p>) :
                        (<p className="text-danger font-weight-bolder">Please Activate Number </p>))}
                  </>
                ) : <> Loading...</>)
              }
            </div>

            {service.is_ltr ? (
              <div className="d-flex jc-center ai-center">
                <div className="text-left align-center">
                  <div>
                    Start: {service.createdAt ? convertToEDT(new Date(service.createdAt)) : "Loading..."}
                    <br />
                    End:&nbsp;&nbsp;&nbsp;{service.endtime ? convertToEDT(new Date(service.endtime)) : "Loading..."}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className="row w-50 mx-auto mt-lg-5 mt-md-5 mt-3">
              {service.is_ltr === false ? (
                <div
                  className="col-lg-6 col-lg-6 col-12 px-0 pr-lg-2"
                >
                  <button
                    className="btn w-100 h-5 pl-3 btn-light-blue text-dark-blue fw-500"
                    onClick={(e) => {
                      const service_id = service.credit.services[0].service_id;
                      const state = service.credit.services[0].state;
                      createService(service_id, state);
                    }}
                  >
                    Generate Next Number
                  </button>
                </div>
              ) : (
                <></>
              )}
              {service.is_ltr === false ? (
                // service.credit.services.length === 1 ? (
                //   (!sms_recive ?
                <div className="col-lg-6 col-lg-6 col-12 px-0 mb-lg-0 mb-md-3 mb-3 mT-10">
                  <button
                    className="btn w-100 h-5 pr-3 btn-light-blue text-dark-blue fw-500"
                    onClick={(e) =>
                      deleteService(service._id, service.credit.services[0].name)
                    }
                    disabled={sms_recive || service.credit.services.length > 1}
                  >
                    Flag Number
                  </button>
                </div>
                //     : <></>)
                // ) : (
                //   <></>
                // )
              ) : (
                <>
                  {service.ltr_autorenew === undefined ?
                    <></> :
                    <>
                      {/* <div
                      className="btn h-5 text-center text-dark-blue btn-light-blue col-lg-4 "
                      style={{
                        width: "90%",
                        display: "flex",
                        // flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Extend Month &nbsp;
                      <BootstrapSwitchButton
                        checked={service.ltr_autorenew} size="xs"
                        onstyle="success" offstyle="danger"
                        onChange={(checked) => {
                          setShowModal(true);
                        }} />

                    </div> */}
                      <div className="col-lg-4" style={{ padding: "3px" }}>
                        <button
                          className="btn w-100 fw-500 h-5 btn-light-blue text-dark-blue"
                          style={{ float: "left", cursor: "default", fontSize: "14px" }}
                          onChange={(checked) => {
                            setShowModal(true);
                          }}
                        >
                          Extend Month 25% OFF &nbsp;
                          <BootstrapSwitchButton
                            checked={service.ltr_autorenew} size="xs"
                            onstyle="success" offstyle="danger"
                            onChange={(checked) => {
                              setShowModal(true);
                            }} />
                        </button>
                      </div>
                      <div className="col-lg-4" style={{ padding: "3px" }}>
                        <button
                          className="btn w-100 fw-500 h-5 text-white "
                          style={{ backgroundColor: " #143066" }}
                          onClick={(e) =>
                            LTRnumberActivate(service.number, service._id)
                          }
                        >
                          {service.LTRNumberStatus === "online" && Math.floor(moment(service.LTRActiveTimeDate) - moment()) > 0 ? "Add More Minutes" : "Activate Number"}
                        </button>
                      </div>
                      <div className="col-lg-4" style={{ padding: "3px" }}>
                        <button
                          className="btn w-100 fw-500 h-5 btn-light-blue text-dark-blue"
                          style={{ float: "left" }}
                          onClick={(e) =>
                            deleteService(service._id, service.credit.services[0].name)
                          }
                          disabled={sms_recive || service.credit.services.length > 1}
                        >
                          Flag Number
                        </button>
                      </div>
                    </>
                  }
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AreYouSure
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        onOk={async () => {
          autoRenew(service.ltr_autorenew, service._id, service.number);
          setShowModal(false);
        }}
        title="AutoRenew"
        fromService={true}
      />
      <InsufficientBalanceModal
        show={isInsufficientBalance}
        handleClose={() => setIsInsufficientBalance(false)}
        onAddCredits={() => setAddCredits(true)}
      />
    </>
  );
}

export default ServiceNumber;
