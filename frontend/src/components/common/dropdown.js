import React, { useState } from "react";
import downArrow from "../../images/close_more_24px.png";
import upArrow from "../../images/expand_more_24px.png";

function DropDown(props) {
  const [open, setOpen] = useState(false);

  const handleSelectedItem = (selected) => {
    setOpen(false);
    if (props.onChange) props.onChange(selected);
  };

  return (
    <>
      <div
        className="container bg-transparent"
        tabIndex="0"
        onBlur={() => setOpen(false)}
      >
        <div className="dropdown-container" style={{ width: props.width }}>
          <div
            className={`dropdown-selected ${open ? "active" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <div>
              {props.value.name +
                (props.value.available
                  ? " (" + props.value.available + ")"
                  : "")}
            </div>
            {open ? (
              <div>
                <img alt="" src={downArrow} className="padding-left"/>
              </div>
            ) : (
              <div>
                <img alt="" src={upArrow} className="padding-left"/>
              </div>
            )}
          </div>
          {open && (
            <div className="dropdown-options" style={{ width: props.width }}>
              {props.data &&
                props.data.map((item, index) =>
                  item.enable === undefined || item.enable ? (
                    <div
                      className="dropdown-option"
                      key={index}
                      onClick={() => handleSelectedItem(item)}
                    >
                      {item.name +
                        (item.available ? " (" + item.available + ")" : "")}
                    </div>
                  ) : (
                    <div
                      className="dropdown-option-disabled"
                      key={index}
                      style={{ color: "gray" }}
                    >
                      {item.name +
                        (item.available ? " (" + item.available + ")" : "")}
                    </div>
                  )
                )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DropDown;
