import React, { useState } from "react";
import { Redirect } from "react-router";
import isAuthorized from "../common/Auth";
import Maintenance from "../Modals/Maintenence";
import Navbar from "../common/navbar";
import RefillCredites from "./refillCredites";
import Loader from "../common/Loader";

function RefillcreditesContainer(props) {
  const [loading, setLoading] = useState(false);
  if (isAuthorized()) {
    return (
      <>
        {loading ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage="Refill Credits"
          />
          <div className="content-wrapper">
            <RefillCredites setLoading={setLoading} />
          </div>
          <Maintenance />
        </div>
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default RefillcreditesContainer;
