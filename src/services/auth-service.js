"use client";
import { toast } from "react-toastify";
import { AxiosGet, AxiosPost } from "./http-service";
const axios = require("axios");
import * as queryString from "querystring";

export const generateAccessToken = async (data) => {
  let body = {
    password: data.password,
    username: data.username,
    grant_type: "password",
  };

  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const response = await AxiosPost(
    `${process.env.NEXT_PUBLIC_BASE_URL}/token`,
    body,
    header
  );

  if (!response || !response.access_token) return false;
  localStorage.setItem("token", response.access_token);
  return response;
};

export const authenticateUser = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const authenticatedUser = JSON.parse(localStorage.getItem("authDetails"));
  if (!authenticatedUser) {
    toast.error("You are not Logged in");
    window.localStorage.clear();
    return false;
  }

  console.table(authenticatedUser);

  return authenticatedUser;
};

export const endSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  // add the api call to end session here
  window.localStorage.clear();
  window.location.href = "/";
};
