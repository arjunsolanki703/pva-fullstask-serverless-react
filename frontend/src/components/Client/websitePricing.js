import React, { useState, useEffect, useRef } from "react";
import Pagination from "../common/pagination";
import ToolBox from "../common/toolBox";
import { API_URL, rowsPerPageData, isJson } from "../common/CONST";

const defaultPage = { name: 1, value: 0, active: false };

function WebsitePricing({ setLoading }) {
  const [websites, setWebsites] = useState([]);

  const isComponentMounted = useRef(true);

  const getWebsites = (currPage_, rowsPerPage_, search_, status_) => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    var PATH = `/tellabot-services/get/all?order_by=name&order=true&page=${currPage_}&limit=${rowsPerPage_}`;
    if (search_ !== "") PATH += "&search_data=" + search_;

    fetch(API_URL + PATH, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        var newWebsites = [];

        const data_array = response.data.data;
        for (var ind in data_array) {
          const data = data_array[ind];
          if (data.enable)
            newWebsites.push({
              name: data.name,
              custom_name: data.custom_name,
              credits: data.credit,
              ltr_credits: data.ltr_price,
              value: data._id,
            });
        }

        if (isComponentMounted.current) {
          setTotalLength(response.data.totalwebsite);
          setWebsites(newWebsites);
          setLoading(false);
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
    { name: "Enable", value: "ENABLE" },
    { name: "Disable", value: "DISABLE" },
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
    getWebsites(1, rowsPerPage_.value, "", status.value);

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

    if (isComponentMounted.current) {
      setCurrPageData(newCurrPageData);
    }
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
            getWebsites(1, selectedRowsPerPage.value, search, status.value);
          }}
          search={search}
          onSearchChange={(data) => {
            setCurrPage(0);
            setSearch(data);
            getWebsites(1, rowsPerPage.value, data, status.value);
          }}
          isStatus={false}
          selectedStatus={status}
          statusData={statusData}
          onStatusChange={(selectedStatus) => {
            setCurrPage(0);
            setStatus(selectedStatus);
            getWebsites(1, rowsPerPage.value, search, selectedStatus.value);
          }}
        />

        <table className="table box-shadow-gray">
          <thead>
            <tr className="text-left">
              <th className="col-4">Websites</th>
              {/* <th className="col-4">Custom Name</th> */}
              <th className="col-4">Short-Term Rental Charges</th>
              <th className="col-4">Long-Term Rental Charges</th>
              <th className="col-4">Long-Term Rental Extention Charges</th>
            </tr>
          </thead>
          <tbody>
            {websites &&
              websites.map((website) => (
                <tr className="text-left" key={website.name}>
                  {/* <td className="f-16 " style={{ width: "25%" }}>
                    {website.name}
                  </td> */}
                  <td className="f-16 " style={{ width: "25%" }}>
                    {website.custom_name ? website.custom_name :website.name}
                  </td>
                  <td className="f-16 " style={{ width: "25%" }}>
                    {website.credits}
                  </td>
                  <td className="f-16 " style={{ width: "25%" }}>
                    {website.ltr_credits}
                  </td>
                  <td className="f-16 " style={{ width: "25%" }}>
                    {website.ltr_credits - (0.25 * website.ltr_credits)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <Pagination
          value={currPage}
          data={currPageData}
          onClick={(selectedPage) => {
            setCurrPage(selectedPage);
            getWebsites(
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

export default WebsitePricing;
