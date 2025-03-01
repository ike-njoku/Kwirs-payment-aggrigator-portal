"use client";
import { toast } from "react-toastify";

export const authenticateUser = () => {
  const authenticatedUser = JSON.parse(localStorage.getItem("authDetails"));
  if (!authenticatedUser) {
    toast.error("You are not Logged in");
    window.localStorage.clear();
    return false;
  }

  return authenticatedUser;
};
