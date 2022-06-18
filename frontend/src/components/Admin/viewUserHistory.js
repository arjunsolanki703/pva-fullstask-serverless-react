import React, { useState, useEffect, useRef } from "react";
import ToolBox from "../common/toolBox";
import Pagination from "../common/pagination";
import {
  API_URL,
  rowsPerPageData,
  convertToEDT,
  removeUnderScroll,
  isJson,
} from "../common/CONST";
import { Link, Redirect } from "react-router-dom";
import isAuthorized from "../common/Auth";
import { location } from "../Client/locations";

const defaultPage = { name: 1, value: 0, active: false };

function ViewUserHistory({ id, setLoading }) {
  const isComponentMounted = useRef(true);

  const [historyList, setHistoryList] = useState([]);
  const getUserHistory = (currPage_, rowsPerPage_, search_, status_) => {
    setLoading(true);
    if (id === 0) return;
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    var API = `/admin/gethistorybyID?userid=${id}&page=${currPage_}&limit=${rowsPerPage_}&filter_data=${status_}&order_by=createdAt&order=false`;
    if (search_ !== "") {
      API += `&search_data=${search_}`;
    }

    fetch(API_URL + API, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          const newHistory = [];
          const dataArray = response.data.data;
          for (var ind in dataArray) {
            const service = dataArray[ind].credit.services[0];
            const state = location.filter((o)=>o.short_name===service.state)[0]
            newHistory.push({
              agent: "boat",
              customer: dataArray[ind].user_name,
              is_ltr: dataArray[ind].is_ltr,
              website: service.name,
              custom_name: service.custom_name,
              state: state===undefined?"":state.name + ", "+state?.short_name,
              charge: service.credit,
              ltr_credits: service.ltr_price,
              number: dataArray[ind].number ? dataArray[ind].number : "",
              requestTime: convertToEDT(
                new Date(dataArray[ind].createdAt).getTime()
              ),
              status: dataArray[ind].status,
              service_id: service.service_id,
              request_id: dataArray[ind]._id,
              whole_data: dataArray[ind],
            });
          }
          if (isComponentMounted.current) {
            setTotalLength(response.data.totaltransaction);
            setHistoryList(newHistory);
            setLoading(false);
          }
        } else {
        }
      })
      .catch((err) => setLoading(false));
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
    getUserHistory(1, rowsPerPage_.value, "", statusData[0].value);

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
            getUserHistory(1, selectedRowsPerPage.value, search, status.value);
          }}
          search={search}
          onSearchChange={(data) => {
            setCurrPage(0);
            setSearch(data);
            getUserHistory(1, rowsPerPage.value, data, status.value);
          }}
          isStatus={true}
          selectedStatus={status}
          statusData={statusData}
          onStatusChange={(selectedStatus) => {
            setCurrPage(0);
            setStatus(selectedStatus);
            getUserHistory(
              1,
              rowsPerPage.value,
              search,
              selectedStatus.value,
              selectedStatus.value
            );
          }}
        />
        <div>
          <div className="overflow-scroll rounded-top">
            <table className="table box-shadow-gray">
              <thead>
                <tr className="text-left">
                  <th className="text-left align-left">Services</th>
                  <th className="text-left align-left">Location</th>
                  <th className="text-left align-left">Numbers</th>
                  <th className="text-left align-left">Type</th>
                  <th className="text-left align-left">SMS</th>
                  <th className="text-left align-left">Requested At</th>
                  <th className="text-left align-left">Before Cr.</th>
                  <th className="text-left align-left">Credit</th>
                  <th className="text-left align-left">After Cr.</th>
                  <th className="text-left align-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyList &&
                  historyList.map((request, index) => (
                    <tr className="text-left" key={index}>
                      <td className="f-16 text-primary text-left align-left">
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
                      <td className="f-16 text-primary text-left align-left text-capitalize">
                        {request.is_ltr ? "LTR" : "STR"}
                      </td>
                      <td className="f-16 text-primary text-left align-left text-capitalize">
                        {(request.whole_data.credit.services.length > 1 && request.status === "RESERVED") ||
                      (request.whole_data.credit.services.length >  0 && request.status === "COMPLETED") ? (
                          <Link
                            className="btn bg-dark-blue text-white"
                            to={{
                              pathname: "/admin/view/" + request.request_id,
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
                      <td className="f-16 text-primary text-left align-left ">
                        {request.requestTime}
                      </td>
                      <td className="f-16 text-primary text-left align-left text-capitalize">
                      {request.whole_data.old_credit || request.whole_data.old_credit === 0? `$${parseFloat(request.whole_data.old_credit).toFixed(2)}`:"" }
                      </td>
                      <td className="f-16 text-primary text-left align-left text-capitalize">
                        {(request.is_ltr && request.status === "RESERVED") ||
                        (!request.is_ltr && request.status === "COMPLETED")
                          ? request.is_ltr
                          ? `$${parseFloat(request.ltr_credits).toFixed(2)}`
                          : `$${parseFloat(request.charge).toFixed(2)}`
                          : ""}
                      </td>
                      <td className="f-16 text-primary text-left align-left text-capitalize">
                      {(request.whole_data.old_credit || request.whole_data.old_credit === 0 ) && request.whole_data.status === "COMPLETED" ? `$${parseFloat(request.whole_data.old_credit - ((request.is_ltr && request.status === "RESERVED") ||
                      (!request.is_ltr && request.status === "COMPLETED")
                        ? request.is_ltr
                          ? request.ltr_credits
                          : request.charge
                        : "")).toFixed(2)}` :""}
                      </td>
                      <td className="f-16  text-primary text-left align-left text-capitalize">
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
        </div>
        <Pagination
          value={currPage}
          data={currPageData}
          onClick={(selectedPage) => {
            setCurrPage(selectedPage);
            getUserHistory(
              selectedPage + 1,
              rowsPerPage.value,
              search,
              status.value
            );
          }}
        />
      </div>
    </>
  );
}

export default ViewUserHistory;
