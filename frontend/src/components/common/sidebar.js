import { API_URL, convertToEDT, getRole } from "../common/CONST";
import { Link, Redirect } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import AreYouSure from "../Modals/AreYouSure";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Loader from "./Loader";
import alarm from "../../images/alarm.png";
import api from "../../images/api.png";
import cart from "../../images/cart.png";
import downArrow from "../../images/close_more_24px.png";
import home from "../../images/home.png";
import logo from "../../images/logo.svg";
import logout from "../../images/Logout.png";
import news from "../../images/news.png";
import people from "../../images/people.png";
import phone2 from "../../images/phone2.png";
import profile from "../../images/profile.png";
import settings from "../../images/settings.png";
import ticket from "../../images/ticket.png";
import transaction from "../../images/transaction.png";
import upArrow from "../../images/expand_more_24px.png";
import wallet from "../../images/wallet.png";
import website from "../../images/website.png";

function Sidebar(props) {
  const [loading, setLoading] = useState(false);
  const [ltrActiveServices, setLtrActiveServices] = useState([]);
  const [strActiveServices, setStrActiveServices] = useState([]);
  const [showLtrPhoneNumber, setShowLtrPhoneNumber] = useState(true);
  const [showStrPhoneNumber, setShowStrPhoneNumber] = useState(true);
  const [showLtr, setShowLtr] = useState(true);
  const [showStr, setShowStr] = useState(true);
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [profile_open, setprofile_open] = useState(
    localStorage.getItem("AccountOpen") == "true" ? true : false
  );
  const [selected, setSelected] = useState("");

  const admin_item = [
    {
      label: "Dashboard",
      icon: home,
      link: "/admin/dashboard",
      access: "admin",
    },
    {
      label: "News",
      icon: news,
      link: "/admin/news",
      access: "admin",
    },
    {
      label: "Websites",
      icon: website,
      link: "/admin/websites",
      access: "admin",
    },
    {
      label: "Customers",
      icon: people,
      link: "/admin/customers",
      access: "admin",
    },
    {
      label: "History",
      icon: alarm,
      link: "/admin/history",
      access: "admin",
    },
    {
      label: "Transaction",
      icon: transaction,
      link: "/admin/transaction",
      access: "admin",
    },
    {
      label: "Setting",
      icon: settings,
      link: "/admin/settings",
      access: "admin",
    },
    {
      label: "Support Ticket",
      icon: ticket,
      access: "admin",
      menu: [
        {
          label: "Open Ticket",
          icon: profile,
          link: "/admin/open-ticket",
          access: "admin",
        },
        {
          label: "Close Ticket",
          icon: profile,
          link: "/admin/close-ticket",
          access: "admin",
        },
      ],
    },
  ];

  const customer_item = [
    {
      label: "Dashboard",
      icon: home,
      link: "/client/dashboard",
      access: "client",
    },
    {
      label: "History",
      icon: alarm,
      link: "/client/history",
      access: "client",
    },
    // {
    //   label: "API",
    //   icon: api,
    //   link: "https://app.swaggerhub.com/apis-docs/PVA-Deals/pva-deals/1.0.0-oas3#/",
    //   access: "client",
    // },
    {
      label: "Account",
      icon: profile,
      // link: "/client/account",
      access: "client",
      menu: [
        {
          label: "Pricing",
          icon: wallet,
          link: "/client/pricing",
          access: "client",
        },
        {
          label: "Refill Credits",
          icon: cart,
          link: "/client/refill-credits",
          access: "client",
        },
        {
          label: "Transaction",
          icon: transaction,
          link: "/client/transaction",
          access: "client",
        },
        {
          label: "Support Ticket",
          icon: ticket,
          link: "/client/create-ticket",
          access: "client",
          menu: [
            {
              label: "Open Ticket",
              icon: profile,
              link: "/client/open-ticket",
              access: "client",
            },
            {
              label: "Close Ticket",
              icon: profile,
              link: "/client/close-ticket",
              access: "client",
            },
          ],
        },
        {
          label: "Profile",
          icon: profile,
          link: "/client/profile",
          access: "client",
        },
        {
          label: "Logout",
          icon: logout,
          access: "client",
        },
      ],
    },
  ];

  const deleteService = async (request_id, service_name) => {
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestID: request_id,
        is_flag: false,
      }),
    };
    await fetch(API_URL + `/users/expirenumber`, requestOptions)
      .then((response) => response)
      .then((response) => {});
  };
  const isValid = (endTime, isLtr) => {
    const endTimeEDT = convertToEDT(new Date(endTime).getTime());
    const currTimeEDT = convertToEDT(new Date().getTime());
    const endTimeStamp = new Date(endTimeEDT);
    const currTimeStamp = new Date(currTimeEDT);

    if (isLtr === false) {
      if (currTimeStamp > endTimeStamp) {
        return false;
      }
    } else {
      if (currTimeStamp > endTimeStamp - 60 * 1000) {
        return false;
      }
    }
    return true;
  };
  const getActiveService = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/users/activenumber", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          const ltr_services = [];
          const str_services = [];

          for (var ind in response.data) {
            const data = response.data[ind];
            const first_service = response.data[ind].credit.services[0];
            const lastIndex = Math.max(
              response.data[ind].credit.services.length - 1,
              0
            );
            const last_service = response.data[ind].credit.services[lastIndex];

            const request_id = data._id;
            const id = first_service.service_id;
            const name = first_service.name;
            const custom_name = first_service.custom_name;
            const credit = first_service.credit;
            const number = data.number;
            const endtime = response.data[ind].endtime;
            const message_id = last_service.message_id;

            const isLtr = response.data[ind].is_ltr;
            if (isValid(endtime, isLtr)) {
              if (data.is_ltr) {
                ltr_services.push({
                  request_id: request_id,
                  id: id,
                  name: name,
                  custom_name: custom_name,
                  credit: credit,
                  number: number,
                  endtime: endtime,
                  msgId: message_id,
                  whole_data: data,
                });
              } else {
                str_services.push({
                  request_id: request_id,
                  id: id,
                  name: name,
                  custom_name: custom_name,
                  credit: credit,
                  number: number,
                  endtime: endtime,
                  msgId: message_id,
                  whole_data: data,
                });
              }
            } else {
              deleteService(request_id, name);
            }
          }
          setLtrActiveServices(ltr_services);
          setStrActiveServices(str_services);
          if (ltr_services.length > 0) {
            setShowLtr(true);
          } else {
            setShowLtr(false);
          }
          setStrActiveServices(str_services);
          if (str_services.length > 0) {
            setShowStr(true);
          } else {
            setShowStr(false);
          }
        } else {
          if (response.error === "User Blocked by Admin") {
            // <Redirect  to="/" />
            localStorage.setItem("auth", "");
            localStorage.setItem("user_block", "true");
            let error =
              "Your account is disabled; please contact us on support@serverlessadeals.com";
            props.history.push({
              pathname: "/",
              state: { error: error },
            });
            // <Redirect
            //   to={{
            //     pathname: "/",
            //     state:"Your account is disabled; please contact us on support@serverlessadeals.com"
            //   }}
            // />;
          }
        }
      });
  };

  useEffect(() => {
    setprofile_open(
      localStorage.getItem("AccountOpen") == "true" ? true : false
    );
  }, [localStorage.getItem("AccountOpen")]);

  useEffect(() => {
    setSelected(localStorage.getItem("currentPage"));
    localStorage.setItem("AccountOpen", "false");
    // if (localStorage.getItem("AccountOpen") == "true") {
    //   setprofile_open(true);
    //   localStorage.setItem("AccountOpen", "true");
    // } else {
    //   setprofile_open(false);
    //   localStorage.setItem("AccountOpen", "false");
    // }
    getActiveService();

    var getter;
    if (getRole() === "client") {
      const SEC =
        process.env.REACT_APP_ENV === "production" ? 5 * 1000 : 30 * 1000;
      getter = setInterval(getActiveService, SEC);
    }
    return () => {
      if (getter) clearInterval(getter);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    getActiveService();
    setLoading(false);
    setSelected(localStorage.getItem("currentPage"));
  }, [props]);

  var role = "";
  if (getRole()) role = getRole();

  const boxClick = (label) => {
    localStorage.setItem("currentPage", label);
    setSelected(label);
    if (label === "Logout") {
      setIsLogoutClicked(true);
    }
  };

  const [toDashboard, setToDashboard] = useState(false);
  if (toDashboard) {
    return <Redirect to="/" />;
  }

  const item = role === "admin" ? admin_item : customer_item;
  return (
    <>
      <div>
        {loading ? <Loader /> : <></>}
        <div className="logo-wrapper">
          <img
            alt=""
            src={logo}
            width="247"
            className="img-fluid"
            onClick={() => setToDashboard(true)}
            style={{ cursor: "pointer" }}
          ></img>
        </div>
        <div>
          <ul className="sidebar-items mt-5">
            {item &&
              item.map(
                (item) =>
                  (item.access === role || !item.access) && (
                    <div key={item.label}>
                      {item.link ? (
                        item.label != "API" ? (
                          <Link to={item.link} onClick={item.click}>
                            <li
                              className="sidebar-item"
                              onClick={() => {
                                boxClick(item.label);
                                setprofile_open(false);
                                setOpen(false);
                                localStorage.setItem("AccountOpen", "false");
                              }}
                              style={
                                selected === item.label
                                  ? { backgroundColor: "#f2f6ff" }
                                  : {}
                              }
                            >
                              {selected === item.label ? (
                                //after click image
                                <img
                                  className="sidebar-item-image filter-image"
                                  src={item.icon}
                                  alt="Icon"
                                />
                              ) : (
                                <img
                                  className="sidebar-item-image"
                                  src={item.icon}
                                  alt="Icon"
                                />
                              )}

                              <span
                                className="ml-2"
                                style={
                                  selected === item.label
                                    ? {
                                        color: "#2453b2",
                                        backgroundColor: "#f2f6ff",
                                      }
                                    : {}
                                }
                              >
                                {item.label}
                                <img
                                  alt=""
                                  className="ml-2"
                                  src={item.navicon}
                                />
                              </span>
                            </li>
                          </Link>
                        ) : (
                          <a target="blank" href={item.link}>
                            <li
                              className="sidebar-item"
                              onClick={() =>
                                localStorage.setItem("AccountOpen", "false")
                              }
                            >
                              <img
                                className="sidebar-item-image"
                                src={item.icon}
                                alt="Icon"
                              />
                              <span className="ml-2">{item.label}</span>
                            </li>
                          </a>
                        )
                      ) : (
                        <>
                          <li
                            className=""
                            style={
                              selected === item.label
                                ? { backgroundColor: "#f2f6ff" }
                                : {}
                            }
                          >
                            <div
                              onClick={() => {
                                setprofile_open(!profile_open);
                                boxClick(item.label);
                                props.setSidebar(true);
                                localStorage.setItem("AccountOpen", "false");
                              }}
                              className="sidebar-item create-item"
                              style={{ marginBottom: 0 }}
                            >
                              {selected === item.label ? (
                                <img
                                  style={{ width: "20px", height: "20px" }}
                                  className="sidebar-item-image filter-image"
                                  src={item.icon}
                                  alt="Icon"
                                />
                              ) : (
                                <img
                                  style={{ width: "20px", height: "20px" }}
                                  className="sidebar-item-image"
                                  src={item.icon}
                                  alt="Icon"
                                />
                              )}
                              <span
                                style={
                                  selected === item.label
                                    ? {
                                        color: "#2453b2",
                                        backgroundColor: "#f2f6ff",
                                        whiteSpace: "nowrap",
                                      }
                                    : {
                                        whiteSpace: "nowrap",
                                      }
                                }
                                className="ml-2"
                              >
                                {item.label}
                              </span>
                              <span style={{ marginLeft: "5px" }}>
                                {profile_open ? (
                                  <ExpandMoreIcon />
                                ) : (
                                  <ExpandLessIcon />
                                )}
                              </span>
                            </div>
                            {/* account list  */}
                            {item.menu.map(
                              (data, i) =>
                                profile_open && (
                                  <div
                                    className="dropMenu"
                                    style={{
                                      marginLeft:
                                        role === "admin" &&
                                        (data.label === "Open Ticket" ||
                                          data.label === "Close Ticket")
                                          ? "52px"
                                          : "",
                                    }}
                                  >
                                    {!data.menu ? (
                                      data.label != "Logout" ? (
                                        <Link to={data.link}>
                                          <div
                                            style={
                                              selected === data.label
                                                ? {
                                                    backgroundColor: "#f2f6ff",
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    alignItems: "center",
                                                  }
                                                : {
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    alignItems: "center",
                                                  }
                                            }
                                          >
                                            {role === "admin" &&
                                            (data.label === "Open Ticket" ||
                                              data.label === "Close Ticket") ? (
                                              ""
                                            ) : selected === data.label ? (
                                              <img
                                                style={{
                                                  width: "20px",
                                                  height: "20px",
                                                }}
                                                className="sidebar-item-image filter-image"
                                                src={data.icon}
                                                alt="Icon"
                                              />
                                            ) : (
                                              <img
                                                style={{
                                                  width: "20px",
                                                  height: "20px",
                                                }}
                                                className="sidebar-item-image"
                                                src={data.icon}
                                                alt="Icon"
                                              />
                                            )}

                                            <span
                                              onClick={() => {
                                                boxClick(data.label);
                                              }}
                                              style={
                                                selected === data.label
                                                  ? {
                                                      color: "#2453b2",
                                                      backgroundColor:
                                                        "#f2f6ff",
                                                    }
                                                  : { color: "#797b80" }
                                              }
                                            >
                                              {data.label}
                                            </span>
                                          </div>
                                        </Link>
                                      ) : (
                                        <div
                                          className="Logout-hover"
                                          style={
                                            selected === data.label
                                              ? {
                                                  backgroundColor: "#f2f6ff",
                                                  display: "flex",
                                                  flexWrap: "wrap",
                                                  alignItems: "center",
                                                }
                                              : {
                                                  display: "flex",
                                                  flexWrap: "wrap",
                                                  alignItems: "center",
                                                }
                                          }
                                        >
                                          {selected === data.label ? (
                                            <img
                                              style={{
                                                width: "20px",
                                                height: "20px",
                                              }}
                                              className="sidebar-item-image filter-image"
                                              src={data.icon}
                                              alt="Icon"
                                            />
                                          ) : (
                                            <img
                                              style={{
                                                width: "20px",
                                                height: "20px",
                                              }}
                                              className="sidebar-item-image"
                                              src={data.icon}
                                              alt="Icon"
                                            />
                                          )}
                                          <span
                                            onClick={() => {
                                              setIsLogoutClicked(true);
                                            }}
                                            style={
                                              selected === data.label
                                                ? {
                                                    color: "#2453b2",
                                                    backgroundColor: "#f2f6ff",
                                                  }
                                                : { color: "#797b80" }
                                            }
                                          >
                                            {data.label}
                                          </span>
                                        </div>
                                      )
                                    ) : (
                                      <>
                                        <Link
                                          className="create-ticket-hover"
                                          to={data.link}
                                        >
                                          <div
                                            onClick={() => {
                                              setOpen(!open);
                                              boxClick("Create Ticket");
                                              props.setSidebar(true);
                                            }}
                                            style={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              alignItems: "center",
                                              backgroundColor:
                                                selected === "Create Ticket"
                                                  ? "#f2f6ff"
                                                  : "",
                                            }}
                                          >
                                            {selected === "Create Ticket" ? (
                                              <img
                                                style={{
                                                  width: "20px",
                                                  height: "20px",
                                                }}
                                                className="sidebar-item-image filter-image"
                                                src={data.icon}
                                                alt="Icon"
                                              />
                                            ) : (
                                              <img
                                                style={{
                                                  width: "20px",
                                                  height: "20px",
                                                }}
                                                className="sidebar-item-image"
                                                src={data.icon}
                                                alt="Icon"
                                              />
                                            )}
                                            <span
                                              onClick={() => {
                                                boxClick("Create Ticket");
                                              }}
                                              style={
                                                selected === "Create Ticket"
                                                  ? {
                                                      color: "#2453b2",
                                                      backgroundColor:
                                                        "#f2f6ff",
                                                    }
                                                  : { color: "#797b80" }
                                              }
                                            >
                                              {data.label}
                                            </span>
                                            <span
                                              style={{
                                                padding: 0,
                                                color: "#797b80",
                                              }}
                                            >
                                              {open ? (
                                                <ExpandMoreIcon />
                                              ) : (
                                                <ExpandLessIcon />
                                              )}
                                            </span>
                                          </div>
                                        </Link>
                                        <div style={{ paddingLeft: "20px" }}>
                                          {data.menu.map(
                                            (menu_item, i) =>
                                              open && (
                                                <Link to={menu_item.link}>
                                                  <div
                                                    style={
                                                      selected ===
                                                      menu_item.label
                                                        ? {
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            alignItems:
                                                              "center",
                                                            backgroundColor:
                                                              "#f2f6ff",
                                                          }
                                                        : {
                                                            color: "#797b80",
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            alignItems:
                                                              "center",
                                                          }
                                                    }
                                                  >
                                                    <span
                                                      onClick={() => {
                                                        boxClick(
                                                          menu_item.label
                                                        );
                                                      }}
                                                      style={
                                                        selected ===
                                                        menu_item.label
                                                          ? {
                                                              color: "#2453b2",
                                                              // backgroundColor:
                                                              //   "#f2f6ff",
                                                            }
                                                          : { color: "#797b80" }
                                                      }
                                                    >
                                                      {menu_item.label}
                                                    </span>
                                                  </div>
                                                </Link>
                                              )
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )
                            )}
                          </li>
                        </>
                      )}
                    </div>
                  )
              )}

            {role === "admin" ? (
              <li
                className="sidebar-item"
                onClick={() => {
                  setIsLogoutClicked(true);
                }}
              >
                <img className="sidebar-item-image" src={logout} alt="Icon" />
                <span className="ml-2">Logout</span>
              </li>
            ) : (
              <></>
            )}

            {getRole() === "client" && showLtr ? (
              <li
                className="sidebar-item"
                onClick={() => {
                  setShowLtrPhoneNumber(!showLtrPhoneNumber);
                }}
              >
                <img className="sidebar-item-image" alt="" src={phone2}></img>
                <span className="ml-2">
                  {"LTR Number"} - <b>{ltrActiveServices.length}</b>
                  <img
                    alt=""
                    className="ml-2"
                    src={showLtrPhoneNumber ? upArrow : downArrow}
                  />
                </span>
              </li>
            ) : (
              <></>
            )}

            {getRole() === "client" &&
              showLtr &&
              showLtrPhoneNumber &&
              ltrActiveServices &&
              ltrActiveServices.map((service, ind) => (
                <Link
                  key={ind}
                  className="sidebar-item pl-4 "
                  onClick={() => {
                    boxClick(service.request_id);
                  }}
                  style={
                    selected === service.request_id
                      ? { color: "#2453b2", backgroundColor: "#f2f6ff" }
                      : {}
                  }
                  to={{
                    pathname: `/client/request/${service.request_id}`,
                    state: {
                      service: service,
                    },
                  }}
                >
                  <span className="ml-3">
                    {service.custom_name ? service.custom_name : service.name}
                  </span>
                </Link>
              ))}
            {getRole() === "client" && showStr ? (
              <li
                className="sidebar-item"
                onClick={() => {
                  setShowStrPhoneNumber(!showStrPhoneNumber);
                }}
              >
                <img className="sidebar-item-image" alt="" src={phone2}></img>
                <span className="ml-2">
                  {"STR Number"} - <b>{strActiveServices.length}</b>
                  <img
                    alt=""
                    className="ml-2"
                    src={showStrPhoneNumber ? upArrow : downArrow}
                  />
                </span>
              </li>
            ) : (
              <></>
            )}
            {getRole() === "client" &&
              showStr &&
              showStrPhoneNumber &&
              strActiveServices &&
              strActiveServices.map((service, ind) => (
                <Link
                  key={ind}
                  className="sidebar-item pl-4"
                  onClick={() => {
                    boxClick(service.request_id);
                  }}
                  style={
                    selected === service.request_id
                      ? { color: "#2453b2", backgroundColor: "#f2f6ff" }
                      : {}
                  }
                  to={{
                    pathname: `/client/request/${service.request_id}`,
                    state: {
                      service: service,
                    },
                  }}
                >
                  <span className="ml-3">
                    {service.custom_name ? service.custom_name : service.name}
                  </span>
                </Link>
              ))}
          </ul>
        </div>
      </div>
      <AreYouSure
        title={"Logout"}
        show={isLogoutClicked}
        onHide={() => setIsLogoutClicked(false)}
        onOk={() => {
          localStorage.setItem("auth", "");
          localStorage.setItem("role", "");
          localStorage.setItem("name", "");
          localStorage.setItem("credit", "");
          window.location = "/";
        }}
      />
    </>
  );
}

export default Sidebar;
