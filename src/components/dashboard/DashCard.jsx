"use client";

import React, { useState, useEffect } from "react";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const DashCard = ({ TIN, loading, dashboardData }) => {
  const [currentDate, setCurrentDate] = useState("");

  // Function to get the current date and time
  const updateDateTime = () => {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString("en-US", options);
    setCurrentDate(formattedDate);
  };

  // Update date in real-time
  useEffect(() => {
    updateDateTime(); // Set the initial date
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="bg-customGradient rounded-[25px] p-6 text-white mt-3 w-[373px] lg:w-full">
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : dashboardData && dashboardData.TIN ? (
        <>
          <article className="flex justify-between gap-3">
            <h3 className="w-full text-sm sm:text-base font-medium capitalize">
              Total Payments
            </h3>
            <h3 className="text-sm font-medium capitalize italic">
              quantum<span className="text-pumpkin">Gateway</span>
            </h3>
          </article>

          <h4 className="font-semibold mt-5 text-white flex justify-start gap-1">
  <span className="text-[30px] lg:text-5xl">
    {dashboardData?.sumtotal
      ? new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 2, // Ensures two decimal places
        }).format(dashboardData.sumtotal)
      : "₦0.00"}
  </span>
</h4>


          <div className="mt-10 flex justify-between items-end gap-3">
            <article className="text-white">
              <h4 className="text-sm font-normal leading-normal">
                {dashboardData?.Name || "N/A"}
              </h4>
              <p className="text-base font-semibold">
                {dashboardData?.TIN || "N/A"}
              </p>
              <p className="text-sm italic">{dashboardData?.Email || "N/A"}</p>
            </article>

            <h3 className="font-normal text-sm">{currentDate || "N/A"}</h3>
          </div>
        </>
      ) : (
        <p className="text-center text-white">No data available</p>
      )}
    </div>
  );
};

export default DashCard;

