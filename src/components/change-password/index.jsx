"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosPost } from "../../services/http-service";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userTin = parsedUser?.tin || parsedUser?.username;
          if (userTin) {
            setUsername(userTin);
          } else {
            toast.error("Username not found. Please log in again.");
          }
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    const payload = {
      Username: username, // Ensure username is retrieved correctly from localStorage
      OldPassword: oldPassword,
      NewPassword: newPassword,
    };

    try {
      setLoading(true);

      const response = await AxiosPost(
        `${API_BASE_URL}/api/userManagement/ChangePassword`,
        payload
      );

      if (
        response?.StatusCode === 200 &&
        response?.StatusMessage === "Success"
      ) {
        toast.success("Password changed successfully.");
        // ✅ Redirect to login
        router.push("/login");

        // onClose(); // close modal
      } else {
        toast.error(
          response?.Data?.ErrorMessage || "Failed to change password."
        );
      }
    } catch (error) {
      toast.error("Error changing password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-darkBg p-4">
      <div className="bg-white dark:bg-darkSurface dark:shadow-[#3d312a] dark:shadow-md p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-center dark:text-white">
          Change Password
        </h3>

        <div>
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="bg-pumpkin dark:bg-darkPumpkin2 text-white px-4 py-2 rounded-md"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChangePasswordPage;
