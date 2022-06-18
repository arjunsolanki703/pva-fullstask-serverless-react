import React from "react";
import { Link, Redirect } from "react-router-dom";
import BoyImg from "../../../images/account/boy.svg";
import Header from "../header";
import { API_URL, getRole } from "../../common/CONST";
import isAuthorized from "../../common/Auth";
import logo from "../../../images/logo.svg";
import eyeOff from "../../../images/eyeOff.png";
import eyeOn from "../../../images/eyeOn.png";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from "../../common/Loader";

const SITE_KEY = "6Le2F9IbAAAAAOcJyc4wy7B5_G3L_CdDV7KEEpyD";

class AdminLogin extends React.Component {
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
      msg: "",
    };
  }
  // componentDidMount() {
  //   this.setState({ loading: true });
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       accept: "*/*",
  //       Authorization: localStorage.getItem("auth"),
  //     },
  //   };
  //   fetch(API_URL + "/admin/getmaintenancemode", requestOptions)
  //     .then((response) => response.json())
  //     .then((response) => {
  //       if (response.success) {
  //         this.setState({
  //           maintenance: response.data.maintenance,
  //           msg: response.data.message,
  //         });
  //         this.setState({ loading: false });
  //       }
  //     });
  // }
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
      this.state.email.valid &&
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
          localStorage.setItem("auth", "");
          this.setState({
            submitStatus: "Failure",
            auth: false,
            loading: false,
          });
          setTimeout(() => {
            this.setState({ submitted: false });
          }, 1000);
          if (data.messageCode === "INVALID_EMAIL_OR_PASSWORD") {
            const email = this.state.email;
            email.valid = false;
            const pass = this.state.password;
            pass.valid = false;
            this.setState({ email: email, password: pass });
            setTimeout(() => {
              email.valid = true;
              pass.valid = true;
              this.setState({ email: email, password: pass });
            }, 900);
          }
        }
      });
  };
  // ============================================
  render() {
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

          <div className="col-lg-6 col-md-12 col-12 sec bg-white d-flex ai-center py-5">
            <div className="w-60 mx-auto">
              <img className="logo" src={logo} alt="logo" />
              <Header />
              {/* {this.state.maintenance === false ? ( */}
              <div className="form-wrapper mt-4">
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
                  />
                </div>
                <div className="form-group mt-2">
                  <label htmlFor="password">Password</label>
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
                <div className="form-group">
                  <Link to="/forgotpassword" className="text-bright-blue">
                    Forgot Password?
                  </Link>
                </div>
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
                {/* <div className="form-group">
                  <span className="text-secondary">
                    Don’t have an account?{" "}
                    <Link className="text-bright-blue" to="/signup">
                      Sign Up
                    </Link>
                  </span>
                </div> */}
              </div>
              {/* ) : (
                <>
                  <div>Maintenance Mode is On!</div>
                  <div>{this.state.msg}</div>
                </> 
               )} */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AdminLogin;
