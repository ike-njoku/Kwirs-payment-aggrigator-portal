"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditBulkPaymentModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  label,
  heading,
}) => {
  
  const [Channel, setChannel] = useState(index.Channel);
  const [taxpayerTIN, setTaxpayerTIN] = useState(index.taxpayerTIN);
  const [taxpayerName, setTaxpayerName] = useState(index.taxpayerName);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    handleEditModal(index, { taxpayerName, taxpayerTIN, Channel });
    setIsLoading(false);
    handleCloseModal();
  };
  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5 ">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          {heading}
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* Resource URL Input */}

          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="taxpayerName"
            >
              Taxpayer Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={taxpayerName}
                onChange={(e) => setTaxpayerName(e.target.value)}
                placeholder="Taxpayer Name"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="taxpayerTIN"
            >
              Taxpayer TIN
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={taxpayerTIN}
                onChange={(e) => setTaxpayerTIN(e.target.value)}
                placeholder="Taxpayer TIN"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="Channel"
            >
              Channel
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={Channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="Channel"
                required
              />
            </div>
          </div>
          <AuthButtons
            label="Update"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditBulkPaymentModal;
