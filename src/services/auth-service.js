"use client";
import { toast } from "react-toastify";

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

  return authenticatedUser;
};
