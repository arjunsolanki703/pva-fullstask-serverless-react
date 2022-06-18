import React from "react";
import Navbar from "../common/navbar";
import ApiDocument from "./apiDocument";

function ApiKeyContainer(props) {
  return (
    <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
      <Navbar
        setSidebar={props.setSidebar}
        sidebar={props.sidebar}
        currentPage="API key"
      />
      <div className="content-wrapper">
        <ApiDocument />
      </div>
    </div>
  );
}

export default ApiKeyContainer;
