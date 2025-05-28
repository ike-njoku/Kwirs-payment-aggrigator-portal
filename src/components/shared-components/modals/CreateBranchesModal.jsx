"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreateTaxTypeModal = ({ handleCloseModal, handleCreateModal }) => {
  const CreatedBy = "Admin";
  const [branchId, setbranchId] = useState("1000");
  const [branchName, setbranchName] = useState("");
  const [Address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !CreatedBy.trim() ||
      !branchId.trim() ||
      !branchName.trim() ||
      !Address.trim()
    ) {
      alert("All fields are required!");
      setIsLoading(false);
      return;
    }

    handleCreateModal({
      CreatedBy,
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
          Create Branch
        </h3>

        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* Branch ID */}
          <div className="w-full hidden">
            <label className="text-base font-medium text-gray-700">
              Branch ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                type="text"
                value={branchId}
                onChange={(e) => setbranchId(e.target.value)}
                placeholder="Enter Branch ID"
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
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
                type="text"
                value={branchName}
                onChange={(e) => setbranchName(e.target.value)}
                placeholder="Enter Branch Name"
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
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
                type="text"
                value={Address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Address"
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <AuthButtons
            label="Create"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default CreateTaxTypeModal;
