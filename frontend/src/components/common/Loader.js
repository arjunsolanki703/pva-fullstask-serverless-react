import React from "react";
import loader from "../../images/loader.gif";

const Loader = (props) => {
  return (
    <div className="loader">
      <img src={loader} alt="Loading..." height="200px" width="200px" />
    </div>
  );
};

export default Loader;
