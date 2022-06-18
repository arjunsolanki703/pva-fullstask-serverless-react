import { API_URL, convertToEDT } from "../common/CONST";
import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import Navbar from "../common/navbar";
import VisibilityIcon from "@material-ui/icons/Visibility";

function CloseTicket(props) {
  const [loading, setLoading] = useState(false);
  const [ticket_data, setticket_data] = useState([]);
  const isComponentMounted = useRef(true);

  const openAction = {
    actionName: "open",
    actionIcon: VisibilityIcon,
    actionIconColor: "blue",
  };

  useEffect(() => {
    get_ticket();
  }, []);

  const get_ticket = async () => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "close",
      }),
    };
    await fetch(API_URL + "/ticket/getall-ticket", requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        if (response.success) {
          const newTicketData = [];
          const data = response.data.data;
          for (var ind in data) {
            newTicketData.push({
              id: data[ind]._id,
              messages: data[ind].messages,
              user_id: data[ind].user_id,
              // user_name: data[ind].user_name,
              // user_email: data[ind].user_email,
              subject: data[ind].subject,
              user_name:
                data[ind].user_name === "Admin"
                  ? data[ind].to_user
                  : data[ind].user_name,
              user_email:
                data[ind].user_name === "Admin"
                  ? data[ind].to_email
                  : data[ind].user_email,
              status: data[ind].status,
              createdAt: convertToEDT(new Date(data[ind].createdAt).getTime()),
            });
          }
          if (isComponentMounted.current) {
            setLoading(false);
            newTicketData.sort(function (a, b) {
              var dateA = new Date(a.createdAt), dateB = new Date(b.createdAt)
              return  dateB - dateA
            });
            setticket_data(newTicketData);
          }
        }
      })
      .catch((err) => setLoading(false));
  };
  return (
    <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
      <Navbar
        setSidebar={props.setSidebar}
        sidebar={props.sidebar}
        currentPage="Close Ticket"
      />
      {loading ? <Loader /> : <></>}
      <div className="content-wrapper" style={{ overflow: "visible" }}>
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-5 py-4 bg-white border-radius-10 box-shadow-gray">
          <div className="overflow-scroll rounded-top">
            <table className="table box-shadow-gray history-table">
              <thead>
                <tr className="text-left">
                  <th className="text-left align-left w-auto">Date</th>
                  <th className="text-left align-left w-auto">Subject</th>
                  <th className="text-left align-left w-auto">Name</th>
                  <th className="text-left align-left w-auto">Email</th>
                  <th className="text-left align-left w-auto">Action</th>
                </tr>
              </thead>
              <tbody>
                {ticket_data &&
                  ticket_data
                    .map((ticket, i) => (
                      <tr key={i} className="text-left">
                        <td className="f-16 text-primary text-left align-left text-capitalize">
                          {ticket.createdAt}
                        </td>
                        <td className="f-16 text-primary text-left align-left text-capitalize">
                          <Link
                            style={{
                              color: "rgb(36, 83, 178)",
                              textDecoration: "none",
                            }}
                            to={{
                              pathname: "/admin/update-ticket",
                              state: { id: ticket.id, status: ticket.status },
                            }}
                          >
                            {ticket.subject}
                          </Link>
                        </td>
                        <td className="f-16 text-primary text-left align-left text-capitalize">
                          {ticket.user_name}
                        </td>
                        <td className="f-16 text-primary text-left align-left ">
                          {ticket.user_email}
                        </td>
                        <td className="f-16 text-primary text-left align-left ">
                          <div>
                            <Link
                              to={{
                                pathname: "/admin/update-ticket",
                                state: { id: ticket.id, status: ticket.status },
                              }}
                            >
                              <openAction.actionIcon
                                className={`p-lg-0 p-md-0 p-1  status-${openAction.actionName}`}
                                style={{
                                  color: `${openAction.actionIconColor}`,
                                  cursor: "pointer",
                                }}
                              />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                    }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CloseTicket;
