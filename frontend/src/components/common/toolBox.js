import React, { useEffect, useState } from "react";
import DropDown from "./dropdown";
import search_2 from "../../images/search_2.png";

function ToolBox(props) {
  useEffect(() => {
    setSearchVal(props.search);
  }, [props]);
  const [searchVal, setSearchVal] = useState(props.search);
  return (
    <div className="column-content d-flex jc-sb mb-4">
      <div className="tool-box d-flex ai-center jc-center">
        <p className="f-14 mb-0 pr-lg-3 pr-2 text-primary">Show</p>
        <DropDown
          width="100px"
          value={props.rowsPerPage}
          data={props.rowsPerPageData}
          onChange={(value) => {
            props.onRowsPerPageChange(value);
            localStorage.setItem("rowsPerPage", JSON.stringify(value));
          }}
          message=""
        />
        {props.isStatus ? (
          <>
            <p className="f-14 mb-0 pr-lg-3 pr-2 text-primary">Status</p>
            <DropDown
              width="170px"
              value={props.selectedStatus}
              data={props.statusData}
              onChange={(value) => {
                props.onStatusChange(value);
                localStorage.setItem("status", JSON.stringify(value));
              }}
              message=""
            />
          </>
        ) : (
          <></>
        )}
      </div>
      <div
        className="d-flex"
        style={{ marginRight: "0px", flexDirection: "row" }}
      >
        <div className="search-box" style={{ paddingRight: "0px" }}>
          <input
            value={searchVal}
            type="text"
            placeholder="Search"
            className="f-14"
            onChange={(e) => {
              setSearchVal(e.target.value);
              if (e.target.value === "") {
                props.onSearchChange("");
                localStorage.setItem("search", "");
              }
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                props.onSearchChange(searchVal);
                localStorage.setItem("search", searchVal);
              }
            }}
          />
        </div>
        <div
          className="btn searchBtn bg-dark-blue text-white"
          onClick={() => {
            props.onSearchChange(searchVal);
            localStorage.setItem("search", searchVal);
          }}
        >
          <img
            style={{ height: "20px", width: "20px" }}
            alt=""
            src={search_2}
          />
        </div>
      </div>
    </div>
  );
}

export default ToolBox;
