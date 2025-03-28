"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import Image from "next/image";
import { AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";
import ProifileInfo from "../../dashboard/ProifileInfo";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ProfileDetails = ({ handleCloseModal, TIN }) => {
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
          setProfileData(response.data.Data || {});
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

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-6">
        <h4 className="text-2xl text-black py-4 border-b border-b-gray-500">
          Profile Details
        </h4>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : profileData ? (
          <section className="mt-5 w-full">
            <div className="flex items-center gap-2">
              <figure className="m-0 p-0 w-[70px] h-[70px] relative border border-pumpkin rounded-[50%] overflow-hidden">
                <Image
                  fill
                  alt="user-pic"
                  src={profileData?.Avatar || "/images/avatar.jpeg"}
                  className="object-cover"
                />
              </figure>
              <article className="flex flex-col gap-1">
                <h5 className="text-lg capitalize text-pumpkin font-semibold">
                  {profileData?.Name || "N/A"}
                </h5>
                {/* <p className="text-pumpkin font-light text-base">
                  {profileData?.Role || "N/A"}
                </p> */}
              </article>
            </div>

            <ul className="w-full flex flex-col gap-4 my-6">
              <ProifileInfo propertyKeysName="email" value={profileData?.Email || "N/A"} />
              <ProifileInfo propertyKeysName="tin" value={profileData?.TIN || "N/A"} />
              {/* <ProifileInfo propertyKeysName="status" value={profileData?.Status || "N/A"} /> */}
              {/* <ProifileInfo propertyKeysName="tax office" value={profileData?.TaxOffice || "N/A"} /> */}
            </ul>
          </section>
        ) : (
          <p className="text-center text-gray-600">No profile data available</p>
        )}
      </div>
    </ModalLayout>
  );
};

export default ProfileDetails;

