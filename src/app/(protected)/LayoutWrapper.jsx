"use client";
import { authenticateUser } from "@/services/auth-service";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const LayoutWrapper = ({ children }) => {
  const router = useRouter();
  const isUserAuthenticated = authenticateUser();

  useEffect(() => {
    if (!isUserAuthenticated) {
      router.push("/login");
    }
  }, [isUserAuthenticated, router]);

  if (!isUserAuthenticated) {
    return null;
  }

  return <div>{children}</div>;
};

export default LayoutWrapper;
