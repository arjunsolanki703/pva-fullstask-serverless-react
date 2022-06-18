import {
  API_URL,
  convertToEDT,
  isJson,
  rowsPerPageData,
} from "../common/CONST";
import React, { useEffect, useRef, useState } from "react";

import AreYouSure from "../Modals/AreYouSure";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import Pagination from "../common/pagination";
import { Redirect } from "react-router-dom";
import ToolBox from "../common/toolBox";
import VisibilityIcon from "@material-ui/icons/Visibility";
import isAuthorized from "../common/Auth";

const defaultPage = { name: 1, value: 0, active: false };

function CustomersHistory({ setLoading ,props}) {
  const actions = [
    {
      actionName: "View",
      actionIcon: VisibilityIcon,
      actionIconColor: "blue",
      link: "/admin/history",
    },
    {
      actionName: "Edit",
      actionIcon: EditIcon,
      actionIconColor: "green",
      link: "/admin/customer/update",
    },
  ];
  const deleteAction = {
    actionName: "Delete",
    actionIcon: DeleteIcon,
    actionIconColor: "red",
  };
  const ticketAction = {
    actionName: "Ticket",
    actionIcon: LiveHelpIcon,
    actionIconColor: "black",
  };

  const isComponentMounted = useRef(true);

  const [historyList, setHistoryList] = useState([]);
  const getHistory = (currPage_, rowsPerPage_, search_) => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    var API = `/admin/getCustomer?order_by=createdAt&order=false&page=${currPage_}&limit=${rowsPerPage_}`;
    if (search_ !== "") {
      API += `&search_data=${search_}`;
    }

    fetch(API_URL + API, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          const newHistoryList = [];
          const data = response.data.data;
          for (var ind in data) {
            newHistoryList.push({
              id: data[ind]._id,
              name: data[ind].name,
              email: data[ind].email,
              credits: data[ind].credits,
              ltr_credits: data[ind].ltr_price,
              lastLogin: convertToEDT(new Date(data[ind].last_login).getTime()),
              registeredOn: convertToEDT(
                new Date(data[ind].createdAt).getTime()
              ),
              skype: data[ind].skype,
              country: data[ind].country,
              contact: data[ind].contact,
              hold_credit: data[ind].hold_credit,
              status: data[ind].status,
              usage: data[ind].usage,
              api_key: data[ind].api_key,
              user_type: data[ind].user_type,
              actions: actions,
              active: data[ind].active,
            });
          }

          if (isComponentMounted.current) {
            setTotalLength(response.data.totalusers);
            setHistoryList(newHistoryList);
            setLoading(false);
          }
        }
      })
      .catch((err) => setLoading(false));
  };

  const deleteCustomer = (customer) => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };

    fetch(API_URL + "/admin/deletecustomer/" + customer.id, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success && isComponentMounted.current) {
          setCurrPage(0);
          setSearch("");
          getHistory(1, rowsPerPage.value, "");
        }
        if (isComponentMounted.current) {
          setLoading(false);
        }
      })
      .catch((err) => setLoading(false));
  };

  const [totalLength, setTotalLength] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageData[0]);
  const [currPage, setCurrPage] = useState(0);
  const [currPageData, setCurrPageData] = useState([defaultPage]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    isComponentMounted.current = true;
    const rowsPerPage_ = isJson(localStorage.getItem("rowsPerPage"))
      ? JSON.parse(localStorage.getItem("rowsPerPage"))
      : rowsPerPageData[0];

    setCurrPage(0);
    setRowsPerPage(rowsPerPage_);
    setSearch("");
    getHistory(1, rowsPerPage_.value, "");

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const newCurrPageData = [{ name: 1, value: 0, active: false }];
    const length = Math.ceil(totalLength / rowsPerPage.value);

    for (var ind = 1; ind < length; ind++) {
      newCurrPageData.push({
        name: ind + 1,
        value: ind,
        active: false,
      });
    }
    newCurrPageData[currPage].active = true;

    if (isComponentMounted.current) setCurrPageData(newCurrPageData);
  }, [currPage, rowsPerPage, totalLength]);

  const crateTicket= (id) =>{
    props.history.push({
      pathname: '/admin/create-ticket',
      state: { customer_id:id}
    })
  }

  const [clickedCustomer, setClickedCustomer] = useState(-1);
  if (!isAuthorized()) return <Redirect to="/" />;
  return (
    <>
      <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 bg-transparent">
        <ToolBox
          rowsPerPage={rowsPerPage}
          rowsPerPageData={rowsPerPageData}
          onRowsPerPageChange={(selectedRowsPerPage) => {
            setCurrPage(0);
            setRowsPerPage(selectedRowsPerPage);
            getHistory(1, selectedRowsPerPage.value, search);
          }}
          search={search}
          onSearchChange={(data) => {
            setCurrPage(0);
            setSearch(data);
            getHistory(1, rowsPerPage.value, data);
          }}
        />
        <div className="d-flex jc-end  ai-center mb-lg-4 mb-md-4 mb-3">
          <Link
            to="/admin/customer/add"
            className="btn btn-lg px-5 bg-dark-blue text-white"
          >
            Add
          </Link>
        </div>

        <div className="overflow-scroll rounded-top">
          <table className="table box-shadow-gray admin-customers">
            <thead>
              <tr className="text-left">
                <th className="text-left align-left">Name</th>
                <th className="text-left align-left">Email</th>
                <th className="text-left align-left">Credits</th>
                {/* <th className="text-left align-left">Hold Credits</th> */}
                <th className="text-left align-left">Verified</th>
                <th className="text-left align-left">Last Login</th>
                <th className="text-left align-left">Registered On</th>
                <th className="text-left align-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {historyList &&
                historyList.map((customer, index) => (
                  <tr className="text-left" key={index}>
                    <td className="f-16 text-primary text-left align-left">
                      {customer.name}
                    </td>
                    <td className="f-16 text-primary text-left align-left">
                      {customer.email}
                    </td>
                    <td className="f-16  text-primary text-left align-left">
                      {parseFloat(customer.credits).toFixed(2)}
                    </td>
                    {/* <td className="f-16  text-primary text-left align-left">
                      {customer.hold_credit}
                    </td> */}
                    <td className="f-16 text-primary text-left align-left">
                      <div
                        className={`status status-${
                          customer.status === "verified"
                            ? "complete"
                            : "timeout"
                        }`}
                      >
                        {customer.status === "verified" ? "Yes" : "No"}
                      </div>
                    </td>
                    <td className="f-16  text-primary text-left align-left">
                      {customer.lastLogin}
                    </td>
                    <td className="f-16  text-primary text-left align-left">
                      {customer.registeredOn}
                    </td>
                    <td className="f-16 text-primary text-left align-left">
                      <div className="status d-flex jc-sb ai-left ">
                        {customer.actions.map((action, index) => (
                          <div key={index}>
                            <Link
                              to={{
                                pathname: `${action.link}/${customer.id}`,
                                state: {
                                  id: customer.id,
                                  name: customer.name,
                                  email: customer.email,
                                  credits: customer.credits,
                                  country: customer.country,
                                  skype: customer.skype,
                                  contact: customer.contact,
                                  hold_credit: customer.hold_credit,
                                  status: customer.status,
                                  usage: customer.usage,
                                  api_key: customer.api_key,
                                  user_type: customer.user_type,
                                  active: customer.active
                                },
                              }}
                            >
                              <action.actionIcon
                                className={`p-lg-0 p-md-0 p-1  status-${action.actionName}`}
                                style={{ color: `${action.actionIconColor}` }}
                                key={index}
                              />
                            </Link>
                          </div>
                        ))}
                        <div>
                          <deleteAction.actionIcon
                            className={`p-lg-0 p-md-0 p-1  status-${deleteAction.actionName}`}
                            style={{
                              color: `${deleteAction.actionIconColor}`,
                              cursor: "pointer",
                            }}
                            onClick={() => setClickedCustomer(index)}
                          />
                        </div>
                        <div>
                          <ticketAction.actionIcon
                            className={`p-lg-0 p-md-0 p-1  status-${ticketAction.actionName}`}
                            style={{
                              color: `${ticketAction.actionIconColor}`,
                              cursor: "pointer",
                            }}
                            onClick={() => crateTicket(customer.id)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination
          value={currPage}
          data={currPageData}
          onClick={(selectedPage) => {
            setCurrPage(selectedPage);
            getHistory(selectedPage + 1, rowsPerPage.value, search);
          }}
        />
      </div>
      <AreYouSure
        title={"Delete Customer"}
        show={clickedCustomer >= 0}
        onHide={() => setClickedCustomer(-1)}
        onOk={() => {
          deleteCustomer(historyList[clickedCustomer]);
          setClickedCustomer(-1);
        }}
      />
    </>
  );
}

export default CustomersHistory;
