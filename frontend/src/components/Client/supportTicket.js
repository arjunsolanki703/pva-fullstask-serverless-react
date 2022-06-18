import React, { useEffect, useState } from "react";

import { API_URL } from "../common/CONST";
import Loader from "../common/Loader";
import ReCAPTCHA from "react-google-recaptcha";
import { Redirect } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
function SupportTicket(props) {
  const SITE_KEY = "6Le2F9IbAAAAAOcJyc4wy7B5_G3L_CdDV7KEEpyD";
  const recaptchaRef = React.createRef();
  const [loading, setLoading] = useState(false);
  const [token, settoken] = useState("");
  const [subject, setsubject] = useState("");
  const [message, setmessage] = useState("");
  const [cansubmit, setcansubmit] = useState(false);

  const canSubmit = () => {
    if (subject !== "" && message !== "") {
      setcansubmit(true);
    } else {
      setcansubmit(false);
    }
  };

  const create_ticket = async () => {
    setLoading(true)
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: subject,
        message: message,
        recaptcha: token,
      }),
    };
    await fetch(API_URL + "/ticket/create-ticket", requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        settoken("");
        setsubject("");
        setmessage("");
        setLoading(false);
        // <Redirect to="/client/open-ticket" />
        props.history.push('/client/open-ticket')
      });
  };

  return (
    <>
      {loading ? <Loader /> : ""}
      <div className="content-wrapper" style={{ overflow: "visible" }}>
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-5 py-4 bg-white border-radius-10 box-shadow-gray">
          <h4 className="f-20 fw-600">Subject</h4>
          <div className="form-group">
            <div className="row my-4">
              <div className="col-12">
                <input
                  className="form-control mt-2 h-5"
                  value={subject}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setsubject("");
                      return;
                    } else {
                      setsubject(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-5 py-4 bg-white border-radius-10 box-shadow-gray">
          <h4 className="f-20 fw-600">Write Message</h4>
          <div className="form-group">
            <div className="row my-4">
              <div className="col-12">
                <CKEditor
                  editor={ClassicEditor}
                  data={message}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    if (data === "") {
                      setmessage("");
                      return;
                    } else {
                      setmessage(data);
                    }
                  }}
                config={{
                //   toolbar: [
                //     "heading",
                //     "|",
                //     "bold",
                //     "italic",
                //     "link",
                //     "bulletedList",
                //     "numberedList",
                //     "blockQuote",
                //     "ckfinder",
                //     "|",
                //     "imageTextAlternative",
                //     "imageUpload",
                //     "imageStyle:full",
                //     "imageStyle:side",
                //     "|",
                //     "mediaEmbed",
                //     "insertTable",
                //     "tableColumn",
                //     "tableRow",
                //     "mergeTableCells",
                //     "|",
                //     "undo",
                //     "redo"
                //   ]
                link : {
                  addTargetToExternalLinks: true
                }
                }}
                />
                {/* <textarea
                  style={{ minHeight: "190px", resize: "none" }}
                  className="form-control mt-2 h-5"
                  value={message}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setmessage("");
                      return;
                    } else {
                      setmessage(e.target.value);
                    }
                  }}
                /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-2 py-2  border-radius-10 ">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={SITE_KEY}
            onChange={(token) => {
              settoken(token);
              canSubmit();
            }}
            onExpired={() => {
              settoken("");
              canSubmit();
            }}
          />
        </div>
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-2 py-2  border-radius-10 ">
          <div className="col-lg-3 col-md-3 col-12 px-0 py-0">
            <button
              style={{ padding: "0" }}
              className={
                "btn mt-lg-0 mt-md-0 mt-3 text-white w-100 h-5 bg-dark-blue"
                // +(isOk ? "bg-dark-blue" : "btn-danger")
              }
              onClick={create_ticket}
              disabled={!token || !message || !subject}
            >
              Submit Ticket
              {/* <span className="ml-1">{`(-${selected_type === "long" ? selected.ltr_price : selected.credit
                })`}</span> */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupportTicket;
