import React, { useState, useRef, useEffect } from "react";
import { Redirect } from "react-router";
import isAuthorized from "../common/Auth";
import Loader from "../common/Loader";
import Navbar from "../common/navbar";
import EditWebsite from "./editWebsites";

function EditWebsiteContainer(props) {
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

  const state = props.location.state?.website;

  var isAddMode = true;
  if (state) isAddMode = false;

  if (isAuthorized()) {
    return (
      <>
        {loading ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage={isAddMode ? "Add Website" : "Edit Website"}
          />
          <div className="content-wrapper">
            <EditWebsite
              isAddMode={isAddMode}
              data={state}
              setLoading={setLoading}
            />
          </div>
        </div>
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default EditWebsiteContainer;
