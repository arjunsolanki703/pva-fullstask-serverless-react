import React from "react";
import logo from "../../images/logo.svg";
import notFoundimg from "../../images/404.png";

class PageNotFound extends React.Component {
     
    render() {
        return (
            <div className="row mx-auto ai-center sec bg-light-blue">
                 <div className="col-lg-6 col-md-12 col-12 hide-on-med-and-down">
                    <div className="text-center w-75 mx-auto">
                        <img src={notFoundimg} alt="login" height="350" width="500"/>
                    </div>
                 </div>

                 
                <div className="col-lg-6 col-md-12 col-12 sec bg-white d-flex ai-center padding">
                  <div className="w-60 mx-auto">
                    <img className="logo" src={logo} alt="logo" />
                    <div className="text-center mb-3 notfound">
                     <span className="text-bright-blue">4</span><span style={{color: '#DAE2F2'}}>0</span><span className="text-bright-blue">4</span>
                    </div>
                    <p className="text-center" style={{fontSize: '25px', fontWeight: '600'}}>Page Not Found</p>
                    <div className="form-group mt-4">
                        <button className="btn text-white w-100 bg-dark-blue">Go Back</button>
                    </div>
                    
                 </div>
                </div>

            </div>

        );
    }
}

export default PageNotFound;