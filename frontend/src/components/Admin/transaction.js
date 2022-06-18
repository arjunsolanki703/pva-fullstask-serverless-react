import {
  API_URL,
  convertToEDT,
  isJson,
  rowsPerPageData,
} from "../common/CONST";
import React, { useEffect, useRef, useState } from "react";

import Pagination from "../common/pagination";
import ToolBox from "../common/toolBox";

const defaultPage = { name: 1, value: 0, active: false };

function Transaction({ setLoading }) {
  const isComponentMounted = useRef(true);

  const [transactionList, setTransactionList] = useState([]);
  const getTransaction = (currPage_, rowsPerPage_, search_, status_) => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    var API = `/admin/getallpayments?order_by=createdAt&order=false&page=${currPage_}&limit=${rowsPerPage_}&filter_data=${status_}`;
    if (search_ !== "") {
      API += `&search_data=${search_}`;
    }

    fetch(API_URL + API, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          const newTransaction = [];

          const data = response.data.data;
          for (var ind in data) {
            newTransaction.push({
              order:
                response.data.totalusers -
                ((currPage_ - 1) * rowsPerPage_ + parseInt(ind)),
              txn_id: data[ind].txn_id,
              timestamp: convertToEDT(new Date(data[ind].createdAt).getTime()),
              name: data[ind].user_name ? data[ind].user_name : "",
              email: data[ind].user_email ? data[ind].user_email : "",
              product: data[ind].amount,
              total: "$" + data[ind].amount,
              currency: data[ind].currency,
              method: data[ind].payment_method ? data[ind].payment_method : "",
              status: data[ind].status,
              status_url: data[ind].status_url,
              by_admin: data[ind].is_by_admin,
              old_amount:data[ind].old_amount
            });
          }

          if (isComponentMounted.current) {
            setTotalLength(response.data.totalusers);
            setTransactionList(newTransaction);
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
    { name: "PAY", value: "INIT" },
    { name: "CANCELLED", value: "CANCELLED" },
    { name: "COMPLETED", value: "COMPLETE" },
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
    getTransaction(1, rowsPerPage_.value, "", statusData[0].value);

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

  const status_map = (status) => {
    if (status === "Cancelled / Timed Out") {
      return "CANCELLED";
    } else if (status === "Complete") {
      return "COMPLETED";
    } else {
      return "";
    }
  };
  const handlenumber = (number) => {
    var value = ""+number
    var update_value = value.replace("-","-$")
    return update_value;
  }
  return (
    <>
      <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 bg-transparent">
        <ToolBox
          rowsPerPage={rowsPerPage}
          rowsPerPageData={rowsPerPageData}
          onRowsPerPageChange={(selectedRowsPerPage) => {
            setCurrPage(0);
            setRowsPerPage(selectedRowsPerPage);
            getTransaction(1, selectedRowsPerPage.value, search, status.value);
          }}
          search={search}
          onSearchChange={(data) => {
            setCurrPage(0);
            setSearch(data);
            getTransaction(1, rowsPerPage.value, data, status.value);
          }}
          isStatus={true}
          selectedStatus={status}
          statusData={statusData}
          onStatusChange={(selectedStatus) => {
            setCurrPage(0);
            setStatus(selectedStatus);
            getTransaction(
              1,
              rowsPerPage.value,
              search,
              selectedStatus.value,
              selectedStatus.value
            );
          }}
        />
        <div className="overflow-scroll rounded-top">
          <table className="table box-shadow-gray admin-transaction">
            <thead>
              <tr className="text-left">
                <th className="text-left align-left">Transaction Id</th>
                <th className="text-left align-left">Date/Time</th>
                {/* <th className="text-left align-left">Customer Name</th> */}
                <th className="text-left align-left">Email Address</th>
                <th className="text-left align-left">Old Amount</th>
                <th className="text-left align-left">Amount</th>
                <th className="text-left align-left">New Amount</th>
                <th className="text-left align-left">Payment Mode</th>
                <th className="text-left align-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionList &&
                transactionList.map((transaction, index) => (
                  <tr className="text-left" key={index}>
                    <td className="f-16 text-primary text-left align-left">
                      {transaction.by_admin
                        ? "Created By Admin"
                        : transaction.txn_id}
                    </td>
                    <td className="f-16 text-primary text-left align-left">
                      {transaction.timestamp}
                    </td>
                    {/* <td className="f-16 text-primary text-left align-left">
                      {transaction.name}
                    </td> */}
                    <td className="f-16 text-primary text-left align-left ">
                      {transaction.email}
                    </td>
                    <td className="f-16 text-primary text-left align-left ">
                      {transaction.old_amount || transaction.old_amount === 0 ? `$${parseFloat(transaction.old_amount).toFixed(2)}`:""}
                    </td>
                    <td className="f-16 text-primary text-left align-left ">
                      {transaction.product < 0 ? handlenumber(transaction.product) : `$${parseFloat(transaction.product).toFixed(2)}`}
                    </td>
                    <td className="f-16 text-primary text-left align-left ">
                      {(transaction.old_amount || transaction.old_amount === 0 ) && transaction.status === "Complete" ? `$${parseFloat(transaction.old_amount+transaction.product).toFixed(2)}` :""}
                    </td>
                    <td className="f-16 text-primary text-left align-left ">
                      {transaction.currency}
                    </td>
                    <td className="f-16 text-primary text-left align-middle">
                      {transaction.status === "Waiting for buyer funds..." ||
                      transaction.status === "INIT" ? (
                        <div
                          className="status bg-dark-blue text-white"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            window.open(transaction.status_url);
                          }}
                        >
                          Check
                        </div>
                      ) : (
                        <div
                          className={
                            "status status-" +
                            (transaction.status === "Complete"
                              ? "complete"
                              : "timeout")
                          }
                        >
                          {status_map(transaction.status)}
                        </div>
                      )}
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
            getTransaction(
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

export default Transaction;
