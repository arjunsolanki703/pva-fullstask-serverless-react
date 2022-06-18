import { API_URL, convertToEDT } from "../common/CONST";
import React, { useCallback, useEffect, useRef, useState } from "react";

import CopyToClipboard from "./copyToClipboard";

function ServiceSMS({ service, handlesms }) {
  const isComponentMounted = useRef(true);
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  // message will be changing so using state variables 
  const [messages, setMessages] = useState([]);
  const [msgId, setMsgId] = useState();
  const [showtable, setshowtable] = useState(true)

  const getMsg = useCallback(() => {
    const number = service.number;
    const name = service.credit?.services[0].name;
    const requestId = service._id;
    const serviceId = service.credit?.services[0].service_id;

    if (!(number && name && requestId && msgId && serviceId)) return;
    if (number === "" || name === "" || requestId === "") return;

    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(
      API_URL +
      `/autoservices/ReadSms/${number}/${encodeURIComponent(
        name
      )}/${requestId}/${msgId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        if (!isComponentMounted.current) return;
        if (response.messageCode === "No messages") return;

        const new_messages = messages;
        new_messages.push({
          time: response.data[0].timestamp,
          message: response.data[0].pin,
          sms: response.data[0].reply,
        });
        setMessages(new_messages);

        requestOptions.method = "POST";
        requestOptions.headers["Content-Type"] = "application/json";
        requestOptions.body = JSON.stringify({
          serviceId: [serviceId],
          requestId: requestId,
        });

        fetch(API_URL + "/autoservices/ReactivateAutoService", requestOptions)
          .then((response) => response.json())
          .then((response) => {
            if (response.success) {
              const services = response.data.credit.services;
              if (services.length >= 2) {
                setMsgId(services[services.length - 1].message_id);
                handlesms()
              }
            }
          });
      });
  }, [service, messages, msgId]);

  const getMsgLtr = useCallback(() => {
    const number = service.number;
    const name = service?.credit.services[0].name;
    const requestId = service._id;

    if (!(number && name && requestId)) return;
    if (number === "" || name === "" || requestId === "") return;

    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(
      API_URL +
      `/autoservices/LTRReadSms/${number}/${encodeURIComponent(
        name
      )}/${requestId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        // LTRnumberStatusCheck(service.number, service._id);
        let new_messages = [];
        if (response.data === "No messages") {
          new_messages = []
        } else {
          for (var ind in response.data) {
            if (response.data[ind].pin) {
              handlesms()
              new_messages.push({
                time: response.data[ind].timestamp,
                message: response.data[ind].pin,
                sms: response.data[ind].reply,
              });
            }
          }
        }
        setMessages(new_messages);
      });
  }, [service]);

  useEffect(() => {
    const isLtr = service.is_ltr;
    // if ((isLtr && service.credit?.services.length <= 1) || (!isLtr && service.credit?.services.length === 0)) {
    //   setshowtable(false)
    // }

    const msgPolling = setInterval(() => {
      if (isLtr && parseInt(service?.LTRActiveTime) > 0) getMsgLtr();
      if (!isLtr) getMsg();
    }, 5 * 1000);
    return () => {
      clearInterval(msgPolling);
      setshowtable(true)
    };
  }, [service, getMsg, getMsgLtr]);
  useEffect(() => {
    const isLtr = service.is_ltr;
    setInterval(() => { if (!isLtr) getMsg() }, 5000)
  }, [getMsg])
  useEffect(() => {
    // setting up initial values
    const services = service.credit?.services;
    if (!services) return;

    setMsgId(services[services.length - 1].message_id);
    const new_messages = [];
    for (var ind in services) {
      if (services[ind].pin) {
        new_messages.push({
          time: services[ind].timestamp,
          message: services[ind].pin,
          sms: services[ind].reply,
        });
      }
    }
    setMessages(new_messages);
  }, [service]);

  const LTRnumberStatusCheck = async (mdn, requestId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mdn: mdn.toString(),
        requestId: requestId
      }),
    };
    await fetch(API_URL + `/autoservices/LTRnumberStatusCheck`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        // setRefresh({})
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  // if(messages.length === 0)
  // return <></>;

  return (
    <>
      {(<div className="overflow-scroll mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 px-3 py-lg-5 py-4  bg-white border-radius-10 box-shadow-gray">
        <table className="table box-shadow-gray">
          <thead>
            <tr className="text-left">
              <th className="text-left align-left">Time</th>
              <th className="text-left align-left">SMS Code</th>
              <th className="text-left align-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {messages &&
              messages.map((msg, ind) => (
                <tr key={ind}>
                  <td className="text-left align-left">
                    {convertToEDT(parseInt(msg.time) * 1000)}
                  </td>
                  <td
                    className="text-left align-left"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ paddingRight: "10px" }}>{msg.message}</div>
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
                  <td className="text-left align-left">{msg.sms}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>)}
      
    </>
  );
}

export default ServiceSMS;
