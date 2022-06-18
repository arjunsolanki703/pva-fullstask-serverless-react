import { Link, Redirect } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import { API_URL } from "../common/CONST";
import isAuthorized from "../common/Auth";

function EditWebsite(props) {
  const isAddMode = props.isAddMode;
  const [editedData, setEditedData] = useState(props.data ? props.data : {});
  const [success, setSuccess] = useState(true);
  const [submit, setSubmit] = useState(false);

  const isComponentMounted = useRef(true);
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const handleSubmit = () => {
    props.setLoading(true);
    if (!editedData.boat) {
      editedData["boat"] = true;
    }
    if (!editedData.is_price_surge) {
      editedData["is_price_surge"] = false;
    }
    if (!editedData.price_after_surge) {
      editedData["price_after_surge"] = 0;
    }
    if (editedData.enable === undefined || editedData.enable === null) {
      editedData["enable"] = false;
    }
    if (editedData.enable_ltr === undefined || editedData.enable_ltr === null) {
      editedData["enable_ltr"] = false;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("auth"),
      },
      body: JSON.stringify(editedData),
    };
    fetch(API_URL + "/admin/addorupdatewebsite", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (isComponentMounted.current) {
          setSuccess(response.success);
          setSubmit(true);
          if (!response.success) {
            setTimeout(() => {
              setSubmit(false);
              setSuccess(true);
            }, 1000);
          }
          props.setLoading(false);
        }
      })
      .catch((err) => props.setLoading(false));
  };

  const status = ["Enable", "Disable"];
  if (submit && success) {
    return <Redirect to="/admin/websites" />;
  }
  if (!isAuthorized()) return <Redirect to="/" />;
  return (
    <>
      <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-5 py-4 bg-white border-radius-10 box-shadow-gray">
        <div className="form-wrapper mt-4 w-75 mx-auto">
        <div className="form-group">
            <label htmlFor="custom_name">Website Name</label>
            <input
              className="form-control"
              name="custom_name"
              value={editedData.custom_name ? editedData.custom_name : ""}
              onChange={(e) => {
                setEditedData({ ...editedData, custom_name: e.target.value });
              }}
            />
            <p hidden={editedData.custom_name !== ""}>Please Fill This Field!</p>
          </div>
          <div className="form-group">
            <label htmlFor="name">boat Name</label>
            <input
              className="form-control"
              name="name"
              value={editedData.name ? editedData.name : ""}
              onChange={(e) => {
                setEditedData({ ...editedData, name: e.target.value });
              }}
            />
            <p hidden={editedData.name !== ""}>Please Fill This Field!</p>
          </div>
          <div className="form-group mt-4">
            <label htmlFor="credits">STR Credit</label>
            <input
              className="form-control"
              name="credit"
              type="text"
              value={editedData.credit}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setEditedData({ ...editedData, credit: "" });
                  return;
                }

                const regex = /[+-]?([0-9]*[.])?[0-9]+/;
                const splitted = value.split(".");
                let isOk = true;
                if (splitted.length === 2) {
                  if (splitted[1].length <= 2) {
                    isOk = true;
                  } else {
                    isOk = false;
                  }
                }
                if (regex.test(value) && isOk) {
                  setEditedData({ ...editedData, credit: value });
                }
              }}
            />
            <p hidden={editedData.credit !== ""}>Please Fill This Field!</p>
          </div>

          <div className="form-group mt-4">
            <label htmlFor="credits">LTR Credit</label>
            <input
              className="form-control"
              name="credit"
              type="text"
              value={editedData.ltr_price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setEditedData({ ...editedData, ltr_price: "" });
                  return;
                }
                const regex = /[+-]?([0-9]*[.])?[0-9]+/;
                const splitted = value.split(".");
                let isOk = true;
                if (splitted.length === 2) {
                  if (splitted[1].length <= 2) {
                    isOk = true;
                  } else {
                    isOk = false;
                  }
                }
                if (regex.test(value) && isOk) {
                  setEditedData({ ...editedData, ltr_price: value });
                }
              }}
            />
            <p hidden={editedData.ltr_price !== ""}>Please Fill This Field!</p>
          </div>

          <div className="form-group mt-4">
            <label htmlFor="country">Status Of STR</label>
            <select
              className="form-control"
              name="country"
              value={editedData.enable === true ? "Enable" : "Disable"}
              onChange={(e) => {
                setEditedData({
                  ...editedData,
                  enable: e.target.value === "Enable" ? true : false,
                });
              }}
            >
              {status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mt-4">
            <label htmlFor="country">Status Of LTR</label>
            <select
              className="form-control"
              name="country"
              value={editedData.enable_ltr === true ? "Enable" : "Disable"}
              onChange={(e) => {
                setEditedData({
                  ...editedData,
                  enable_ltr: e.target.value === "Enable" ? true : false,
                });
              }}
            >
              {status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>         

          <div className="d-flex mt-4">
            <Link
              to="/admin/websites"
              type="button"
              className="btn btn-light-blue text-dark-blue w-100 mr-2"
            >
              Back
            </Link>
            <input
              type="submit"
              value={isAddMode ? "Add" : "Update"}
              className={
                "btn text-white w-100 ml-2 " +
                (success ? "bg-dark-blue" : "btn-danger")
              }
              disabled={
                !editedData ||
                !editedData.name ||
                !editedData.credit ||
                !editedData.ltr_price ||
                editedData.name === "" ||
                editedData.credit === "" ||
                editedData.ltr_price === ""
              }
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditWebsite;
