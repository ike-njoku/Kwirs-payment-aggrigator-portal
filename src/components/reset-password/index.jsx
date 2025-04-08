"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { AxiosPost } from "../../services/http-service";

const ResetPasswordPage = () => {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
   const router = useRouter();
  
  
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Fetch the username (TIN) from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem("authDetails");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userTin = parsedUser?.tin; // Use tin as the username
      if (userTin) {
        setUsername(userTin); // Set the username as tin
      } else {
        toast.error("TIN not found. Please log in again.");
      }
    } else {
      toast.error("User data not found. Please log in again.");
    }
  }, []);

  // Handle reCAPTCHA token change
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    localStorage.setItem('captchaToken', token); // Store token in localStorage
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }

    if (!username) {
      toast.error("Username (TIN) is required.");
      return;
    }

    const payload = {
      UserName: username, // Use the TIN as UserName
      CaptchaToken: captchaToken, // Sending captcha token
    };

    try {
      setLoading(true);
      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/userManagement/Reset`,
        payload
      );
      console.log("✅ Full response:", response);

    //   const resData = response.data;

    if (response?.StatusCode === 200 && response?.StatusMessage === "Success") {
        toast.success("Password reset successfully.");
        // ✅ Redirect to change-password
      router.push("/change-password");
      } else {
        toast.error(response?.Data?.ErrorMessage || "Invaild UserName.");
      }
    } catch (error) {
      toast.error("Error resetting password.");
      console.error("❌ Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-center">Reset Password</h3>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            User Name 
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mt-4">
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={handleCaptchaChange}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="bg-pumpkin text-white px-4 py-2 rounded-md"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;

