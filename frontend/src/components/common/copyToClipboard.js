import React from "react";
import Copy from "../../images/copy 2 1.png";

function CopyToClipboard(props) {
  const data = props.data;
  const customStyle = {};
  if (props.height) {
    customStyle.height = parseInt(props.height) + 25;
  }
  if (props.width) {
    customStyle.width = parseInt(props.width) + 30;
  }
  return (
    <>
      <button
        className="btn-light-blue btn h-6 border-radius-6"
        style={customStyle}
        onClick={() => {
          const text = document.createElement("input");
          text.value = data;
          document.body.appendChild(text);
          text.select();
          text.setSelectionRange(0, 99999);
          document.execCommand("copy");
          text.remove();
        }}
      >
        <img
          src={Copy}
          width={props.width ? props.width : "30"}
          height={props.height ? props.height : "auto"}
          alt=""
        />
      </button>
    </>
  );
}

export default CopyToClipboard;
