"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosPost } from "../../../services/http-service";

const LogoutButton = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      const response = await AxiosPost(
        `${API_BASE_URL}/api/userManagement/Logout`,
        {}
      );

      localStorage.clear();
      router.push("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("❌ Error during logout:", error);
      toast.error("An error occurred while logging out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-300"
      style={{ width: "95%", margin: "30% 2% 2% 2%" }}
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
