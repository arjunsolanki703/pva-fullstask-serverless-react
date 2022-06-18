import { API_URL, getRole } from "./CONST";
import React, { useEffect, useState } from "react";

import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Vector from "../../images/Vector.png";
import bell from "../../images/bell.png";
import bellAlert from "../../images/bellAlert.png";
import menuImg from "../../images/menu_icon.svg";
import { Link } from "react-router-dom";

function Navbar({ sidebar, setSidebar, currentPage, id, creditRef, refresh,creditupdated }) {
  useEffect(() => {
    setSidebar(false);
    // localStorage.setItem("currentPage", currentPage);
    if (id) localStorage.setItem("currentPage", id);
  }, []);
  useEffect(() => {
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
          setUnreadedNews(response.data.unreaded_news);
          const credits_ = parseFloat(response.data.credits).toFixed(2);
          setCredit(credits_);
        }
      });
  }, [refresh,creditupdated]);

  const [toNews, setToNews] = useState(false);
  const [unReadedNews, setUnreadedNews] = useState(false);
  const [credit, setCredit] = useState("0.00");
  const notic = localStorage.getItem("notice-enable");
  const role = getRole();

  if (toNews && currentPage !== "News") {
    return <Redirect to="/client/news" />;
  }
  return (
    <div style={{ top: 0 }} className="z-index-1 sticky" id="navbar">
      {role == "client" ? (
        <div
          style={{
            width: "100%",
            minHeight: 20,
            background: "#fff",
            display: notic == "true" ? "block" : "none",
          }}
        ></div>
      ) : (
        <></>
      )}
      <div className="d-flex bg-white ai-center px-4 py-3 jc-sb navbar-wrapper">
        <div className="d-flex ai-center">
          <img
            src={menuImg}
            width="25"
            className="mr-lg-3 mr-2 cr-pointer view-on-small"
            alt=""
            style={{ outline: "none" }}
            onClick={() => {
              setSidebar(!sidebar);
            }}
            tabIndex="0"
            onBlur={() => {
              setSidebar(false);
            }}
          />
          <h1
            className="f-28 fw-700 text-secondary mb-0"
            id="page-title"
          >
            {currentPage}
          </h1>
        </div>

        <div className="d-flex ai-center">
          {role === "client" ? (
            <>
              <div
                className={
                  "mr-3 d-flex ai-center jc-center " +
                  (unReadedNews ? "unreaded-news" : "")
                }
                style={{
                  width: "40px",
                  height: "40px",
                  marginLeft: "5px",
                  cursor: "pointer",
                  borderRadius: "100%",
                }}
                onClick={() => {
                  setToNews(true);
                }}
              >
                <img
                  alt=""
                  src={unReadedNews ? bellAlert : bell}
                  style={{ height: "25px", width: "25px", marginBottom: "3px" }}
                ></img>{" "}
              </div>
              <Link to="/client/refill-credits">
                <div className="f-16 credits-wrapper"  onClick={()=> {localStorage.setItem("currentPage","Refill Credits");localStorage.setItem("AccountOpen", "true");}}>
                  <img
                    alt=""
                    src={Vector}
                    width="16"
                    style={{ marginBottom: "3px" }}
                  />
                  <span
                    ref={(ref) => {
                      if (creditRef) creditRef.current = ref;
                    }}
                    className="ml-1 text-bright-blue"
                  >
                    {credit}
                  </span>
                </div>
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
