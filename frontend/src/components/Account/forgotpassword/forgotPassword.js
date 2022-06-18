import React from "react";
import { Link, Redirect } from "react-router-dom";
import GirlImg from "../../../images/account/girl.svg";
import { API_URL } from "../../common/CONST";
import logo from "../../../images/logo.svg";
import eyeOn from "../../../images/eyeOn.png";
import eyeOff from "../../../images/eyeOff.png";
import Loader from "../../common/Loader";
import Header from "../header";

class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      email: {
        value: "",
        valid: true,
      },
      otp: {
        value: "",
        valid: true,
      },
      password: {
        value: "",
      },
      repassword: {
        value: "",
        valid: true,
      },
      emailSubmitted: false,
      codeSubmitted: false,
      currSubmitState: 0,
      canSubmit: false,
      loading: false,
      maintenance: false,
      msg: "",
      err_msg: "",
      err: false,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
      },
    };
    fetch(API_URL + "/admin/getmaintenancemode", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          this.setState({
            maintenance: response.data.maintenance,
            msg: response.data.message,
          });
          this.setState({ loading: false });
        }
      });
  }
  // ================= Email =================
  isEmail = (email) => {
    // handling un-necessary error when nothing is typed
    if (email === "") return true;
    // <TODO> Improvise this filter
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };
  emailOnChange = (e) => {
    if (this.state.currSubmitState !== 0) return;

    const value = e.target.value;
    this.setState(
      { email: { value: value, valid: this.isEmail(value) } },
      () => {
        this.canSubmit();
      }
    );
  };
  // =======================================

  // ================= OTP =================
  isOTP = (otp) => {
    // handling un-necessary error when nothing is typed
    if (otp === "") return true;
    const regex = /^[0-9]+$/;
    return regex.test(otp);
  };
  otpOnChange = (e) => {
    const value = e.target.value;
    this.setState({ otp: { value: value, valid: this.isOTP(value) } }, () => {
      this.canSubmit();
    });
  };
  // ============================================

  // ================= Password =================
  passwordOnChange = (e) => {
    const value = e.target.value;
    const repassword = this.state.repassword;
    if (repassword.value !== value && repassword.value !== "") {
      repassword.valid = false;
    } else {
      repassword.valid = true;
    }
    this.setState(
      {
        password: { value: value },
        repassword: repassword,
      },
      () => {
        this.canSubmit();
      }
    );
  };
  // ==============================================

  // ================= RePassword =================
  isRePassword = (repassword) => {
    const password = this.state.password.value;
    // handling un-necessary error when nothing is typed
    if (repassword === "") return true;
    return password === repassword;
  };
  repasswordOnChange = (e) => {
    const value = e.target.value;
    this.setState(
      { repassword: { value: value, valid: this.isRePassword(value) } },
      () => {
        this.canSubmit();
      }
    );
  };
  // ==========================================
  // ================= Submit =================
  canSubmit = () => {
    let ret_value = false;
    // handling all states of submit differently
    if (this.state.currSubmitState === 0) {
      // only email is entered till now
      ret_value = this.state.email.value !== "" && this.state.email.valid;
    } else if (this.state.currSubmitState === 1) {
      // email is set, OTP has to be set
      ret_value = this.state.otp.value !== "" && this.state.otp.valid;
    } else if (this.state.currSubmitState === 2) {
      // OTP is successful, new password has to be set
      ret_value =
        this.state.password.value !== "" && this.state.repassword.valid;
    }
    this.setState({ canSubmit: ret_value });
    return ret_value;
  };
  onSubmit = () => {
    if (!this.canSubmit()) return;
    this.setState({ loading: true });
    this.setState({ err_msg: "" });
    let isOk = true;
    const currSubmitState = this.state.currSubmitState;
    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    };
    if (currSubmitState === 0) {
      requestOptions.body = JSON.stringify({
        email: this.state.email.value,
      });
      fetch(API_URL + "/auth/resetpasswordemail", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ loading: false });
          isOk = data.success;
          if (isOk) {
            this.setState({ err: false });
            const currSubmitState = this.state.currSubmitState;
            this.setState({ currSubmitState: currSubmitState + 1 });
          } else {
            this.setState({ err: true });
            if (data.messageCode === "REQUEST_OTP_AFTER_5_MIN") {
              this.setState({ timeout: true });
              setTimeout(() => this.setState({ timeout: false }), 3000);
            } else {
              this.setState({
                err_msg:
                  data.messageCode == "USER_DOES_NOT_EXIST"
                    ? "Sorry this email is not registered with us"
                    : "",
              });
            }
          }
        });
    } else if (currSubmitState === 1) {
      requestOptions.body = JSON.stringify({
        email: this.state.email.value,
        code: this.state.otp.value,
      });
      fetch(API_URL + "/auth/verifyotp", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          isOk = data.success;
          if (isOk) {
            const currSubmitState = this.state.currSubmitState;
            this.setState({ currSubmitState: currSubmitState + 1 });
          } else {
          }
        });
    } else if (currSubmitState === 2) {
      requestOptions.body = JSON.stringify({
        email: this.state.email.value,
        new_password: this.state.password.value,
      });
      fetch(API_URL + "/auth/resetpassword", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          isOk = data.success;
          if (isOk) {
            const currSubmitState = this.state.currSubmitState;
            this.setState({ currSubmitState: currSubmitState + 1 });
          } else {
          }
        });
    }
  };
  // ============================================
  render() {
    const submitStates = ["Send OTP", "Submit OTP", "Submit"];
    if (this.state.currSubmitState === 3) {
      return <Redirect to="/" />;
    }
    return (
      <>
        {this.state.loading ? <Loader /> : <></>}
        <div className="row mx-auto ai-center sec bg-light-blue">
          <div className="col-lg-6 col-md-12 col-12 hide-on-med-and-down">
            <div className="text-center w-75 mx-auto">
              <img src={GirlImg} alt="login" />
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-12 sec bg-white d-flex ai-center py-5">
            <div className="w-60 mx-auto">
              <img className="logo" src={logo} alt="logo" />
              {this.state.maintenance === false ? (
                <>
                  <h1 className="f-28 fw-500 text-secondary">
                    Forgot Password
                  </h1>
                  {this.state.err && this.state.err_msg != "" ? (
                    <div
                      className="d-flex jc-center ai-center p-2 mt-2"
                      style={{
                        border: "solid 1px red",
                        color: "#e53917",
                        backgroundColor: "#fac9c9",
                        // visibility: user_active === "true" ? "" : "hidden"
                      }}
                    >
                      {this.state.err_msg}
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="form-wrapper mt-4">
                    <div
                      className="form-group mt-2"
                      hidden={!(this.state.currSubmitState <= 1)}
                    >
                      <label htmlFor="email">Email</label>
                      <input
                        className={
                          "form-control " +
                          (this.state.email.valid ? "" : "invalid")
                        }
                        name="email"
                        value={this.state.email.value}
                        onChange={this.emailOnChange}
                      />
                      <p>
                        {this.state.timeout ? "Request OTP After 5 Min" : ""}
                      </p>
                    </div>
                    <div
                      className="form-group mt-2"
                      hidden={!(this.state.currSubmitState === 1)}
                    >
                      <label htmlFor="otp">OTP</label>
                      <input
                        className={
                          "form-control " +
                          (this.state.otp.valid ? "" : "invalid")
                        }
                        name="otp"
                        type="number"
                        value={this.state.otp.value}
                        onChange={this.otpOnChange}
                      />
                    </div>
                    <div
                      className="form-group mt-2"
                      hidden={!(this.state.currSubmitState === 2)}
                    >
                      <label htmlFor="password">New Password</label>
                      <div className="input-group">
                        <input
                          className="form-control col-12"
                          type={this.state.eye ? "text" : "password"}
                          name="password"
                          value={this.state.password.value}
                          onChange={this.passwordOnChange}
                        />
                        {this.state.eye ? (
                          <img
                            className="input-eye"
                            src={eyeOn}
                            alt="off"
                            onClick={() => {
                              const eye = this.state.eye;
                              this.setState({ eye: !eye });
                            }}
                          />
                        ) : (
                          <img
                            className="input-eye"
                            src={eyeOff}
                            alt="on"
                            onClick={() => {
                              const eye = this.state.eye;
                              this.setState({ eye: !eye });
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="form-group mt-4"
                      hidden={!(this.state.currSubmitState === 2)}
                    >
                      <label htmlFor="repassword">Confirm Password</label>
                      <div className="input-group">
                        <input
                          className={
                            "form-control col-12 " +
                            (this.state.repassword.valid ? "" : "invalid")
                          }
                          type={this.state.reye ? "text" : "password"}
                          name="password"
                          value={this.state.repassword.value}
                          onChange={this.repasswordOnChange}
                          style={{ paddingRight: "40px" }}
                        />
                        {this.state.reye ? (
                          <img
                            className="input-eye"
                            src={eyeOn}
                            alt="off"
                            onClick={() => {
                              const eye = this.state.reye;
                              this.setState({ reye: !eye });
                            }}
                          />
                        ) : (
                          <img
                            className="input-eye"
                            src={eyeOff}
                            alt="on"
                            onClick={() => {
                              const eye = this.state.reye;
                              this.setState({ reye: !eye });
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="d-flex mt-2">
                      <Link
                        to="/"
                        type="text"
                        className="btn btn-light-blue text-dark-blue w-100 mr-2"
                      >
                        Cancel
                      </Link>
                      <button
                        className="btn bg-dark-blue text-white w-100 ml-2"
                        onClick={this.onSubmit}
                        disabled={this.state.canSubmit ? false : true}
                      >
                        {submitStates[this.state.currSubmitState]}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Header />
                  <div className="text-white bg-dark-blue w-100 mode text-center mb-3 mt-4">
                    Maintenance Mode is On!
                  </div>
                  <div className="w-100 msg-mode">{this.state.msg}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ForgotPassword;
