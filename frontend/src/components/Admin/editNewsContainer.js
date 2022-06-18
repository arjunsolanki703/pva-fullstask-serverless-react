import React, { useState, useRef, useEffect } from "react";
import { Redirect } from "react-router";
import isAuthorized from "../common/Auth";
import Loader from "../common/Loader";
import Navbar from "../common/navbar";
import EditNews from "./editNews";

function EditNewsContainer(props) {
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

  const isAdd = props.location.state?.isAddMode;
  const data = props.location.state?.data;
  if (isAuthorized()) {
    return (
      <>
        {loading ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage={"News"}
          />
          <div className="content-wrapper">
            <EditNews isAdd={isAdd} data={data} setLoading={setLoading} />
          </div>
        </div>
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default EditNewsContainer;
