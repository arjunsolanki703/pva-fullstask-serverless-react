import React from "react";
import right from "../../images/right.png";
import left from "../../images/left.png";

function Pagination(props) {
  const currPage = props.value;
  const data = props.data;
  const len = props.data.length;
  const thres = 2;

  const show = [];
  if (len > 2 * thres) {
    const dotPage = { name: "...", disabled: true };
    if (currPage < thres) {
      for (let ind = 0; ind < thres + (currPage === thres - 1 ? 1 : 0); ind++) {
        show.push(data[ind]);
      }
      show.push(dotPage);
      for (let ind = len - thres; ind < len; ind++) {
        show.push(data[ind]);
      }
    } else if (currPage >= thres && currPage < len - thres) {
      show.push(data[0]);
      show.push(dotPage);
      for (let ind = currPage - 1; ind <= currPage + 1; ind++) {
        show.push(data[ind]);
      }
      show.push(dotPage);
      show.push(data[len - 1]);
    } else {
      for (let ind = 0; ind < thres; ind++) {
        show.push(data[ind]);
      }
      show.push(dotPage);
      for (
        let ind = len - thres - (currPage === len - thres ? 1 : 0);
        ind < len;
        ind++
      ) {
        show.push(data[ind]);
      }
    }
  } else {
    for (let ind = 0; ind < len; ind++) {
      show.push(data[ind]);
    }
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={"page-item " + (currPage > 0 ? "" : "disabled")}>
          <div
            style={
              currPage > 0
                ? { cursor: "pointer" }
                : { opacity: "0.8", cursor: "no-drop" }
            }
          >
            <img
              height="38"
              className="page-link"
              onClick={() => {
                const newPage = currPage - 1;
                props.onClick(newPage);
                localStorage.setItem("currPage", newPage);
              }}
              src={left}
              alt="Previous"
            />
          </div>
        </li>
        {show.map((page, index) => (
          <li
            key={index}
            className={"page-item" + (page.active ? " active" : "")}
          >
            <button
              key={index}
              className="page-link"
              onClick={() => {
                props.onClick(page.value);
                localStorage.setItem("currPage", page.value);
              }}
              disabled={page.disabled}
            >
              {page.name}
            </button>
          </li>
        ))}
        <li
          className={
            "page-item " + (currPage < props.data.length - 1 ? "" : "disabled")
          }
        >
          <div
            style={
              currPage < props.data.length - 1
                ? { cursor: "pointer" }
                : { opacity: "0.8", cursor: "no-drop" }
            }
          >
            <img
              height="38"
              className="page-link"
              disabled={currPage < props.data.length - 1 ? "" : "disabled"}
              onClick={() => {
                const newPage = currPage + 1;
                props.onClick(newPage);
                localStorage.setItem("currPage", newPage);
              }}
              src={right}
              alt="Next"
            />
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
