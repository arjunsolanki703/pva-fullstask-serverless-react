import { API_URL, isJson, rowsPerPageData } from "../common/CONST";
import { Link, Redirect } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import AreYouSure from "../Modals/AreYouSure";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Pagination from "../common/pagination";
import ToolBox from "../common/toolBox";
import isAuthorized from "../common/Auth";

const defaultPage = { name: 1, value: 0, active: false };

function WebsiteContainer({ setLoading }) {
  const editAction = {
    actionName: "Edit",
    actionIcon: EditIcon,
    actionIconColor: "green",
    link: "/admin/website/update",
  };
  const deleteAction = {
    actionName: "Delete",
    actionIcon: DeleteIcon,
    actionIconColor: "red",
  };

  const [websiteList, setWebsiteList] = useState([]);

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
    var API = `/admin/getWebsite?order_by=name&order=true&page=${currPage_}&limit=${rowsPerPage_}`;
    if (status_ === "ENABLE") {
      API += "&filter_data=true";
    } else if (status_ === "DISABLE") {
      API += "&filter_data=false";
    }
    if (search_ !== "") {
      API += `&search_data=${search_}`;
    }

    fetch(API_URL + API, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          const newWebsiteList = [];
          const dataArray = response.data.data;
          for (var ind in dataArray) {
            const data = dataArray[ind];
            newWebsiteList.push({
              id: data._id,
              name: data.name,
              custom_name: data.custom_name,
              ltr_price: data.ltr_price,
              credit: data.credit,
              enable: data.enable,
              tellabot: data.tellabot,
              agent_accept_time: data.agent_accept_time,
              agent_handle_request: data.agent_handle_request,
              is_price_surge: data.is_price_surge,
              price_after_surge: data.price_after_surge,
              enable_ltr:data.enable_ltr
            });
          }

          if (isComponentMounted.current) {
            setTotalLength(response.data.totalwebsite);
            setWebsiteList(newWebsiteList);
            setLoading(false);
          }
        }
      })
      .catch((err) => setLoading(false));
  };

  const deleteWebsite = (website) => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/admin/deletewebsite/" + website.id, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setCurrPage(0);
          setSearch("");
          getWebsites(1, rowsPerPage.value, "");
        }
        setLoading(false);
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

    if (isComponentMounted.current) setCurrPageData(newCurrPageData);
  }, [currPage, rowsPerPage, totalLength]);

  const [clickedWebsite, setClickedWebsite] = useState(-1);
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
            getWebsites(1, selectedRowsPerPage.value, search, status.value);
          }}
          search={search}
          onSearchChange={(data) => {
            setCurrPage(0);
            setSearch(data);
            getWebsites(1, rowsPerPage.value, data, status.value);
          }}
          isStatus={true}
          selectedStatus={status}
          statusData={statusData}
          onStatusChange={(selectedStatus) => {
            setCurrPage(0);
            setStatus(selectedStatus);
            getWebsites(1, rowsPerPage.value, search, selectedStatus.value);
          }}
        />
        <div className="d-flex jc-end ai-center mb-lg-4 mb-md-4 mb-3">
          <Link
            to="/admin/website/add"
            className="btn btn-lg px-5 bg-dark-blue text-white"
          >
            Add
          </Link>
        </div>

        <div className="overflow-scroll rounded-top">
          <table className="table box-shadow-gray">
            <thead>
              <tr className="text-left">
                <th className="text-left align-left">Websites</th>
                <th className="text-left align-left">Tellabot</th>
                <th className="text-left align-left">Short Term Credits</th>
                <th className="text-left align-left">Status[STR]</th>
                <th className="text-left align-left">Long Term Credits</th>
                <th className="text-left align-left">Status[LTR]</th>
                <th className="text-left align-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {websiteList &&
                websiteList.map((website, index) => (
                  <tr className="text-left" key={index}>
                    <td className="f-16 text-primary text-left align-left ">
                      {website.custom_name}
                    </td>
                    <td className="f-16 text-primary text-left align-left ">
                      {website.name}
                    </td>

                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {website.credit}
                    </td>
                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {website.enable ? "Enable" : "Disable"}
                    </td>
                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {website.ltr_price}
                    </td>

                    <td className="f-16  text-primary text-left align-left text-capitalize">
                      {website.enable_ltr? "Enable" : "Disable"}
                    </td>
                    <td className="f-16 text-primary text-left align-left text-capitalize">
                      <div className=" d-flex jc-left ai-left ">
                        <Link
                          className="px-2"
                          to={{
                            pathname: `${editAction.link}/${website.id}`,
                            state: {
                              website: website,
                            },
                          }}
                        >
                          <editAction.actionIcon
                            className={`p-lg-0 p-md-0 p-1  status-${editAction.actionName}`}
                            style={{ color: `${editAction.actionIconColor}` }}
                          />
                        </Link>

                        <deleteAction.actionIcon
                          className={`p-lg-0 p-md-0 p-1  status-${deleteAction.actionName}`}
                          style={{
                            color: `${deleteAction.actionIconColor}`,
                            cursor: "pointer",
                          }}
                          onClick={(e) => setClickedWebsite(index)}
                        />
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
            getWebsites(
              selectedPage + 1,
              rowsPerPage.value,
              search,
              status.value
            );
          }}
        />
      </div>
      <AreYouSure
        title={"Delete Website"}
        show={clickedWebsite >= 0}
        onHide={() => {
          setClickedWebsite(-1);
        }}
        onOk={() => {
          deleteWebsite(websiteList[clickedWebsite]);
          setClickedWebsite(-1);
        }}
      />
    </>
  );
}

export default WebsiteContainer;
