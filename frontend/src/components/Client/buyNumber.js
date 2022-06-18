// BuyNumber.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { API_URL } from "../common/CONST";
import InSufficientBalanceModal from "../Modals/InsufficientBalanceModal";
import Select from "react-select";
import moment from "moment";
import { location } from "./locations";

const defaultSelected = {
  name: "Select Website",
  value: 0,
  credit: 0,
  ltr_price: 0,
  enable: true,
  available: 0,
  ltr_available: 0,
};
const defaultLocationSelected = {
  name: "Select Location (optional)",
  value:"",
  short_name: "",
};
var webOptions = [];
const requestOptions = {
  method: "GET",
  headers: {
    accept: "*/*",
  },
};
fetch(
  API_URL + "/tellabot-services/get/all?page=1&limit=1000&order=true",
  requestOptions
)
  .then((response) => response.json())
  .then((response) => {

    const data_array = response.data.data;
    for (var ind in data_array) {
      const data = data_array[ind];
      webOptions.push({
        is_ltr: data.is_ltr,
        name: data.name,
        custom_name: data.custom_name,
        credit: data.credit,
        ltr_price: data.ltr_price,
        value: data._id,
        enable: data.enable,
        available: data.available,
        ltr_available: data.ltr_available,
        enable_ltr: data.enable_ltr
      });
    }
  });
