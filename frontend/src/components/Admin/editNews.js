import React, { useEffect, useRef, useState } from "react";
import isAuthorized from "../common/Auth";
import { Link, Redirect } from "react-router-dom";
import { API_URL } from "../common/CONST";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
function EditNews(props) {
  const isAddMode = props.isAdd;

  const [editedData, setEditedData] = useState(props.data ? props.data : {});
  const [success, setSuccess] = useState(true);
  const [submit, setSubmit] = useState(false);

  const isComponentMounted = useRef(true);
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const handleSubmit = () => {
    props.setLoading(true);
    const data = {
      id: editedData.id,
      title: editedData.title,
      description: editedData.description,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("auth"),
      },
      body: JSON.stringify(data),
    };
    fetch(API_URL + "/news/addorupdate", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (isComponentMounted.current) {
          setSuccess(response.success);
          setSubmit(true);
          if (!response.success) {
            setTimeout(() => {
              setSubmit(false);
              setSuccess(true);
            }, 1000);
          }
          props.setLoading(false);
        }
      })
      .catch((err) => props.setLoading(false));
  };

  if (submit && success) {
    return <Redirect to="/admin/news" />;
  }
  if (!isAuthorized()) return <Redirect to="/" />;
  return (
    <>
      <div className="mt-lg-4 mt-3  mx-lg-4 mx-3 px-4 py-lg-5 py-4 bg-white border-radius-10 box-shadow-gray">
        <div className="form-wrapper mt-4 w-75 mx-auto">
          <div className="form-group">
            <label htmlFor="name">Title</label>
            <input
              className="form-control"
              name="title"
              value={editedData.title ? editedData.title : ""}
              onChange={(e) => {
                setEditedData({ ...editedData, title: e.target.value });
              }}
            />
            <p hidden={editedData.title !== ""}>Please Fill This Field!</p>
          </div>
          <div className="form-group mt-4">
            <label htmlFor="credits">Description</label>
            <CKEditor
              editor={ClassicEditor}
              data={editedData.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditedData({ ...editedData, description: data })
                console.log({ event, editor, data });
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
              className="form-control"
              name="title"
              rows={5}
              value={editedData.description}
              onChange={(e) => {
                setEditedData({ ...editedData, description: e.target.value });
              }}
            /> */}
            <p hidden={editedData.description !== ""}>
              Please Fill This Field!
            </p>
          </div>

          <div className="d-flex mt-4">
            <Link
              to="/admin/news"
              type="button"
              className="btn btn-light-blue text-dark-blue w-100 mr-2"
            >
              Back
            </Link>
            <input
              type="submit"
              value={isAddMode ? "Add" : "Update"}
              className={
                "btn text-white w-100 ml-2 " +
                (success ? "bg-dark-blue" : "btn-danger")
              }
              disabled={
                !editedData || !editedData.title || !editedData.description
              }
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditNews;
