import React, { useState, useRef, useEffect } from "react";
import Navbar from "../common/navbar";
import { Redirect } from "react-router";
import WebsitePricing from "./websitePricing";
import isAuthorized from "../common/Auth";
import Maintenance from "../Modals/Maintenence";
import Loader from "../common/Loader";

function Pricing(props) {
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
    return () => {
      isComponentMounted.current = false;
    };
  });
  if (isAuthorized()) {
    return (
      <>
        {loading > 0 ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage="Pricing"
          />
          <div className="content-wrapper">
            <WebsitePricing setLoading={setLoading} />
          </div>
        </div>
        <Maintenance />
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default Pricing;