function BuyNumber(props) {
  const [selected, setSelected] = useState({
    name: "Select A Website",
    credit: 0,
    ltr_price: 0,
  });
  const [locationselected, setLocationSelected] = useState({
    name: "Select A Location",
    short_name: "",
  });
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [addCredits, setAddCredits] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isOk, setIsOk] = useState(true);
  const [websiteOptions, setWebsiteOptions] = useState([]);
  const [locaitonOptions, setLocaitonOptions] = useState([]);
  const [selected_type, setSelectedType] = useState("short");

  const isComponentMounted = useRef(true);
  const history = useHistory();

  const websiteOnChange = (option) => {
    setSelected(option);
    setIsChanged(true);
  };
  const locationOnChange = (option) => {
    setLocationSelected(option);
  };

  useEffect(() => {
    // resetting selected value
    setSelected(defaultSelected);
    setLocationSelected(defaultLocationSelected)
    setIsChanged(false);
  }, [selected_type]);

  const createService = () => {
    props.setLoading(true);
    var endTime = moment(localStorage.getItem(`endTime_${selected.value}`))
    var checkTime = moment(new Date())
    var serviceId = localStorage.getItem(`serviceId_${selected.value}`)
    const serviceIds = [selected.value];
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceIds: serviceIds,
        is_ltr: selected_type === "long",
      }),
    };
    if (checkTime < endTime && serviceId === selected.value && selected_type === "short") {
      alert(`You're blocked for ${Math.round(moment.duration(endTime).asMinutes() - moment.duration(checkTime).asMinutes())} minutes, please come back later.`)
      props.setLoading(false);
    } else if (checkTime > endTime && serviceId === selected.value && selected_type === "short") {
      localStorage.removeItem(`endTime_${selected.value}`);
      localStorage.removeItem(`serviceId_${selected.value}`);
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
    if (selected_type === "short") {
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
            setIsOk(false);
            if (response.messageCode === "INSUFFICIENT_BALANCE") {
              setIsInsufficientBalance(true);
            }
            alert(response.data)
            setTimeout(() => setIsOk(true), 3000);
            setSelected(defaultSelected);
            setLocationSelected(defaultLocationSelected)
            setIsChanged(false)
            props.setLoading(false)
          }
          if (isComponentMounted.current) props.setLoading(false);
        });
    } else {
      const requestOptions = {
        method: "POST",
        headers: {
          accept: "*/*",
          Authorization: localStorage.getItem("auth"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: reqId,
        }),
      };
      fetch(API_URL + "/autoservices/service/LTRAutoService", requestOptions)
        .then((response) => response.json())
        .then(async (response) => {
          if (response.success) {
            history.push({
              pathname: "/client/request/" + reqId
            });
          } else {
            setIsOk(false);
            if (response.messageCode === "INSUFFICIENT_BALANCE") {
              setIsInsufficientBalance(true);
            }
            setTimeout(() => setIsOk(true), 3000);
          }
          if (isComponentMounted.current) props.setLoading(false);
        });
    }
  };

  const getWebsites = () => {
    props.setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    };
    fetch(
      API_URL + "/tellabot-services/get/all?page=1&limit=1000&order=true",
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        // var webOptions = [];

        const data_array = response.data.data;
        for (var ind in data_array) {
          const data = data_array[ind];
          webOptions.push({
            is_ltr: data.is_ltr,
            name: data.name,
            custom_name: data.custom_name,
            credit: data.credit,
            ltr_price: data.ltr_price,
            value: data._id,
            enable: data.enable,
            available: data.available,
            ltr_available: data.ltr_available,
            enable_ltr: data.enable_ltr
          });
        }

        if (isComponentMounted.current) {
          setWebsiteOptions(webOptions);
          props.setLoading(false);
        }
      });
  };
  useEffect(() => {
    isComponentMounted.current = true;
    setWebsiteOptions(webOptions)
    setLocaitonOptions(location)
    // getWebsites();
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const customStyles = {
    option: (provided, state) => {
      return {
        ...provided,
        color: state.isSelected ? "#2453B2 !important" : "#364159 !important",
        backgroundColor: state.isSelected
          ? "#EDEFF2 !important"
          : "white !important",
        paddingLeft: "16px ",
        "&:hover": !state.isDisabled
          ? {
            backgroundColor: "#EDEFF2 !important",
            borderLeft: "4px solid #2453B2 !important",
            color: "#2453B2 !important",
            paddingLeft: "12px ",
          }
          : {
            backgroundColor: " rgb(235, 235, 235) !important",
            color: "#2453B2 !important",
          },
      };
    },
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      height: "50px",
    }),
  };
  const websiteInputChange = (option) => {
    const filteredOptions = webOptions.filter((o) => {
      if (o.name.toLowerCase().includes(option.toLowerCase()) || o.custom_name.toLowerCase().includes(option.toLowerCase())) {
        return true
      }
      return false
    });
    let filter = webOptions.filter((o) => o.name.toLowerCase().includes("unknown"))
    if (filteredOptions.length === 0) {
      filteredOptions.push(filter[0]);
      setWebsiteOptions(filteredOptions)
    }
    setWebsiteOptions(filteredOptions)
  };
  if (addCredits) {
    return <Redirect to="/client/refill-credits" />;
  }
  return (
    <>
      <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-5 py-4 bg-white border-radius-10 box-shadow-gray">
        <h4 className="f-20 fw-600">Rent Numbers</h4>
        <div className="row mt-lg-6 mt-3">
          <div style={{ paddingTop: "05px" }} className="col-lg-6 col-md-6 col-12">
            <div className="drop-container">
              <Select
                defaultValue={defaultSelected}
                value={selected}
                options={websiteOptions}
                filterOption={(option) => true}
                onChange={websiteOnChange}
                onInputChange={(e) => websiteInputChange(e)}
                styles={customStyles}
                getOptionLabel={(option) =>
                  option.name === defaultSelected.name
                    ? option.name
                    // : option.name + " "+ option.custom_name +
                    : (option.custom_name ? option.custom_name : option.name) +
                    " (" +
                    (selected_type === "long"
                      ? option.ltr_available
                      : option.available) +
                    ")"
                }
                isOptionDisabled={(websiteOption) =>
                  (selected_type === "short" && websiteOption.enable === false) ||
                  (selected_type === "long" && websiteOption.enable_ltr === false) ||
                  (selected_type === "short" &&
                    websiteOption.available === "0") ||
                  (selected_type === "long" &&
                    websiteOption.ltr_available === "0")
                }
              />
            </div>
          </div>
          <div style={{ paddingTop: "05px" }} className="col-lg-3 col-md-2 col-12">
            <div className="drop-container">
              <Select
                defaultValue={defaultLocationSelected}
                value={locationselected}
                options={locaitonOptions}
                onChange={locationOnChange}
                styles={customStyles}
                getOptionLabel={(option) =>
                  option.name === defaultLocationSelected.name
                    ? option.name : option.name + ", " + option.short_name
                }
                isDisabled={selected_type==="long"}                
              />
            </div>
          </div>
          <div style={{ paddingTop: "05px" }} className="col-lg-3 col-md-3 col-12">
            <button
              style={{ padding: "0" }}
              className={
                "btn mt-lg-0 mt-md-0 mt-3 text-white w-100 h-5 " +
                (isOk ? "bg-dark-blue" : "btn-danger")
              }
              onClick={createService}
              disabled={!isChanged}
            >
              Get Number
              <span className="ml-1">{`(-${selected_type === "long" ? selected.ltr_price : selected.credit
                })`}</span>
            </button>
          </div>
        </div>
        <div className="row mt-lg-4 mt-3">
          <div
            className="col-lg-6 col-12 col-md-6"
            onClick={() => {
              setSelectedType("short");
            }}
          >
            <label className="radio-container">
              Short-Term Rental (STR){" 15-Min "}
              <input
                className="default-radio"
                type="radio"
                checked={selected_type === "short"}
                value="short"
              />
              <div
                class="my-radio"
              // style={selected_type === "short" ? { borderWidth: "7px" } : {}}
              >
                {selected_type === "short" ? (
                  <span class="checked-radio"></span>
                ) : (
                  <></>
                )}
              </div>
            </label>
          </div>
          <div
            className="col-lg-6 col-12 col-md-6  "
            onClick={() => {
              setSelectedType("long");
            }}
          >
            <label className="radio-container">
              Long-Term Rental (LTR) 30-Day
              <input
                className="default-radio"
                type="radio"
                checked={selected_type === "long"}
                value="long"
              />
              <div
                class="my-radio"
              // style={selected_type === "long" ? { borderWidth: "7px" } : {}}
              >
                {selected_type === "long" ? (
                  <span class="checked-radio"></span>
                ) : (
                  <></>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
      <InSufficientBalanceModal
        show={isInsufficientBalance}
        handleClose={() => setIsInsufficientBalance(false)}
        onAddCredits={() => setAddCredits(true)}
      />
    </>
  );
}

export default BuyNumber;
