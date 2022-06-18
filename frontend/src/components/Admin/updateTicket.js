import { API_URL, getRole } from "../common/CONST";
import React, { useEffect, useRef, useState } from "react";

import Loader from "../common/Loader";
import Navbar from "../common/navbar";
import { Redirect } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
function UpdateTicket(props) {
  const [loading, setLoading] = useState(false);
  const [ticket_data, setticket_data] = useState([]);
  const [message,setmessage]= useState("");
  const isComponentMounted = useRef(true);
  useEffect(() => {
    get_ticket_data();
  }, []);

  const get_ticket_data = async () => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.location.state.id,
      }),
    };
    await fetch(API_URL + "/ticket/find-ticket", requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        if (response.success) {
          if (isComponentMounted.current) {
            setLoading(false);
            setticket_data(response.data.data);
            // setticket_data(newTicketData);
          }
        }
      })
      .catch((err) => setLoading(false));
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
        message: message,
        ticket_id:props.location.state.id,
      }),
    };
    await fetch(API_URL + "/ticket/respond-ticket", requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        setmessage("");
        setLoading(false)
        get_ticket_data()
      });
  };
  const close_ticket = async () =>{
    setLoading(true)
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:props.location.state.id,
      }),
    };
    await fetch(API_URL + "/ticket/update-ticket", requestOptions)
      .then((response) => response.json())
      .then(async (response) => {
        setLoading(false);
        props.history.push('/admin/open-ticket')
      });

  }
  return (
    <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
      <Navbar
        setSidebar={props.setSidebar}
        sidebar={props.sidebar}
        currentPage="Open Ticket"
      />
      {loading ? <Loader /> : <></>}
      <div className="content-wrapper" style={{ overflow: "visible" }}>
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-4 bg-white border-radius-10 box-shadow-gray">
          <h4 className="f-20 fw-600">Subject</h4>
          <div className="form-group">
            <div className="row my-4">
              <div className="col-12">
                <input
                  className="form-control mt-2 h-5"
                  value={ticket_data.subject}
                />
              </div>
            </div>
          </div>
        </div>
        {props.location.state.status !== "close" ?
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4  py-4 bg-white border-radius-10 box-shadow-gray">
          <h4 className="f-20 fw-600">Send New Message</h4>
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
                  style={{ minHeight: "117px", resize: "none" }}
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
        :<></>}
        {/* <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-2 py-2  border-radius-10 "></div> */}
        {props.location.state.status !== "close" ?
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-2 py-2  border-radius-10 ">
          <div className="flex-wrap d-flex">
            <button
              style={{ minWidth: "200px", whiteSpace: "nowrap",fontSize: "18px" }}
              className={
                "btn mt-lg-0 mt-md-0 mt-3 text-white  h-5 bg-dark-blue mr-5"
              }
                onClick={create_ticket}
                disabled={!message}
            >
              Submit Message
            </button>

            <button
              style={{
                minWidth: "200px",
                whiteSpace: "nowrap",
                backgroundColor: "#DAE2F2",
                color: "#143066",
                fontSize: "18px",
              }}
              className={
                "btn mt-lg-0 mt-md-0 mt-3 h-5 "
              }
                onClick={close_ticket}
            >
              Close Ticket
            </button>
          </div>
        </div>
        :<></>}
        <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-5 py-2  border-radius-10 box-shadow-gray">
          <h4 className="f-20 fw-600">Previous Messages</h4>
          {ticket_data &&
            ticket_data.messages &&
            ticket_data.messages.length > 0 &&
            ticket_data.messages.map((data, i) => (
              <div
                key={i}
                style={{
                  width: "100%",
                  border: "1px solid #CED2D9",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "6px",
                  minHeight: "80px",
                  maxHeight: "auto",
                  margin: "10px 0",
                }}
              >
                <span style={{padding:"0 10px" ,fontSize:"20px",fontWeight:"500", minWidth: "100px"}}>{data.user_type === 'admin'?"Admin :":"Customer :"}</span>
                <span style={{ fontSize: "15px", padding: "5px 10px 0px 20px", width: "80%" }} dangerouslySetInnerHTML={{
                        __html: data.message,
                      }} >
                  {/* {data.message} */}
                </span>
              </div>
            )).reverse()}
        </div>
      </div>
    </div>
  );
}

export default UpdateTicket;
