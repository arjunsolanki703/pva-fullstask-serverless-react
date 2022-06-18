import {
  API_URL,
  convertToEDT,
  isJson,
  removeUnderScroll,
  rowsPerPageData,
} from "../common/CONST";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import Pagination from "../common/pagination";
import ReclaimModal from "../Modals/ReclaimModal";
import ToolBox from "../common/toolBox";
import { location } from "./locations";

const defaultPage = { name: 1, value: 0, active: false };

function History({ setLoading }) {
  const isComponentMounted = useRef(true);
  const [historyList, setHistoryList] = useState([]);

  const history = useHistory();
  const [requestId, setRequestId] = useState("");

  const getHistory = (currPage_, rowsPerPage_, search_, status_) => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    const newData = [];
    var PATH = `/users/getuserhistory?order_by=createdAt&order=false&page=${currPage_}&limit=${rowsPerPage_}&filter_data=${status_}`;
    if (search_ !== "") PATH += "&search_data=" + search_;
    fetch(API_URL + PATH, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          const dataArray = response.data.data;

          for (var ind in dataArray) {
            const number = dataArray[ind].number ? dataArray[ind].number : "";
            const status = dataArray[ind].status ? dataArray[ind].status : "";

            const service = dataArray[ind].credit.services[0];

            const state = location.filter((o)=>o.short_name===service.state)[0]
            newData.push({
              service_id: service.service_id,
              request_id: dataArray[ind]._id,
              website: service.name,
              custom_name: service.custom_name,
              state:  state===undefined?"":state.name + ", "+state?.short_name,
              number: number,
              requestTime: convertToEDT(
                new Date(dataArray[ind].createdAt).getTime()
              ),
              charge: service.credit,
              is_ltr: dataArray[ind].is_ltr,
              ltr_credits: service.ltr_price,
              ltr_autorenew: dataArray[ind].ltr_autorenew,
              status: status,
              whole_data: dataArray[ind],
            });
          }

          if (isComponentMounted.current) {
            setTotalLength(response.data.totaltransaction);
            setHistoryList(newData);
            setLoading(false);
          }
        } else {
          setHistoryList([]);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const [totalLength, setTotalLength] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageData[0]);
  const [currPage, setCurrPage] = useState(0);
  const [currPageData, setCurrPageData] = useState([defaultPage]);
  const [search, setSearch] = useState("");
  const statusData = [
    { name: "ALL", value: "ALL" },
    { name: "RESERVED", value: "RESERVED" },
    { name: "TIMEOUT", value: "TIMEOUT" },
    { name: "FLAGGED", value: "FLAGGED" },
    { name: "COMPLETED", value: "COMPLETED" },
    { name: "OUT OF STOCK", value: "OUT_OF_STOCK" },
  ];
  const [status, setStatus] = useState(statusData[0]);

  useEffect(() => {
    isComponentMounted.current = true;
    const rowsPerPage_ = isJson(localStorage.getItem("rowsPerPage"))
      ? JSON.parse(localStorage.getItem("rowsPerPage"))
      : rowsPerPageData[0];

    setCurrPage(0);
    setRowsPerPage(rowsPerPage_);
    setSearch("");
    getHistory(1, rowsPerPage_.value, "", status.value);

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState("");

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
    await fetch(API_URL + `/users/expirenumber`, requestOptions);
  };
  const removeSame = async (requestId, mdn, serviceName) => {
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    await fetch(API_URL + "/users/activenumber", requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        for (var ind in response.data) {
          const data = response.data[ind];
          const first_service = response.data[ind].credit.services[0];

          const active_request_id = data._id;
          const active_name = first_service.name;
          const active_number = data.number;

          if (
            active_number === mdn &&
            active_request_id !== requestId &&
            active_name === serviceName
          ) {
            await deleteService(requestId, serviceName);
          }
        }
      });
  };
  const reClaimNumber = async (serviceName, service_id, requestId, mdn) => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceId: service_id,
        mdn: mdn.toString(),
      }),
    };
    fetch(API_URL + "/autoservices/reactivate", requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        if (response.success) {
          await removeSame(requestId, mdn, serviceName);

          setCurrPage(0);
          setRowsPerPage(rowsPerPageData[0]);
          setSearch("");
          getHistory(1, rowsPerPageData[0].value, "", statusData[0].value);

          setRequestId(response.data.data.data._id);

          setShowModal(true);
          setMsg("You have successfully reclaimed the number!");
        } else {
          setShowModal(true);
          setMsg("Reclaiming this number is not available anymore!");
        }
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

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

  return (
    <>
      <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 bg-transparent">
        <ToolBox
          rowsPerPage={rowsPerPage}
          rowsPerPageData={rowsPerPageData}
          onRowsPerPageChange={(selectedRowsPerPage) => {
            setCurrPage(0);
            setRowsPerPage(selectedRowsPerPage);
            getHistory(1, selectedRowsPerPage.value, search, status.value);
          }}
          search={search}
          onSearchChange={(data) => {
            setCurrPage(0);
            setSearch(data);
            getHistory(1, rowsPerPage.value, data, status.value);
          }}
          isStatus={true}
          selectedStatus={status}
          statusData={statusData}
          onStatusChange={(selectedStatus) => {
            setCurrPage(0);
            setStatus(selectedStatus);
            getHistory(1, rowsPerPage.value, search, selectedStatus.value);
          }}
        />

        <div className="overflow-scroll rounded-top">
          <table className="table box-shadow-gray history-table">
            <thead>
              <tr className="text-left">
                <th className="text-left align-left">Type</th>
                <th className="text-left align-left">Services</th>
                <th className="text-left align-left">Location</th>
                <th className="text-left align-left">Numbers</th>
                <th className="text-left align-left">SMS</th>
                <th className="text-left align-left">Request Time</th>
                <th className="text-left align-left">Reclaim</th>
                <th className="text-left align-left">Before Cr.</th>
                <th className="text-left align-left">Credits</th>
                <th className="text-left align-left">After Cr.</th>
                <th className="text-left align-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyList &&
                historyList.map((request, index) => (
                  <tr className="text-left" key={index}>
                    <td className="f-16 text-primary text-left align-left text-capitalize">
                      {request.is_ltr ? "LTR" : "STR"}
                    </td>
                    <td className="f-16 text-primary text-left align-left text-capitalize">
                      {/* {request.website} ({request.custom_name}) */}
                      {request.custom_name ? request.custom_name :request.website}
                    </td>
                    <td className="f-16 text-primary text-left align-left text-capitalize">
                      { request.state === undefined ? "" :request.state }
                    </td>
                    <td className="f-16 text-primary text-left align-left text-capitalize">
                      {request.number
                        ? "+" +
                          request.number.toString()[0] +
                          " " +
                          request.number.toString().substr(1)
                        : ""}
                    </td>
                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {/* {request.sms} */}
                      { (request.whole_data.credit.services.length > 1 && request.status === "RESERVED") ||
                      (request.whole_data.credit.services.length >  0 && request.status === "COMPLETED") ? (
                        <Link
                          className="btn bg-dark-blue text-white"
                          to={{
                            pathname: "/client/view/" + request.request_id,
                            state: {
                              service: request.whole_data,
                            },
                          }}
                        >
                          View
                        </Link>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {request.requestTime}
                    </td>
                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {request.is_ltr ? (
                        <></>
                      ) : // request.status === "RESERVED"
                      // ?
                      // <CustomizedSwitches
                      //     checked = {request.ltr_autorenew}
                      //     onChange = {async () => {
                      //       autoRenew(request.ltr_autorenew,request.website, request.service_id, request.request_id, request.number);
                      //     }}
                      //     disabled = {request.status !== 'RESERVED'}
                      // />
                      // :
                      // <></>
                      // )
                      request.status === "COMPLETED" ? (
                        <button
                          className="btn bg-dark-blue text-white"
                          onClick={() => {
                            reClaimNumber(
                              request.website,
                              request.service_id,
                              request.request_id,
                              request.number
                            );
                          }}
                          disabled={request.status !== "COMPLETED"}
                        >
                          Reclaim
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>

                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {request.whole_data.old_credit || request.whole_data.old_credit === 0? `$${parseFloat(request.whole_data.old_credit).toFixed(2)}`:"" }                      
                    </td>
                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {(request.is_ltr && request.status === "RESERVED") ||
                      (!request.is_ltr && request.status === "COMPLETED")
                        ? request.is_ltr
                          ? `$${parseFloat(request.ltr_credits).toFixed(2)}`
                          : `$${parseFloat(request.charge).toFixed(2)}`
                        : ""}
                    </td>
                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {(request.whole_data.old_credit || request.whole_data.old_credit === 0 ) && request.whole_data.status === "COMPLETED" ? `$${parseFloat(request.whole_data.old_credit - ((request.is_ltr && request.status === "RESERVED") ||
                      (!request.is_ltr && request.status === "COMPLETED")
                        ? request.is_ltr
                          ? request.ltr_credits
                          : request.charge
                        : "")).toFixed(2)}` :""}
                    </td>
                    <td className="f-16  text-primary ">
                      <div
                        className={`status status-${request.status.toLowerCase()}`}
                      >
                        {removeUnderScroll(request.status)}
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
            getHistory(
              selectedPage + 1,
              rowsPerPage.value,
              search,
              status.value
            );
          }}
        />
      </div>
      <ReclaimModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCurrPage(0);
          setRowsPerPage(rowsPerPageData[0]);
          setSearch("");
          getHistory(1, rowsPerPageData[0].value, "", statusData[0]);
        }}
        msg={msg}
        onOk={async () => {
          if (msg === "You have successfully reclaimed the number!") {
            setLoading(true);
            history.push({
              pathname: "/client/request/" + requestId
            });
          } else {
            setShowModal(false);
            getHistory(currPage + 1, rowsPerPage.value, search, status.value);
          }
        }}
      />
    </>
  );
}

export default History;
