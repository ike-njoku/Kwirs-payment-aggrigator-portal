import { showToastNotification } from "./notification-service";

const axios = require("axios").default;
showToastNotification;

export const AxiosPost = async (url, parameters) => {
  const headers = {
    "Content-Type": "application/json",
  };
  return await axios
    .post(url, parameters, {
      headers: headers,
    })
    .then((response) => response.data)
    .catch((error) => showToastNotification(error.message));
};

export const AxiosGet = async (url, parameters) => {
  try {
    const httpResponse = await axios.get(url, parameters);
    return {
      status: httpResponse.status,
      data: httpResponse.data,
      statusText: httpResponse.statusText,
    };
  } catch (error) {
    console.log("THIS IS AN ERROR -------->>> ", error);
  }
};
