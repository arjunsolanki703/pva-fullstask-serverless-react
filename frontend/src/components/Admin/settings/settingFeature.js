import React from "react";
import { Link } from "react-router-dom";

function SettingFeature(props) {
  return (
    <div>
      <div className="d-flex ai-center jc-sb px-lg-3 px-2 py-4">
        <div>{props.title}</div>
        <div>
          <Link to={props.link} className={props.linkClass}>
            {props.btnTitle}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SettingFeature;
