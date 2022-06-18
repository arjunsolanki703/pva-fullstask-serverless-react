import React, { useState, useEffect, useRef, useCallback } from "react";
import { Redirect } from "react-router";
import BuyNumber from "./buyNumber";
import MostViewedWebsite from "./mostViewedWebsite";
import isAuthorized from "../common/Auth";
import { API_URL } from "../common/CONST";
import Maintenance from "../Modals/Maintenence";
import Navbar from "../common/navbar";
import Loader from "../common/Loader";

function Dashboard(props) {
  const [loading, setLoading_] = useState(0);
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

    getMostWebsites();

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const [mostWebs, setMostWebs] = useState([]);

  const getMostWebsites = () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/users/getrecentwebsite", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        var mostWebs = [];

        const data_array = response.data;
        for (var ind in data_array) {
          const data = data_array[ind];
          mostWebs.push({
            id: data.service_id,
            name: data.name,
            custom_name: data.custom_name,
            credit: data.credit,
            is_ltr: data.is_ltr,
            ltr_price: data.credit,
            available: data.available,
            ltr_available: data.ltr_available,
            enable: data.is_active,
          });
        }
        if (isComponentMounted.current) {
          setMostWebs(mostWebs);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  if (isAuthorized()) {
    return (
      <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
        <Navbar
          setSidebar={props.setSidebar}
          sidebar={props.sidebar}
          currentPage="Dashboard"
        />
        {loading > 0 ? <Loader /> : <></>}
        <div className="content-wrapper" style={{ overflow: "visible" }}>
          <BuyNumber setLoading={setLoading} />
          <MostViewedWebsite
            websites={mostWebs}
            {...props}
            setLoading={setLoading}
          />
          <Maintenance setLoading={setLoading} />
        </div>
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default Dashboard;
