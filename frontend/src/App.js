import "./App.css";
import "./media.css";
import "./pretty-checkbox.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignUp from "./components/Account/signup/sign_up";
import SignIn from "./components/Account/signin/sign_in";
import VerifyAccount from "./components/Account/VerifyAccount";
import ForgotPassword from "./components/Account/forgotpassword/forgotPassword";
import WithSidebarComponents from "./WithSidebarComponents";
import AdminLogin from "./components/Account/adminLogin/adminLogin";
import page_404 from "./components/Account/page_404.js";

function App() {
  document.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );

  return (
    <Router>
      <div className="bg-light-blue sec">
        <Switch>
          <Route exact path="/" component={SignIn} />
          <Route exact path="/adminlogin" component={AdminLogin} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/forgotpassword" component={ForgotPassword} />
          <Route
            exact
            path="/verify-account/:token"
            component={VerifyAccount}
          />
          <Route exact path="/client/*" component={WithSidebarComponents} />
          <Route exact path="/admin/*" component={WithSidebarComponents} />
          <Route exact path="/404" component={page_404} />
          <Route component={page_404} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
