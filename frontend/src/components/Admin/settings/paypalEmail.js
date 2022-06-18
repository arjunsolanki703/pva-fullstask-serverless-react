import React, { useEffect, useState } from "react";
import { API_URL } from "../../common/CONST";


function PayPalEmailContainer(props) {
    const [editedData, setEditedData] = useState({});
    const [isEmail, setIsEmail] = useState(true);
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                accept: "*/*",
                Authorization: localStorage.getItem("auth"),
            },
        };
        fetch(API_URL + "/admin/getpaypalemail", requestOptions)
            .then((response) => response.json())
            .then((response) => {
                setEditedData({ paypalEmail: response.data.paypalEmail })
            })
            .catch((err) => alert("error", err));
    }, [])
    const addPaypalEmail =  () => {
        props.setLoading(true)
        const data = {
            paypalEmail: editedData.paypalEmail
        }
        const requestOptions = {
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("auth"),
            },
            body: JSON.stringify(data),
        };
        fetch(API_URL + "/admin/addOrUpdatePaypalEmail", requestOptions)
            .then((response) => response.json())
            .then((response) => {
                props.setLoading(false)
            })
            .catch((err) => alert("error", err));
    }

    return (
        <div>
            <div className="d-flex ai-center jc-sb px-lg-3 px-2 py-4">
                <div>{props.title}</div>
                <div className="row ">
                    <input className="form-control" type={"email"} name="paypalEmail" placeholder="Please Enter Email" value={editedData.paypalEmail ? editedData.paypalEmail : ""}
                        onChange={(e) => {
                            const regex =
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if (regex.test(e.target.value)) {
                                setIsEmail(true);
                                setEditedData({
                                    ...editedData, paypalEmail: e.target.value
                                });
                            } else {
                                setIsEmail(false);
                            }
                        }} />
                    {!isEmail && editedData.paypalEmail === "" ? (
                        <p style={{ color: "red" }}>Please Fill This Field</p>
                    ) : isEmail ? (
                        <p></p>
                    ) : (
                        <p style={{ color: "red" }}>Not A Valid Email</p>
                    )}
                    <button className={props.linkClass} onClick={addPaypalEmail}>{props.btnTitle}</button>
                </div>
            </div>
        </div>
    );
}

export default PayPalEmailContainer;
