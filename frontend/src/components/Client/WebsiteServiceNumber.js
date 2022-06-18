import React, { useCallback, useEffect, useRef, useState } from "react";

import { API_URL } from "../common/CONST";
import Loader from "../common/Loader";
import Maintenance from "../Modals/Maintenence";
import Navbar from "../common/navbar";
import { Redirect } from "react-router";
import ServiceNumber from "../common/serviceNumber";
import ServiceSMS from "../common/serviceSMS";
import isAuthorized from "../common/Auth";

function WebsiteServiceNumber(props) {
  const [loading, setLoading_] = useState(0);
  const [sms_recive, setsms_recive] = useState(false);
  const [creditupdated, setcreditupdated] = useState(false);

  const update_creditdetail = () => {
    setcreditupdated(!creditupdated);
  };
  
  const setLoading = (value) => {
    if (!isComponentMounted.current) return;

    if (value) {
      setLoading_((prevLoading) => prevLoading + 1);
    } else {
      setLoading_((prevLoading) => prevLoading - 1);
    }
  };
  const isComponentMounted = useRef(true);
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);
  // recieved from props
  const requestId = props.location.pathname.split("/client/request/")[1];
  const [refresh, setRefresh] = useState({});

  const [service, setService] = useState({});
  const getNumberData = useCallback((requestId) => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };

    fetch(API_URL + `/users/numberdata?requestId=${requestId}`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        setService(response.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getNumberData(requestId);
  }, [requestId, getNumberData, refresh]);
  useEffect(() => localStorage.setItem("currentPage", requestId), [requestId]);

  const handle_sms = () => {
    setsms_recive(true)
  }

  if (!props.location || !props.location.pathname)
    return <Redirect to="/404" />;

  if (isAuthorized()) {
    return (
      <>
        {loading ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage={
              service.credit ? service.credit.services[0].custom_name ? service.credit.services[0].custom_name: service.credit.services[0].name : "Phone Number"
            }
            id={requestId}
            refresh={refresh}
            creditupdated={creditupdated}
          />
          <div
            className="content-wrapper"
            onClick={() => {
              props.setSidebar(false);
            }}
          >
            <ServiceNumber
              service={service}
              setRefresh={setRefresh}
              setLoading={setLoading}
              sms_recive={sms_recive}
              update_creditdetail={update_creditdetail}
            />
            <ServiceSMS service={service} setRefresh={setRefresh} handlesms={handle_sms} />
          </div>
        </div>
        <Maintenance />
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default WebsiteServiceNumber;
