"use client";
import React, { useState, useEffect } from "react";
import { displayDate } from "../../utils/functions";
import Image from "next/image";
import ProfileDetails from "../shared-components/modals/ProfileDetails";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const DashProfileCard = ({ TIN }) => {
  const [currentDate, setCurrentDate] = useState(displayDate());
  const [openModal, setOpenModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!TIN) {
      toast.error("User TIN not provided.");
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        console.log(`Fetching Profile Data: ${API_BASE_URL}/api/Dashboard/GetDashboard/${TIN}`);

        const response = await AxiosGet(`${API_BASE_URL}/api/Dashboard/GetDashboard/${TIN}`);
        console.log("Profile API Response:", response?.data);

        if (response?.data?.StatusCode === 200) {
          setProfileData(response.data);
        } else {
          toast.error(response.data?.StatusMessage || "Could not fetch profile data.");
          setProfileData({});
        }
      } catch (error) {
        console.error("Fetch Profile Data Error:", error);
        toast.error("Error fetching profile data.");
        setProfileData({});
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [TIN]);

  // Update date at midnight daily
  useEffect(() => {
    const updateDate = () => setCurrentDate(displayDate());

    // Get current time and calculate time until next midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set time to midnight
    const timeUntilMidnight = midnight - now;

    // Set timeout to update date at midnight
    const timer = setTimeout(() => {
      updateDate();
      setInterval(updateDate, 24 * 60 * 60 * 1000); // Update every 24 hours
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className="border border-[rgb(70,70,70)] rounded-[25px] p-6 mt-3 w-[373px] lg:w-full cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : profileData ? (
          <>
            <article className="flex justify-between gap-3">
              <figure className="m-0 p-0 w-[40px] h-[40px] rounded-[50%] relative overflow-hidden border border-pumpkin">
                <Image
                  fill
                  alt="user-pic"
                  src={profileData?.Avatar || "/images/avatar.jpeg"}
                  className="object-cover"
                />
              </figure>
              <h3 className="text-sm font-medium capitalize italic text-[rgb(70,70,70)]">
                quantum<span className="text-pumpkin">Gateway</span>
              </h3>
            </article>

            <div className="mt-5">
              <h4 className="font-semibold mt-5 flex justify-start gap-1 bg-gradient-to-l to-[rgb(255,117,24)] from-[rgba(255,255,255,0.6)] text-transparent bg-clip-text capitalize text-2xl lg:text-3xl">
                {profileData?.Name || "N/A"}
              </h4>
              <p className="text-sm font-normal leading-normal">
                {profileData?.Email || "N/A"}
              </p>
            </div>

            <div className="mt-10 flex justify-between items-end gap-3">
              <p className="text-base font-semibold text-pumpkin">
                {profileData?.TIN || "N/A"}
              </p>
              <h3 className="font-normal text-sm">{currentDate}</h3>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">No data available</p>
        )}
      </div>

      {openModal && <ProfileDetails handleCloseModal={() => setOpenModal(false)} />}
    </>
  );
};

export default DashProfileCard;

