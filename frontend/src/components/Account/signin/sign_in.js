import { API_URL, getRole } from "../../common/CONST";
import { Link, Redirect } from "react-router-dom";

import BoyImg from "../../../images/account/boy.svg";
import Header from "../header";
import Loader from "../../common/Loader";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";
import eyeOff from "../../../images/eyeOff.png";
import eyeOn from "../../../images/eyeOn.png";
import isAuthorized from "../../common/Auth";
import logo from "../../../images/logo.svg";

const SITE_KEY = "6Le2F9IbAAAAAOcJyc4wy7B5_G3L_CdDV7KEEpyD";

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      auth: isAuthorized(),
      profile: false,
      email: {
        value: "",
        valid: true,
      },
      password: {
        value: "",
        valid: true,
      },
      token: "",
      canSubmit: false,
      submitStatus: "",
      load: false,
      expired: "false",
      loading: false,
      maintenance: false,
      submitted: false,
      success: false,
      issubmitted: false,
      msg: "",
      error_msg: "",
      user_active: localStorage.getItem("user_block"),
      signupmode: false,
      clickonsignup: false,
    };
  }
  recaptchaRef = React.createRef();
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
            signupmode: response.data.signupmode,
          });
          this.setState({ loading: false });
        }
      });
  }
  // ================== Email ==================
  isEmail = (email) => {
    if (email === "") return true;
    // <TODO> Improvise this filter
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };
  emailOnChange = (e) => {
    const value = e.target.value;
    this.setState(
      { email: { value: value, valid: this.isEmail(value) } },
      () => {
        this.canSubmit();
      }
    );
  };
  // ==============================================

  // ================== Password ==================
  passwordOnChange = (e) => {
    const value = e.target.value;
    this.setState({ password: { value: value, valid: true } }, () => {
      this.canSubmit();
    });
  };
  // ============================================

  // ================== Submit ==================
  canSubmit = () => {
    if (
      this.state.email.value !== "" &&
      // this.state.email.valid &&
      this.state.password.value !== "" &&
      this.state.token !== ""
    ) {
      this.setState({ canSubmit: true });
    } else {
      this.setState({ canSubmit: false });
    }
  };
  onSubmit = (e) => {
    this.setState({ loading: true });
    var data = {
      email: this.state.email.value,
      password: this.state.password.value,
      recaptcha: this.state.token,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(API_URL + "/auth/SignIn", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ submitted: true });
        if (data.success) {
          localStorage.setItem("auth", "Bearer " + data.data.token);
          this.setState({ submitStatus: "Success", auth: true });
        } else {
          this.recaptchaRef.current.reset();
          localStorage.setItem("auth", "");
          this.setState(
            {
              submitStatus: "Failure",
              auth: false,
              loading: false,
              token: "",
            },
            () => this.canSubmit()
          );
          if (
            data.messageCode === "INVALID_EMAIL_OR_PASSWORD" ||
            data.messageCode === "Your account is disabled"
          ) {
            this.setState({ error_msg: data.messageCode });
            const email = this.state.email;
            email.valid = false;
            const pass = this.state.password;
            pass.valid = false;
            this.setState({ email: email, password: pass, submitted: false });
            // setTimeout(() => {
            //   email.valid = true;
            //   pass.valid = true;
            //   this.setState({ email: email, password: pass, submitted: false });
            // }, 5000);
          }
        }
        this.setState({ loading: false });
      });
  };
  // ============================================
  handleSingup() {
    this.setState({ clickonsignup: true });
    if (this.state.signupmode === false) {
      this.props.history.push("/signup");
    }
  }
  render() {
    const { user_active } = this.state;
    if (localStorage.getItem("user_block")) {
      setTimeout(() => {
        localStorage.removeItem("user_block");
        this.setState({ user_active: "" });
      }, 5000);
    }
    if (!this.state.loading && this.state.auth) {
      if (getRole() === "client") return <Redirect to="/client/dashboard" />;
      else if (getRole() === "admin") return <Redirect to="/admin/dashboard" />;
    }
    return (
      <>
        {this.state.loading ? <Loader /> : <></>}
        <div className="row mx-auto ai-center sec bg-light-blue">
          <div className="col-lg-6 col-md-12 col-12 hide-on-med-and-down">
            <div className="text-center w-75 mx-auto">
              <img src={BoyImg} alt="login" />
            </div>
          </div>

          <div className="col-lg-6 col-md-12 col-12 sec bg-white d-flex ai-center">
            <div className="w-60 w-80 mx-auto">
              <img className="logo" src={logo} alt="logo" />
              <Header />
              {this.state.maintenance === false ? (
                <div className="form-wrapper">
                  <div
                    className="d-flex jc-center ai-center p-2"
                    style={{
                      border: "solid 1px red",
                      color: "#e53917",
                      backgroundColor: "#fac9c9",
                      visibility:
                        // this.state.email.valid === true ||
                        // this.state.password.valid === true
                        this.state.error_msg === "" ? "hidden" : "",
                    }}
                  >
                    {this.state.error_msg === "INVALID_EMAIL_OR_PASSWORD"
                      ? "Invalid Email or Password"
                      : "Your account is disabled, please contact us on support@serverlessadeals.com"}
                  </div>
                  {this.state.clickonsignup ? (
                    <div
                      className="d-flex jc-center ai-center p-2"
                      style={{
                        border: "solid 1px red",
                        color: "#e53917",
                        backgroundColor: "#fac9c9",
                        visibility:
                          this.state.signupmode === false ? "hidden" : "",
                      }}
                    >
                      We're not accepting new users at this moment, Please check
                      back later!
                    </div>
                  ) : (
                    <></>
                  )}

                  {user_active && (
                    <div
                      className="d-flex jc-center ai-center p-2"
                      style={{
                        border: "solid 1px red",
                        color: "#e53917",
                        backgroundColor: "#fac9c9",
                        visibility: user_active === "true" ? "" : "hidden",
                      }}
                    >
                      Your account is disabled, please contact us on
                      support@serverlessadeals.com
                    </div>
                  )}

                  <div className="form-group mt-2">
                    <label htmlFor="email">Email</label>
                    <input
                      className={
                        "form-control " +
                        (this.state.email.valid ? "" : "invalid")
                      }
                      name="email"
                      value={this.state.email.value}
                      onChange={this.emailOnChange}
                      disabled={this.state.submitted}
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="password">Password</label>
                    <div
                      className="form-group"
                      style={{ textAlign: "right", marginTop: "-31px" }}
                    >
                      <Link to="/forgotpassword" className="text-bright-blue">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <input
                        className={
                          "form-control col-12 " +
                          (this.state.password.valid ? "" : "invalid")
                        }
                        type={this.state.eye ? "text" : "password"}
                        name="password"
                        value={this.state.password.value}
                        onChange={this.passwordOnChange}
                        style={{ paddingRight: "40px" }}
                        disabled={this.state.submitted}
                      />
                      {/* <img className="input-eye" src={eyeOn} alt="off"/> */}

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
                  <ReCAPTCHA
                    ref={this.recaptchaRef}
                    sitekey={SITE_KEY}
                    onChange={(token) => {
                      this.setState({ token: token });
                      this.canSubmit();
                    }}
                    onExpired={() => {
                      this.setState({ token: "" });
                      this.canSubmit();
                    }}
                  />

                  <div className="form-group mt-2">
                    <button
                      className={
                        "btn text-white w-100 " +
                        (this.state.submitted
                          ? this.state.auth
                            ? "btn-success"
                            : "btn-danger"
                          : "bg-dark-blue")
                      }
                      onClick={this.onSubmit}
                      disabled={
                        !this.state.submitted && this.state.canSubmit
                          ? false
                          : true
                      }
                    >
                      Sign In
                    </button>
                  </div>
                  <div className="form-group">
                    <span className="text-secondary">
                      Don’t have an account?{" "}
                      {/* <Link
                        className="text-bright-blue"
                        to="/signup"
                      > */}
                      {/* </Link> */}
                    </span>
                    <span
                      style={{ cursor: "pointer" }}
                      className="text-bright-blue"
                      onClick={() => this.handleSingup()}
                    >
                      Sign Up
                    </span>
                  </div>
                </div>
              ) : (
                <>
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

export default SignIn;
