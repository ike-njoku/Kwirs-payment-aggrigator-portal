import { showToastNotification } from "./notification-service";

const axios = require("axios").default;
showToastNotification;

export const AxiosPost = async (url, parameters) => {
  return await axios
    .post(url, parameters)
    .then((response) => response.data)
    .catch((error) => showToastNotification(error.message));
};

export const AxiosGet = async (url, parameters) => {
  return await axios
    .get(url, parameters)
    .then((response) => console.log(response.data))
    .catch((error) => showToastNotification(error.message));
};
