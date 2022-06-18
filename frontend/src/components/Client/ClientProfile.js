import React, { useEffect, useState } from "react";

import { API_URL } from "../common/CONST";
import Loader from "../common/Loader";
import Maintenance from "../Modals/Maintenence";
import Navbar from "../common/navbar";
import { Redirect } from "react-router";
import isAuthorized from "../common/Auth";

function RefillcreditesContainer(props) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/users/profile", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setData(response.data);
        }
        setIsLoading(false);
      })
      .catch((err) => setIsLoading(false));
  }, []);

  if (isAuthorized()) {
    return (
      <>
        {isLoading ? <Loader /> : <></>}
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 col-sm-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage="Profile"
          />
          <div
            className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 p-3 bg-white border-radius-10"
            onClick={() => {
              props.setSidebar(false);
            }}
          >
            <div className="form-group">
              <div className="text-dark-blue">Name : </div>
              <input
                className="form-control col-12 col-lg-6"
                readOnly={true}
                value={data.name}
              />
            </div>
            <div className="form-group">
              <div className="text-dark-blue">Email : </div>
              <input
                className="form-control col-12 col-lg-6"
                readOnly={true}
                value={data.email}
              />
            </div>
            <div className="form-group">
              <div className="text-dark-blue">Country : </div>
              <input
                className="form-control col-12 col-lg-6 "
                readOnly={true}
                value={data.country}
              />
            </div>
            <div className="form-group">
              <div className="text-dark-blue">Credits : </div>
              <input
                className="form-control col-12 col-lg-6"
                readOnly={true}
                value={data.credits}
              />
            </div>
          </div>
        </div>
        <Maintenance />
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default RefillcreditesContainer;
