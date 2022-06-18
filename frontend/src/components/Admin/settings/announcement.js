import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../../common/CONST";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomizedSwitches from "./switch";

function Announcement({ setLoading }) {
  const [announcement_mode, setannouncement_mode] = useState(true);
  const [message, setmessage] = useState();
  const isComponentMounted = useRef(true);
  useEffect(() => {
    getnotice();
  }, []);

  const getnotice = () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/admin/getNotice", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setLoading(false);
          setannouncement_mode(response.data.is_enable);
          setmessage(response.data.message);
        }
      })
      .catch((err) => setLoading(false));
  };

  const handleSubmit = () => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        is_enable: announcement_mode,
      }),
    };
    fetch(API_URL + "/admin/addOrUpdateNotice", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        getnotice();
      })
      .catch((err) => setLoading(false));
  };

  return (
    <>
      <div className="d-flex ai-center jc-sb px-lg-3 p-2">
        <div>
          <p className="mb-0">Announcement</p>
        </div>
        {/* form-switch */}
        <div>
          <CustomizedSwitches
            // checked={true}
            checked={announcement_mode}
            onChange={() => {
              setannouncement_mode(!announcement_mode);
            }}
          />
        </div>
        {/* editor */}
      </div>
      <div>
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
            link: {
              addTargetToExternalLinks: true,
            },
          }}
        />
      </div>
      <div className="d-flex ai-center justify-content-end ">
        <button
          className="btn mt-2 btn-md px-3 bg-dark-blue text-white"
          onClick={() => handleSubmit()}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default Announcement;
