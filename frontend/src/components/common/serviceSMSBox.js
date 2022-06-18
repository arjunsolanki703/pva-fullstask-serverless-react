import React from "react";
import CopyToClipboard from "./copyToClipboard";
import SMSImg from "../../images/SMS.png";

function ServiceSMSBox(props) {
  const code = props.sms;
  return (
    <>
      <div className="d-flex jc-center mb-lg-5 mb-md-5 mb-3 w-50 mx-auto">
        <div className="d-flex  ai-center bg-light-blue-one px-lg-5 px-md-5 pl-2 py-3 h-6 w-100 border-radius-6">
          <img
            alt=""
            src={SMSImg}
            className="ml-lg-3 ml-md-3 ml-0 mr-lg-5 mr-md-5 mr-4"
          />
          <p className="mb-0  ml-lg-5 ml-md-5 mr-lg-5 mr-md-5 mr-2 f-16 text-bright-blue text-nowrap fw-600">
            {code}
          </p>
        </div>
        <div className="ml-lg-3 ml-md-3 ml-2">
          <CopyToClipboard data={code} />
        </div>
      </div>
    </>
  );
}

export default ServiceSMSBox;
