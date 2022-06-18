import { API_URL, countries } from "../common/CONST";
import { Link, Redirect } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import Switch from "@material-ui/core/Switch";
import isAuthorized from "../common/Auth";

function EditCustomer(props) {
  const isAddMode = props.isAddMode;

  const [name, setName] = useState("");
  const [isName, setIsName] = useState(true);

  const [country, setCountry] = useState(countries[0]);

  const [contact, setContact] = useState("");
  // const [isContact, setIsContact] = useState(true);

  const [wemail, setWEmail] = useState("");
  const [isEmail, setIsEmail] = useState(true);

  const [holdCredits, setHoldCredits] = useState("");
  const [isHoldCredits, setIsHoldCredits] = useState(true);

  const [credit, setCredit] = useState("");
  const [isCredit, setIsCredit] = useState(true);

  const [skypeId, setSkypeId] = useState("");
  const [isSkype, setIsSkype] = useState(true);

  const [success, setSuccess] = useState(true);
  const [submit, setSubmit] = useState(false);

  const [isactive,setisactive]= useState(props.data.active?props.data.active:false);
  const isComponentMounted = useRef(true);
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const handleSubmit = () => {
    props.setLoading(true);
    const propsData = props.data ? props.data : {};
    const data = {
      id: propsData.id,
      name: name,
      country: country,
      contact: propsData.contact ? propsData.contact : "-",
      email: wemail,
      credits: credit,
      skype: skypeId,
      hold_credit: holdCredits ? holdCredits : "0",
      status: propsData.status ? propsData.status : "notverified",
      usage: propsData.usage ? propsData.usage : "0",
      api_key: propsData.api_key ? propsData.api_key : "-",
      user_type: propsData.user_type ? propsData.user_type : "client",
      active:isactive
    };
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("auth"),
      },
      body: JSON.stringify(data),
    };
    fetch(API_URL + "/admin/addorupdatecustomer", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (isComponentMounted.current) {
          setSuccess(response.success);
          setSubmit(true);
          setTimeout(() => {
            setSubmit(false);
            setSuccess(true);
          }, 1000);
          props.setLoading(false);
        }
      })
      .catch((err) => props.setLoading(false));
  };

  useEffect(() => {
    if (props.data) {
      setName(props.data.name ? props.data.name : "");
      setCountry(props.data.country ? props.data.country : "");
      setContact(props.data.contact ? props.data.contact : "-");
      setWEmail(props.data.email ? props.data.email : "");
      setHoldCredits(props.data.hold_credit ? props.data.hold_credit : "0");
      setCredit(props.data.credits ? props.data.credits : "0");
      setSkypeId(props.data.skype ? props.data.skype : "");
      setisactive(props.data.active ? props.data.active : false);
    }
  }, [props]);

  if (success && submit) {
    return <Redirect to="/admin/customers" />;
  }
  if (!isAuthorized()) return <Redirect to="/" />;
  return (
    <>
      <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-3 py-4 bg-white border-radius-10 box-shadow-gray">
        <div className="form-wrapper mt-2 mx-auto">
          <div className="form-group col-xl-6 col-lg-6 col-12">
            <label htmlFor="name">Name</label>
            <input
              className="form-control"
              name="name"
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                if (value === "") {
                  setIsName(false);
                } else {
                  setIsName(true);
                }
              }}
            />
            <p hidden={isName}>Please Fill This Field</p>
          </div>

          <div className="form-group mt-2 col-xl-6 col-lg-6 col-12">
            <label htmlFor="country">Country</label>
            <select
              className="form-control"
              name="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="form-group mt-4">
            <label htmlFor="contact">Contact</label>
            <input
              className="form-control"
              name="contact"
              type="text"
              value={contact}
              onChange={(e) => {
                const value = e.target.value;
                setContact(value);
                const regex = /^[0-9]+$/;
                if (regex.test(value)) {
                  setIsContact(true);
                } else {
                  setIsContact(false);
                }
                if (value === "") setIsContact(false);
              }}
            />
            {!isContact && contact === "" ? (
              <p>Please Fill This Field</p>
            ) : isContact ? (
              <p></p>
            ) : (
              <p>Not A Valid Contact</p>
            )}
          </div> */}

          <div className="form-group mt-2 col-xl-6 col-lg-6 col-12">
            <label htmlFor="email">Work Email</label>
            <input
              className="form-control"
              name="email"
              value={wemail}
              onChange={(e) => {
                const value = e.target.value;
                setWEmail(value);

                const regex =
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (regex.test(value)) {
                  setIsEmail(true);
                } else {
                  setIsEmail(false);
                }
              }}
            />
            {!isEmail && wemail === "" ? (
              <p>Please Fill This Field</p>
            ) : isEmail ? (
              <p></p>
            ) : (
              <p>Not A Valid Email</p>
            )}
          </div>

          <div className="form-group mt-2 col-xl-6 col-lg-6 col-12">
            <label htmlFor="credits">Credits</label>
            <input
              className="form-control"
              name="credits"
              type="text"
              value={credit}
              onChange={(e) => {
                const value = e.target.value;
                setCredit(value);

                const regex = /[+-]?([0-9]*[.])?[0-9]+/;
                const splitted = value.split(".");
                let isOk = true;
                if (splitted.length === 2) {
                  if (splitted[1].length <= 2) {
                    isOk = true;
                  } else {
                    isOk = false;
                  }
                }
                if (regex.test(value) && isOk) {
                  setIsCredit(true);
                } else {
                  setIsCredit(false);
                }
              }}
            />
            {!isCredit && credit === "" ? (
              <p>Please Fill This Field</p>
            ) : isCredit ? (
              <p></p>
            ) : (
              <p>Not A Valid Credit</p>
            )}
          </div>

          {/* <div className="form-group mt-2 col-xl-6 col-lg-6 col-12">
            <label htmlFor="credits">Hold Credits</label>
            <input
              className="form-control"
              name="credits"
              type="text"
              value={holdCredits}
              onChange={(e) => {
                const value = e.target.value;
                setHoldCredits(value);

                const regex = /[+-]?([0-9]*[.])?[0-9]+/;
                const splitted = value.split(".");
                let isOk = true;
                if (splitted.length === 2) {
                  if (splitted[1].length <= 2) {
                    isOk = true;
                  } else {
                    isOk = false;
                  }
                }
                if (regex.test(value) && isOk) {
                  setIsHoldCredits(true);
                } else {
                  setIsHoldCredits(false);
                }
              }}
            />
            {!isHoldCredits && holdCredits === "" ? (
              <p>Please Fill This Field</p>
            ) : isHoldCredits ? (
              <p></p>
            ) : (
              <p>Not A Valid Credit</p>
            )}
          </div> */}

          <div className="form-group mt-2 col-xl-6 col-lg-6 col-12">
            <label htmlFor="skypeid">Skype Id</label>
            <input
              className="form-control"
              name="skypeid"
              type="text"
              value={skypeId}
              onChange={(e) => {
                const value = e.target.value;
                setSkypeId(value);
                setIsSkype(true);
              }}
            />
            {!isSkype && skypeId === "" ? (
              <p>Please Fill This Field</p>
            ) : isSkype ? (
              <p></p>
            ) : (
              <p>Not A Valid Skype ID</p>
            )}
          </div>

          <div className="form-group mt-2 col-xl-6 col-lg-6 col-12">
            <label htmlFor="skypeid"> User Active</label>
            <Switch checked={isactive} onChange={()=>setisactive(!isactive)} color="primary"/>
          </div>

          <div className="form-group mt-3 col-xl-6 col-lg-6 col-md-12 col-12 ">
            <Link
              to="/admin/customers"
              type="button"
              className="btn btn-back col-xl-5 col-lg-6 col-md-12 col-12 btn-light-blue text-dark-blue mr-1 "
              style={{ maxWidth: "50%" }}
            >
              Back
            </Link>
            <button
              style={{ maxWidth: "49%" }}
              className={
                "btn btn-update col-xl-5 col-lg-6 col-md-12 col-12 text-white " +
                (success ? "bg-dark-blue" : "btn-danger")
              }
              disabled={
                !isName ||
                !isCredit ||
                !isEmail ||
                !isSkype ||
                name === "" ||
                credit === "" ||
                wemail === ""  
              }
              onClick={handleSubmit}
            >
              {isAddMode ? "Add" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditCustomer;
