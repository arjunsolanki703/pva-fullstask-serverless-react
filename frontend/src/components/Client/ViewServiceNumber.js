import React, { useEffect, useState } from "react";
import Navbar from "../common/navbar";
import isAuthorized from "../common/Auth";
import { Redirect } from "react-router";
import PhoneImg from "../../images/phone.png";
import Maintenance from "../Modals/Maintenence";
import { convertToEDT } from "../common/CONST";
import CopyToClipboard from "../common/copyToClipboard";

const ViewServiceNumber = (props) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const old_messages = [];
    const data = props.location.state.service;
    for (var service_ind in data.credit.services) {
      const service = data.credit.services[service_ind];
      if (service.pin && service.reply) {
        old_messages.push({
          time: service.timestamp,
          message: service.pin,
          sms: service.reply,
        });
      }
    }
    if (!props.location.state.is_ltr) old_messages.reverse();
    setMessages(old_messages);
  }, [props]);

  const getFormatted = (number) => {
    if (!number) return "";
    let formatted = "";
    formatted += "(" + number.substr(1, 3) + ") ";
    formatted += number.substr(4, 3) + "-";
    formatted += number.substr(7, 4);
    return formatted;
  };

  if (isAuthorized()) {
    return (
      <>
        <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
          <Navbar
            setSidebar={props.setSidebar}
            sidebar={props.sidebar}
            currentPage={props.location.state.service.credit.services[0].name}
            id="History"
          />
          <div
            className="content-wrapper"
            onClick={() => {
              props.setSidebar(false);
            }}
          >
            <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 px-3 py-lg-5 py-4  bg-white border-radius-10 box-shadow-gray">
              <div
                className="d-flex jc-center"
                style={{ marginBottom: "28px" }}
              >
                <div className="d-flex jc-center w-50 mx-lg-auto mx-md-auto mx-0">
                  <div
                    className="d-flex  ai-center bg-light-blue-one px-lg-5 px-md-5 pl-3 py-3 h-6 w-100 border-radius-6"
                    style={{ justifyContent: "center" }}
                  >
                    <img
                      alt=""
                      src={PhoneImg}
                      className="ml-lg-3 ml-md-3 ml-0 mr-lg-5 mr-md-5 mr-4"
                    />
                    <div className="mb-0  ml-lg-5 ml-md-5 mr-lg-5 mr-md-5 mr-3 f-16 text-bright-blue text-nowrap fw-600">
                      {getFormatted(
                        props.location.state.service.number?.toString()
                      )}
                    </div>
                  </div>
                  <div className="ml-lg-3 ml-md-3 ml-2">
                    <CopyToClipboard
                      data={props.location.state.service.number
                        ?.toString()
                        .slice(1)}
                    />
                  </div>
                </div>
              </div>
              {messages.length > 0 ? (
                <table className="table box-shadow-gray">
                  <thead>
                    <tr className="text-left">
                      <th className="text-left align-left">Time</th>
                      <th className="text-left align-left">Message</th>
                      <th className="text-left align-left">SMS Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg, ind) => (
                      <tr key={ind}>
                        <td className="text-left align-left">
                          {convertToEDT(parseInt(msg.time) * 1000)}
                        </td>
                        <td className="text-left align-left">{msg.sms}</td>
                        <td
                          className="text-left align-left"
                          style={{
                            display: "flex",
                            // justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ paddingRight: "10px" }}>
                            {msg.message}
                          </div>
                          {msg.message ? (
                            <CopyToClipboard
                              data={msg.message}
                              width="15"
                              height="15"
                            />
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>No Data</div>
              )}
            </div>
          </div>
        </div>
        <Maintenance />
      </>
    );
  } else {
    return <Redirect to="/" />;
  }
};

export default ViewServiceNumber;
