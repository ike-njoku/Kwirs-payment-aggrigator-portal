"use client";
import React, { useState, useEffect } from "react";
import { displayDate } from "../../utils/functions";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const DashCard = ({ TIN, loading, dashboardData }) => {
  const date = displayDate();

  return (
    <div className="bg-customGradient rounded-[25px] p-6 text-white mt-3 w-[373px] lg:w-full">
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : dashboardData ? (
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
            <span className="text-2xl">&#8358;</span>
            <span className="text-[30px] lg:text-5xl">
              {dashboardData?.sumtotal
                ? parseFloat(dashboardData.sumtotal).toLocaleString("en-NG")
                : "0"}
            </span>
            <span className="text-2xl font-normal mt-3">.00</span>
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

            <h3 className="font-normal text-sm">{date || "N/A"}</h3>
          </div>
        </>
      ) : (
        <p className="text-center text-white">No data available</p>
      )}
    </div>
  );
};

export default DashCard;
