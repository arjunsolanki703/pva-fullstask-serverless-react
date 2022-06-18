import React, { useEffect, useRef, useState } from "react";
import ToolBox from "../common/toolBox";
import Pagination from "../common/pagination";
import {
  API_URL,
  convertToEDT,
  isJson,
  rowsPerPageData,
} from "../common/CONST";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import isAuthorized from "../common/Auth";
import AreYouSure from "../Modals/AreYouSure";
import { Link, Redirect } from "react-router-dom";
const defaultPage = { name: 1, value: 0, active: false };
const deleteAction = {
  actionName: "Delete",
  actionIcon: DeleteIcon,
  actionIconColor: "red",
};
const editAction = {
  actionName: "Edit",
  actionIcon: EditIcon,
  actionIconColor: "green",
};

function News({ setLoading }) {
  const isComponentMounted = useRef(true);
  const [newsList, setNewsList] = useState([]);
  const [openId, setOpenId] = useState("");
  const [selectedNewsId, setSelectedNewsId] = useState(-1);

  const deleteNews = async (newsId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: newsId,
      }),
    };
    await fetch(API_URL + "/news/delete", requestOptions);
    const rowsPerPage_ = isJson(localStorage.getItem("rowsPerPage"))
      ? JSON.parse(localStorage.getItem("rowsPerPage"))
      : rowsPerPageData[0];

    setCurrPage(0);
    setRowsPerPage(rowsPerPage_);
    setSearch("");
    getNews(1, rowsPerPage_.value, "");
  };

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
              id: dataArray[ind]._id,
              title: dataArray[ind].title,
              description: dataArray[ind].description,
              createdAt: dataArray[ind].createdAt,
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
    <>
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
        <div className="d-flex jc-end  ai-center mb-lg-4 mb-md-4 mb-3">
          <Link
            to={{ pathname: "/admin/news/add", state: { isAddMode: true } }}
            className="btn btn-lg px-5 bg-dark-blue text-white"
          >
            Add
          </Link>
        </div>
        <div className="overflow-scroll rounded-top">
          <table className="table box-shadow-gray history-table">
            <thead>
              <tr className="text-left">
                <th className="text-left align-left " style={{ width: "80%" }}>
                  News
                </th>
                <th className="text-left align-left">Time</th>
                <th className="text-left align-left">Action</th>
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
                    <td className="f-16 text-primary text-left align-left capital alignTD bold">
                      {convertToEDT(new Date(news.createdAt).getTime())}
                    </td>
                    <td className="f-16 text-primary text-left align-left capital">
                      <div className=" d-flex jc-left ai-left ">
                        <Link
                          className="px-2"
                          to={{
                            pathname: `/admin/news/update/${news.id}`,
                            state: {
                              isAdd: false,
                              data: news,
                            },
                          }}
                        >
                          <editAction.actionIcon
                            className={{
                              pathname: `p-lg-0 p-md-0 p-1  status-${editAction.actionName}`,
                              state: { isAddMode: false },
                            }}
                            style={{ color: `${editAction.actionIconColor}` }}
                          />
                        </Link>

                        <deleteAction.actionIcon
                          className={`p-lg-0 p-md-0 p-1  status-${deleteAction.actionName}`}
                          style={{
                            color: `${deleteAction.actionIconColor}`,
                            cursor: "pointer",
                          }}
                          onClick={(e) => setSelectedNewsId(index)}
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
            getNews(selectedPage + 1, rowsPerPage.value, search);
          }}
        />
      </div>
      <AreYouSure
        title={"Delete News"}
        show={selectedNewsId >= 0}
        onHide={() => setSelectedNewsId(-1)}
        onOk={() => {
          deleteNews(newsList[selectedNewsId].id);
          setSelectedNewsId(-1);
        }}
      />
    </>
  );
}

export default News;
