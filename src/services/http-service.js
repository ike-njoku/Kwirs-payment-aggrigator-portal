import { showToastNotification } from "./notification-service";

const axios = require("axios").default;
showToastNotification;

export const AxiosPost = async (url, parameters, headers) => {
  let _headers = {
    "Content-Type": "application/json",
  };
  if (headers) {
    _headers = headers;
  }

  //attach token
  if (localStorage.getItem("token")) {
    _headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return await axios
    .post(url, parameters, {
      headers: _headers,
    })
    .then((response) => response.data)
    .catch((error) => showToastNotification(error.message));
};

export const AxiosGet = async (url, parameters, headers) => {
  let _headers = {};
  if (headers) {
    _headers = headers;
  }
  //attach token
  if (localStorage.getItem("token")) {
    _headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  try {
    const httpResponse = await axios.get(url, parameters, headers);
    return {
      status: httpResponse.status,
      data: httpResponse.data,
      statusText: httpResponse.statusText,
    };
  } catch (error) {
    console.log("THIS IS AN ERROR -------->>> ", error);
  }
};
