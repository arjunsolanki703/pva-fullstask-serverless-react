import React from "react";

function ApiDocument(props) {
  return (
    <>
      <div className="container mt-5 pt-5">
        <div className="text-right">
          <button className="btn bg-dark-blue text-white f-18 btn-lg fw-500">
            Generate New Key
          </button>
        </div>
        <div className="mt-4">
          <h2 className="pl-4 mb-5 fw-700 f-28">1. Fetching Phone Number</h2>
          <table className="table border-radius-0">
            <thead>
              <tr className="bg-dark-blue">
                <th className="text-white th-dark pl-5">Header Parameter</th>
                <th className="text-white th-dark pl-5">Value</th>
                <th className="text-white th-dark pl-5">Required</th>
              </tr>
              <tr className="bg-white">
                <td className="fw-600 text-bright-blue pl-5">Authorization</td>
                <td className="fw-600 text-bright-blue pl-5">The secret key</td>
                <td className="fw-600 text-bright-blue pl-5">Y</td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
}

export default ApiDocument;
