import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import isAuthorized from "../common/Auth";
import Maintenance from "../Modals/Maintenence";
import Navbar from "../common/navbar";
import { API_URL } from "../common/CONST";
import Loader from "../common/Loader";
import { Link, useHistory } from "react-router-dom";

function PaypalPaymentContainer(props) {
    const history = useHistory();
    const data = props.location.state.data;
    const [profile, setProfile] = useState({});
    const [email, setEmail] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        const requestOptions = {
            method: "GET",
            headers: {
                accept: "*/*",
                Authorization: localStorage.getItem("auth"),
            },
        };
        // fetch(API_URL + "/users/profile", requestOptions)
        //     .then((response) => response.json())
        //     .then((response) => {
        //         if (response.success) {
        //             setProfile(response.data);
        //             setLoading(false)

        //         }
        //     });
        fetch(API_URL + "/admin/getpaypalemail", requestOptions)
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setEmail(response.data);
                    setLoading(false)

                }
            });
    }, []);
    const onSubmit = () => {
        history.push({
            pathname: "/client/create-ticket" 
        });
    }
    const handleOnChange = () => {
        setIsChanged(!isChanged);
    };
    if (isAuthorized()) {
        return (
            <>
                {loading ? <Loader /> : <></>}
                <div className="offset-lg-2 col-lg-10 col-md-12 col-12 navbar-wrapper px-0">
                    <Navbar
                        setSidebar={props.setSidebar}
                        sidebar={props.sidebar}
                        currentPage="Refill Credits"
                    />
                    <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 p-3 bg-white border-radius-10">
                        <h2 className="col-12 text-center">
                            <b>Payment Information</b>
                        </h2>
                        <div style={{ "line-height": "170%", marginTop: "20px" }}>
                            <p>
                                <h4 style={{ color: "#2453B2" }}><b>1. Send PayPal Funds</b></h4>
                                PayPal Email : <b>{email.paypalEmail}</b>
                            </p>
                            <p>
                                In PayPal Notes, write your name
                            </p>
                            <p>
                                <h4 style={{ color: "#2453B2" }}><b>2. Contact Us</b></h4>
                                Once you send funds, create a support ticket and write below info
                            </p>

                            <p>
                                <b>
                                    Subject: &nbsp;
                                </b>Add PayPal Funds
                            </p>
                            <p>
                                <b>
                                    Messages:
                                </b>
                                <ul style={{ "padding-left": "50px" }}>
                                    <li>Amount:$ &nbsp;<b>________ </b></li>
                                    <li>PayPal Account Name: &nbsp;<b> _________ </b></li>
                                    <li>PayPal Email Address: &nbsp;<b> _________ </b></li>
                                </ul>
                            </p>

                            <p>
                                <h4 style={{ color: "#2453B2" }}><b>3. Wait for us to verify your funds manually</b></h4>
                            </p>
                            <p>
                                <b>
                                    Note:
                                </b>The amount will be credited to your account within 12 hours
                            </p>

                            {/* <br /> <br /> */}
                            <p> <input
                                type="checkbox"
                                checked={isChanged}
                                onChange={handleOnChange}
                            /> <b>
                                    Yes, I have paid via PayPal
                                </b>
                            </p>
                            <div>

                                <button
                                    className="btn bg-dark-blue text-white col-6 col-lg-3"
                                    onClick={onSubmit}
                                    disabled={!isChanged}
                                >
                                    Create Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                    <Maintenance />
                </div>
            </>
        );
    } else {
        return <Redirect to="/" />;
    }
}

export default PaypalPaymentContainer;
