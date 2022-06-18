import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../../common/CONST";
import CustomizedSwitches from "../settings/switch";

function boatService({ setLoading }) {
  const isComponentMounted = useRef(true);
  // eslint-disable-next-line
  const [_, setUpdate] = useState(false);
  const [websites, setWebsites] = useState([]);

  const getWebsites = () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    };
    fetch(
      API_URL +
        "/boat-services/get/all?page=1&limit=1000&order=true&order_by=name",
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        var webOptions = [];

        const data_array = response.data.data;
        for (var ind in data_array) {
          const data = data_array[ind];
          webOptions.push({
            id: data._id,
            name: data.name,
            credit: data.credit,
            enable: data.enable,
            ltr_price: data.ltr_price,
            boat: data.boat,
            agent_accept_time: data.agent_accept_time,
            agent_handle_request: data.agent_handle_request,
            is_price_surge: data.is_price_surge,
            price_after_surge: data.price_after_surge,
          });
        }

        if (isComponentMounted.current) {
          setWebsites(webOptions);
          setLoading(false);
        }
      })
      .catch((err) => setLoading(false));
  };
  const changeWebsite = async (website, index) => {
    setUpdate(true);
    setLoading(true);

    const newWebsites = websites;
    newWebsites[index].enable = !newWebsites[index].enable;
    setWebsites(newWebsites);

    const requestOptions = {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWebsites[index]),
    };
    await fetch(API_URL + "/admin/addorupdatewebsite", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success && isComponentMounted.current) {
          newWebsites[index].enable = !newWebsites[index].enable;
          setWebsites(newWebsites);
        }
        if (isComponentMounted.current) {
          setLoading(false);
        }
      })
      .catch((err) => setLoading(false));

    if (isComponentMounted.current) setUpdate(false);
  };
  useEffect(() => {
    isComponentMounted.current = true;

    getWebsites();

    return () => {
      isComponentMounted.current = false;
    };
  }, []);
  return (
    <>
      <div className="mt-lg-5 mt-md-4 mt-3 mx-lg-4 mx-3 px-lg-4 bg-transparent">
        <div className="overflow-scroll rounded-top">
          <table className="table box-shadow-gray">
            <thead>
              <tr className="text-center">
                <th className="text-left align-middle">Services</th>
                <th className="text-left align-middle">Active</th>
              </tr>
            </thead>
            <tbody>
              {websites &&
                websites.map((website, index) => {
                  return (
                    <tr className="text-center" key={index}>
                      <td className="f-16 text-primary text-left align-middle text-capitalize">
                        {website.name}
                      </td>
                      <td className="f-16 text-primary text-left align-middle text-capitalize">
                        <div className="pretty p-default">
                          <CustomizedSwitches
                            checked={website.enable}
                            onChange={async () => {
                              changeWebsite(website, index);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default boatService;
