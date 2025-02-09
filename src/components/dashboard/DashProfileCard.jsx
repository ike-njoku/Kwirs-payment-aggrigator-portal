"use client";
import React, { useState } from "react";
import { displayDate } from "../../utils/functions";
import Image from "next/image";
import ProfileDetails from "../shared-components/modals/ProfileDetails";

const DashProfileCard = () => {
  const date = displayDate();
  const [openModal, setOpenModal] = useState(false);

  const handleCloseProfileModal = () => {
    setOpenModal(false);
  };

  const handleOpenProfileModal = () => {
    setOpenModal(true);
  };

  return (
    <>
      <div
        className={`border border-[rgb(70,70,70)] rounded-[25px] p-6 mt-3 w-[373px] lg:max-w-full cursor-pointer`}
        onClick={handleOpenProfileModal}
      >
        <article className="flex justify-between gap-3">
          {/* <h3 className="w-full text-base font-medium capitalize">
          personal info
        </h3> */}
          <figure className="m-0 p-0 w-[40px] h-[40px] rounded-[50%] relative overflow-hidden border border-pumpkin ">
            <Image
              fill
              alt="user-pic"
              src="/images/avatar.jpeg"
              className="object-cover"
            />
          </figure>
          <h3 className="text-sm font-medium capitalize italic text-[rgb(70,70,70)]">
            quantum<span className="text-pumpkin">Gateway</span>
          </h3>
        </article>

        <div className="mt-5">
          <h4 className="font-semibold mt-5 flex justify-start gap-1 bg-gradient-to-l to-[rgb(255,117,24)] from-[rgba(255,255,255,0.6)] text-transparent bg-clip-text capitalize text-2xl lg:text-3xl">
            john doe
          </h4>
          <p className="text-sm font-normal leading-normal">
            johndoe@gmail.com
          </p>
        </div>

        <div className="mt-10 flex justify-between items-end gap-3">
          <p className="text-base font-semibold text-pumpkin">N12345899</p>

          <h3 className="font-normal text-sm">{date}</h3>
        </div>
      </div>
      {openModal && (
        <ProfileDetails handleCloseModal={handleCloseProfileModal} />
      )}
    </>
  );
};

export default DashProfileCard;
