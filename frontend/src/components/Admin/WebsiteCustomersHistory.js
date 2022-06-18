import React, { useEffect, useRef, useState } from "react";

import CustomersHistory from "./customersHistory";
import Loader from "../common/Loader";
import Navbar from "../common/navbar";
import { Redirect } from "react-router";
import isAuthorized from "../common/Auth";

function WebsiteCustomersHistory(props) {
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
        {loading ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage="Customers"
          />
          <div className="content-wrapper">
            <CustomersHistory setLoading={setLoading} props={props}/>
          </div>
        </div>
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default WebsiteCustomersHistory;
