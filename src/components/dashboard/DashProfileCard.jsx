"use client";
import React, { useState, useEffect } from "react";
import { displayDate } from "../../utils/functions";
import Image from "next/image";
import ProfileDetails from "../shared-components/modals/ProfileDetails";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const DashProfileCard = ({ TIN, loading, profileData }) => {
   const [currentDate, setCurrentDate] = useState("");
  const [openModal, setOpenModal] = useState(false);

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

      {openModal && (
        <ProfileDetails handleCloseModal={() => setOpenModal(false)} />
      )}
    </>
  );
};

export default DashProfileCard;

