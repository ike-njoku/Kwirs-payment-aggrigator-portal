import React from "react";
import ModalLayout from "./ModalLayout";
import Image from "next/image";
import { profileData } from "../../../utils/app_data";
import ProifileInfo from "../../dashboard/ProifileInfo";

const ProfileDetails = ({ handleCloseModal }) => {
  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-6">
        <h4 className="text-2xl text-black py-4 border-b border-b-gray-500">
          Profile Details
        </h4>

        <section className="mt-5 w-full">
          <div className="flex items-center gap-2">
            <figure className="m-0 p-0 w-[70px] h-[70px] relative border border-pumpkin rounded-[50%] overflow-hidden">
              <Image
                fill
                alt="user-pic"
                src="/images/avatar.jpeg"
                className="object-cover"
              />
            </figure>
            <article className="flex flex-col gap-1">
              <h5 className="text-lg capitalize text-pumpkin font-semibold">
                Jane Doe
              </h5>
              <p className="text-pumpkin font-light text-base">
                Software Engineer
              </p>
            </article>
          </div>

          <ul className="w-full flex flex-col gap-4 my-6">
            <ProifileInfo propertyKeysName="email" value={profileData.email} />
            <ProifileInfo propertyKeysName="tin" value={profileData.TIN} />
            <ProifileInfo
              propertyKeysName="status"
              value={profileData.status}
            />
            <ProifileInfo
              propertyKeysName="tax office"
              value={profileData.TaxOffice}
            />
          </ul>
        </section>
      </div>
    </ModalLayout>
  );
};

export default ProfileDetails;
