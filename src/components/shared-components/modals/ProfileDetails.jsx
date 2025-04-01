"use client";
import ModalLayout from "./ModalLayout";
import Image from "next/image";
import { AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";
import ProifileInfo from "../../dashboard/ProifileInfo";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ProfileDetails = ({ handleCloseModal, TIN, profileData }) => {
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
                  src={profileData?.Avatar || "/images/icon-7797704_1280.png"}
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
              <ProifileInfo
                propertyKeysName="email"
                value={profileData?.Email || "N/A"}
              />
              <ProifileInfo
                propertyKeysName="tin"
                value={profileData?.TIN || "N/A"}
              />
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
