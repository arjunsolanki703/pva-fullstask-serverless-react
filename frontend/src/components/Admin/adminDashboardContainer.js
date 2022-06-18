import React, { useEffect, useRef, useState } from "react";
import isAuthorized from "../common/Auth";
import Navbar from "../common/navbar";
import AdminDashboard from "./adminDashboard";
import { Redirect } from "react-router";
import Loader from "../common/Loader";

function AdminDashboardContainer(props) {
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
  }, []);

  if (isAuthorized()) {
    return (
      <>
        {loading ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage="Dashboard"
          />
          <div
            className="content-wrapper"
            onClick={() => {
              props.setSidebar(false);
            }}
          >
            <AdminDashboard setLoading={setLoading} />
          </div>
        </div>
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default AdminDashboardContainer;
