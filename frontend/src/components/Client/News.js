import React, { useEffect, useRef, useState } from "react";
import ToolBox from "../common/toolBox";
import Pagination from "../common/pagination";
import {
  API_URL,
  convertToEDT,
  isJson,
  rowsPerPageData,
} from "../common/CONST";
import isAuthorized from "../common/Auth";
import { Redirect } from "react-router-dom";
const defaultPage = { name: 1, value: 0, active: false };

function News({ setLoading }) {
  const isComponentMounted = useRef(true);
  const [newsList, setNewsList] = useState([]);
  const [openId, setOpenId] = useState("");

  const getNews = (currPage_, rowsPerPage_, search_) => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    const newData = [];
    var PATH = `/news/get?order_by=createdAt&order=false&page=${currPage_}&limit=${rowsPerPage_}`;
    if (search_ !== "") PATH += "&search_data=" + search_;
    fetch(API_URL + PATH, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          const dataArray = response.data.data;

          for (var ind in dataArray) {
            newData.push({
              ...dataArray[ind],
            });
          }

          if (isComponentMounted.current) {
            setTotalLength(response.data.totalNews);
            setNewsList(newData);
            setLoading(false);
          }
        } else {
          setNewsList([]);
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

  useEffect(() => {
    isComponentMounted.current = true;
    const rowsPerPage_ = isJson(localStorage.getItem("rowsPerPage"))
      ? JSON.parse(localStorage.getItem("rowsPerPage"))
      : rowsPerPageData[0];

    setCurrPage(0);
    setRowsPerPage(rowsPerPage_);
    setSearch("");
    getNews(1, rowsPerPage_.value, "");

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
  if (!isAuthorized()) {
    return <Redirect to="/" />;
  }
  return (
    <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 bg-transparent">
      <ToolBox
        rowsPerPage={rowsPerPage}
        rowsPerPageData={rowsPerPageData}
        onRowsPerPageChange={(selectedRowsPerPage) => {
          setCurrPage(0);
          setRowsPerPage(selectedRowsPerPage);
          getNews(1, selectedRowsPerPage.value, search);
        }}
        search={search}
        onSearchChange={(data) => {
          setCurrPage(0);
          setSearch(data);
          getNews(1, rowsPerPage.value, data);
        }}
      />

      <div className="overflow-scroll rounded-top">
        <table className="table box-shadow-gray history-table">
          <thead>
            <tr className="text-left">
              <th className="text-left align-left " style={{ width: "80%" }}>
                News
              </th>
              <th className="text-left align-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {newsList &&
              newsList.map((news, index) => (
                <tr className="text-left" key={index}>
                  <td
                    className="f-16 text-primary text-left align-left capital news-title bold"
                    onClick={() => {
                      if (openId === index) setOpenId("");
                      else setOpenId(index);
                    }}
                  >
                    {news.title}
                    <div className="mt-2 capital" dangerouslySetInnerHTML={{
                        __html: news.description,
                      }} style={{ fontWeight: "normal",paddingLeft:"20px" }}>
                      </div> 
                  </td>
                  <td className="f-16 text-primary text-left align-left text-capitalize alignTD bold">
                    {convertToEDT(new Date(news.createdAt).getTime())}
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
          getNews(selectedPage + 1, rowsPerPage.value, search);
        }}
      />
    </div>
  );
}

export default News;
