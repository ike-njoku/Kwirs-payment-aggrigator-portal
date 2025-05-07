"use client";
import { authenticateUser } from "@/services/auth-service";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggler from "@/components/shared-components/buttons/ThemeToggler";

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

  return (
    <div>
      <ThemeToggler />
      {children}
    </div>
  );
};

export default LayoutWrapper;
