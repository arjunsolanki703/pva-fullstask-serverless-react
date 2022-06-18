import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import AdminCloseTicket from "./components/Admin/closeTicket";
import AdminDashboardContainer from "./components/Admin/adminDashboardContainer";
import AdminNewsContainer from "./components/Admin/NewsContainer";
import AdminOpenTicket from "./components/Admin/openTicket";
import AdminUpdateTicket from "./components/Admin/updateTicket";
import ApiKeyContainer from "./components/Client/ApiKeyContainer";
import CTransactionContainer from "./components/Client/transactionContainer";
import ClientCreditSuccess from "./components/Client/ClientCreditSuccess";
import ClientHistoryContainer from "./components/Client/clientHistoryContainer";
import ClientNewsContainer from "./components/Client/NewsContainer";
import ClientProfile from "./components/Client/ClientProfile";
import CloseTicket from "./components/Client/closeTicket";
import CreateTicket from "./components/Admin/createTicket";
import Dashboard from "./components/Client/dashboard";
import EditCustomerContainer from "./components/Admin/editCustomerContainer";
import EditNewsContainer from "./components/Admin/editNewsContainer";
import EditWebsiteContainer from "./components/Admin/editWebsiteContainer";
import Gethelp from "./components/Client/gethelp";
import OpenTicket from "./components/Client/openTicket";
import Pricing from "./components/Client/pricing";
import RefillcreditesContainer from "./components/Client/ClientRefillcredites";
import SettingsContainer from "./components/Admin/SettingsContainer";
import Sidebar from "./components/common/sidebar";
import TellabotServiceContainer from "./components/Admin/tellabot/tellabotServiceContainer";
import TransactionContainer from "./components/Admin/transactionContainer";
import UpdateTicket from "./components/Client/updateTicket";
import ViewServiceNumber from "./components/Client/ViewServiceNumber";
import ViewUserHistoryContainer from "./components/Admin/viewUserHistoryContainer";
import WebsiteAdminHistory from "./components/Admin/WebsiteAdminHistory";
import WebsiteCustomersHistory from "./components/Admin/WebsiteCustomersHistory";
import WebsiteListContainer from "./components/Admin/websiteListContainer";
import WebsiteServiceNumber from "./components/Client/WebsiteServiceNumber";
import { getRole } from "./components/common/CONST";
import PaypalPaymentContainer from "./components/Client/paypalPayment";
import { API_URL } from "./components/common/CONST";

function WithSidebarComponents(props) {
  const [sidebar, setSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setmsg] = useState("");
  const [visible, setvisible] = useState("");
  const currentPage = localStorage.getItem("currentPage");

  useEffect(() => {
    getnotice();
  }, [currentPage]);

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
          setmsg(response.data.message);
          setvisible(response.data.is_enable);
          localStorage.setItem("notice-enable",response.data.is_enable)
        }
      })
      .catch((err) => setLoading(false));
  };

  return (
    <>
      {getRole() === "client" ? (
        visible ? (
          <div style={{ minHeight: 20 }}>
            <span
              className="notic-section"
              dangerouslySetInnerHTML={{
                __html: msg,
              }}
            ></span>
          </div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}

      <div className="row mx-auto">
        {/* ============== CLIENT ============= */}
        {getRole() === "client" ? (
          <Switch>
            <Route
              exact
              path="/client/dashboard"
              render={() => (
                <Dashboard
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/pricing"
              render={() => (
                <Pricing sidebar={sidebar} setSidebar={setSidebar} {...props} />
              )}
            />
            <Route
              exact
              path="/client/history"
              render={() => (
                <ClientHistoryContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/transaction"
              render={() => (
                <CTransactionContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/refill-credits"
              render={() => (
                <RefillcreditesContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/refill-credits-success"
              render={() => (
                <ClientCreditSuccess
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/request/:id"
              render={() => (
                <WebsiteServiceNumber
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/view/:id"
              render={() => (
                <ViewServiceNumber
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/profile"
              render={() => (
                <ClientProfile
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/news"
              render={() => (
                <ClientNewsContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/api-key"
              render={() => (
                <ApiKeyContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/create-ticket"
              render={() => (
                <Gethelp sidebar={sidebar} setSidebar={setSidebar} {...props} />
              )}
            />
            <Route
              exact
              path="/client/open-ticket"
              render={() => (
                <OpenTicket
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/close-ticket"
              render={() => (
                <CloseTicket
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/update-ticket"
              render={() => (
                <UpdateTicket
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/client/paypal_payment"
              render={() => (
                <PaypalPaymentContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />

            <Redirect to="/404" />
          </Switch>
        ) : (
          <Switch>
            <Route
              exact
              path="/admin/dashboard"
              render={() => (
                <AdminDashboardContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />

            <Route
              exact
              path="/admin/news"
              render={() => (
                <AdminNewsContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/news/update/:id"
              render={() => (
                <EditNewsContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/news/add"
              render={() => (
                <EditNewsContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />

            <Route
              exact
              path="/admin/websites"
              render={() => (
                <WebsiteListContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/website/update/:id"
              render={() => (
                <EditWebsiteContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/website/add"
              render={() => (
                <EditWebsiteContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />

            <Route
              exact
              path="/admin/customers"
              render={() => (
                <WebsiteCustomersHistory
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/customer/update/:id"
              render={() => (
                <EditCustomerContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/customer/add"
              render={() => (
                <EditCustomerContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />

            <Route
              exact
              path="/admin/history/:id"
              render={() => (
                <ViewUserHistoryContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/history"
              render={() => (
                <WebsiteAdminHistory
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />

            <Route
              exact
              path="/admin/transaction"
              render={() => (
                <TransactionContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />

            <Route
              exact
              path="/admin/view/:id"
              render={() => (
                <ViewServiceNumber
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />

            <Route
              exact
              path="/admin/settings/tellabot/websites"
              render={() => (
                <TellabotServiceContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/settings"
              render={() => (
                <SettingsContainer
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/create-ticket"
              render={() => (
                <CreateTicket
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/open-ticket"
              render={() => (
                <AdminOpenTicket
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/close-ticket"
              render={() => (
                <AdminCloseTicket
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin/update-ticket"
              render={() => (
                <AdminUpdateTicket
                  sidebar={sidebar}
                  setSidebar={setSidebar}
                  {...props}
                />
              )}
            />
            <Redirect to="/404" />
          </Switch>
        )}
        <div
          id="sidebar"
          className={
            `col-lg-2 col-md-12 col-12 sidebar-wrapper px-0 bg-white sec box-shadow-gray position-fixed ` +
            (sidebar ? "active" : "")
          }
        >
          <Sidebar sidebar={sidebar} setSidebar={setSidebar} {...props} />
        </div>
      </div>
    </>
  );
}
export default WithSidebarComponents;
