"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditBankAccountModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  heading,
}) => {
  const [branchId, setbranchId] = useState(index.branchId);
  const [branchName, setbranchName] = useState(index.branchName);
  const [Address, setAddress] = useState(index.address);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    handleEditModal(index, {
      branchId,
      branchName,
      Address,
    });

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          {heading}
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* Branch ID */}
          <div className="w-full hidden">
            <label className="text-base font-medium text-gray-700">
              Branch ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={branchId}
                onChange={(e) => setbranchId(e.target.value)}
                placeholder="Enter Branch ID"
                required
              />
            </div>
          </div>

          {/* Branch Name */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Branch Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={branchName}
                onChange={(e) => setbranchName(e.target.value)}
                placeholder="Enter Branch Name"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Address
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={Address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Address"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
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

export default EditBankAccountModal;
