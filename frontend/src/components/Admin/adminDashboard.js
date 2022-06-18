import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../common/CONST";
import isAuthorized from "../common/Auth";
import { Redirect } from "react-router";

function AdminDashboard({ setLoading }) {
  const [data, setData] = useState({ user: 0, website: 0 });

  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/admin/getDashboard", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success && isComponentMounted.current) {
          setData({
            user: response.data.usercount,
            website: response.data.websitecount,
          });
        }
        if (isComponentMounted.current) {
          setLoading(false);
        }
      })
      .catch((err) => setLoading(false));

    return () => {
      isComponentMounted.current = false;
    };
  }, []);
  if (isAuthorized() === false) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-5 py-4 bg-white border-radius-10 box-shadow-gray">
        <h2 className="fw-700">Welcome Back</h2>
        <div className="row mt-5 pt-4 admin-dashboard">
          <div className="col-lg-6 col-md-6 col-12">
            <div className="text-center fw-500">
              <span className="f-28">{data.user ? data.user : 0}</span>
              <span className="mt-1 d-block">User</span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="text-center fw-500">
              <span className="f-28">{data.website ? data.website : 0}</span>
              <span className="mt-1 d-block">Website</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
