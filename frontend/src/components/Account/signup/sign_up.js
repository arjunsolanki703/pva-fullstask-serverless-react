import { API_URL, countries } from "../../common/CONST";
import BoyImg from "../../../images/account/boy.svg";
import Header from "../header";
import { Link,Redirect } from "react-router-dom";
import Loader from "../../common/Loader";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";
import logo from "../../../images/logo.svg";

const SITE_KEY = "6Le2F9IbAAAAAOcJyc4wy7B5_G3L_CdDV7KEEpyD";

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      countryOptions: [],
      name: {
        value: "",
        valid: true,
      },
      email: {
        value: "",
        valid: true,
      },
      country: {
        value: "Select Country",
        disabled: true,
      },
      password: {
        value: "_",
      },
      repassword: {
        value: "_",
        valid: true,
      },
      canSubmit: false,
      submitted: false,
      success: false,
      loading: false,
      token: "",
      maintenance: false,
      msg: "",
      error_msg: "",
      signupmode: false,
    };
  }
  recaptchaRef = React.createRef();
  componentDidMount = () => {
    const countryOptions = [];
    for (let ind in countries) {
      countryOptions.push({ label: countries[ind], value: countries[ind] });
    }
    this.setState({ countryOptions: countryOptions }, () => {
      // Only after country options are fetched
      // then only enable country selector
      this.setState((prevState) => {
        let prevCountry = prevState.country;
        prevCountry.value = countryOptions[0].value;
        prevCountry.disabled = false;
        return { ...prevState, country: prevCountry };
      });
    });
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
  };

  // ================== Name ==================
  isName = (name) => {
    return true;
    // // handling un-necessary error when nothing is typed
    // if (name === "") return true;
    // // <TODO> Improvise this filter
    // const regex = /^[a-zA-Z ]+$/;
    // return regex.test(name);
  };
  nameOnChange = (e) => {
    const value = e.target.value;
    this.setState({ name: { value: value, valid: this.isName(value) } }, () => {
      this.canSubmit();
    });
  };
  // ===========================================

  // ================== Email ==================
  isEmail = (email) => {
    // handling un-necessary error when nothing is typed
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
  // =============================================

  // ================== Country ==================
  countryOnChange = (e) => {
    if (this.state.country.value === "Select Country") {
      var countryOptions = this.state.countryOptions;
      countryOptions.shift();
      this.setState({ countryOptions: countryOptions });
    }

    const value = e.target.value;
    this.setState({ country: { value: value, disabled: false } }, () => {
      this.canSubmit();
    });
  };
  // ==============================================

  // ================== Password ==================
  passwordOnChange = (e) => {
    const value = e.target.value;
    const repassword = this.state.repassword;
    if (repassword.value === value || repassword.value === "") {
      repassword.valid = true;
    } else {
      repassword.valid = false;
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
  // ================================================

  // ================== RePassword ==================
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
  // ============================================
  // ================== Submit ==================
  canSubmit = () => {
    if (
      // checking if field in not empty and it is valid
      this.state.name.value !== "" &&
      this.state.name.valid &&
      this.state.email.value !== "" &&
      this.state.email.valid &&
      this.state.country.value !== "Select Country" &&
      this.state.repassword.value !== "" &&
      this.state.repassword.valid &&
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
      name: this.state.name.value,
      email: this.state.email.value,
      country: this.state.country.value,
      password: this.state.password.value,
      recaptcha: this.state.token,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(API_URL + "/auth/SignUp", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          submitted: true,
          success: data.success,
          loading: false,
        });
        if (data.success)
          setTimeout(
            () =>
              this.setState({
                submitted: false,
                success: true,
              }),
            1000
          );
        else {
          this.recaptchaRef.current.reset();
          this.setState({ error_msg: data.messageCode });
          setTimeout(
            () =>
              this.setState(
                {
                  submitted: false,
                  success: false,
                  token: "",
                },
                () => this.canSubmit()
              ),
            5000
          );
        }
      });
  };

  render() {
    // if (this.state.loading === false && this.state.success) {
    //   return <Redirect to="/" />;
    // }
    
    if (this.state.signupmode) {
      return <Redirect to="/" />;
    }
    return (
      <>
        {this.state.loading ? <Loader /> : <></>}
        <div className="row mx-auto ai-center sec bg-light-blue">
          <div className="col-lg-6 col-md-12 col-12 hide-on-med-and-down">
            <div className="text-center w-75 mx-auto">
              <img src={BoyImg} alt="login" className="img-fluid" />
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-12 sec bg-white d-flex ai-center">
            <div className="w-60 w-80 mx-auto">
              <img className="logo" src={logo} alt="logo" />
              <Header />
              {this.state.maintenance === false ? (
                this.state.success ? (
                  <div>
                    <h4 className="mt-4">
                      Thank you for signing up, {this.state.name.value}!
                    </h4>
                    <p className="mt-4">
                      Please verify your email address to login.
                    </p>
                    <Link
                      to="/"
                      type="text"
                      className="btn text-white bg-dark-blue w-100 mr-2"
                    >
                      Go to Home
                    </Link>
                  </div>
                ) : (
                  <div className="form-wrapper">
                    <div
                      className="d-flex jc-center ai-center p-2"
                      style={{
                        border: "solid 1px red",
                        color: "#e53917",
                        backgroundColor: "#fac9c9",
                        visibility:
                          this.state.submitted && !this.state.success
                            ? ""
                            : "hidden",
                      }}
                    >
                      {/* Email is already registered */}
                      {this.state.error_msg}
                    </div>
                    {/* <form action='#'> */}
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        className={
                          "form-control " +
                          (this.state.name.valid ? "" : "invalid")
                        }
                        name="name"
                        value={this.state.name.value}
                        onChange={this.nameOnChange}
                        autoComplete="false"
                        // disabled={this.state.submitted}
                      />
                    </div>

                    <div className="form-group mt-2">
                      <label htmlFor="email">Work Email</label>
                      <input
                        className={
                          "form-control " +
                          (this.state.email.valid ? "" : "invalid")
                        }
                        name="email"
                        value={this.state.email.value}
                        onChange={this.emailOnChange}
                        autoComplete="false"
                        // disabled={this.state.submitted}
                      />
                    </div>

                    <div className="form-group mt-2">
                      <label htmlFor="country">Country</label>
                      <select
                        className="form-control"
                        name="country"
                        placeholder="Country"
                        onChange={this.countryOnChange}
                        isdisabled={this.state.country.disabled.toString()}
                      >
                        {this.state.countryOptions.map((countryObj) => (
                          <option
                            key={countryObj.value}
                            value={countryObj.value}
                          >
                            {countryObj.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* <div className="form-group mt-2">
                      <label htmlFor="password">Password</label>
                      <div className="input-group">
                        <input
                          className="form-control col-12"
                          type={this.state.eye ? "text" : "password"}
                          name="password"
                          value={this.state.password.value}
                          onChange={this.passwordOnChange}
                          style={{ paddingRight: "40px" }}
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
                    </div> */}

                    {/* <div className="form-group mt-2">
                      <label htmlFor="confirm-password">Confirm Password</label>
                      <div
                        className={
                          "input-group " +
                          (this.state.repassword.valid ? "" : "invalid")
                        }
                      >
                        <input
                          className={"form-control col-12 "}
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
                    </div> */}
                    {/* ======== ReCaptcha V2 ========= */}
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
                    {/* =============================== */}
                    <div className="d-flex mt-3">
                      <Link
                        to="/"
                        type="text"
                        className="btn btn-light-blue text-dark-blue w-100 mr-2"
                      >
                        Back
                      </Link>

                      <button
                        className={
                          "btn text-white w-100 ml-2 " +
                          (this.state.submitted
                            ? this.state.success
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
                        Sign Up
                      </button>
                    </div>
                    {/* </form> */}
                  </div>
                )
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

export default SignUp;
