import Announcement from "./settings/announcement";
import MaintenanceMode from "./settings/maintenanceMode";
import PayPalEmailContainer from "./settings/paypalEmail";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import SettingFeature from "./settings/settingFeature";
import isAuthorized from "../common/Auth";
import SignupMode from "./settings/signupMode";

const Settings = ({ setLoading }) => {
  const [signupmode, setsignupmode] = useState(false);
  const handlesignupmode = (data) => {
    setsignupmode(data);
  };
  if (!isAuthorized()) return <Redirect to="/" />;
  return (
    <>
      <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 p-3 bg-white box-shadow-gray border-radius-10">
        <MaintenanceMode setLoading={setLoading} signupmode={signupmode} />
        {/* <SettingFeature
          title="Select Websites for Tellabot Services:"
          link="/admin/settings/tellabot/websites"
          linkClass="btn btn-lg px-3 bg-dark-blue text-white"
          btnTitle="Change"
        /> */}
        <SignupMode
          setLoading={setLoading}
          signupmode={signupmode}
          handlesignupmode={(data) => handlesignupmode(data)}
        />
        <PayPalEmailContainer
          title="Change email for Paypal payment"
          linkClass="btn mt-2 btn-md px-3 bg-dark-blue text-white"
          btnTitle="Save"
          setLoading={setLoading}
        />
        <Announcement setLoading={setLoading} />
      </div>
    </>
  );
};

export default Settings;
