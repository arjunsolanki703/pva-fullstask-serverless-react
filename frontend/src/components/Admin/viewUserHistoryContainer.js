import React, { useState, useEffect, useRef } from "react";
import isAuthorized from "../common/Auth";
import Navbar from "../common/navbar";
import ViewUserHistory from "./viewUserHistory";
import { Redirect } from "react-router";
import Loader from "../common/Loader";

function ViewUserHistoryContainer(props) {
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

  const id =
    props.location && props.location.state && props.location.state.id
      ? props.location.state.id
      : "0";
  const name =
    props.location && props.location.state && props.location.state.name
      ? props.location.state.name
      : "User";

  if (isAuthorized()) {
    return (
      <>
        {loading ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage={(name === "" ? "User" : name) + "'s History"}
          />
          <div className="content-wrapper">
            <ViewUserHistory id={id} setLoading={setLoading} />
          </div>
        </div>
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default ViewUserHistoryContainer;
