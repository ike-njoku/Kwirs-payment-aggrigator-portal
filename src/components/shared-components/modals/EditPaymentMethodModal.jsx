"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditPaymentMethodModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  label,
  heading,
}) => {
  // Initialize state directly instead of using useEffect
  const [description, setDescription] = useState(index?.Description || "");
  const [authorization, setAuthorization] = useState(
    index?.Authorization === true ? "true" : "false"
  );
  // console.log("Edit Modal Index:", index);
  // console.log("Payment Method ID:", index?.paymentMethodId);

  const [isLoading, setIsLoading] = useState(false);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await handleEditModal(
      description,
      authorization === "true",
      "admin", // updateBy
      index?.paymentMethodId // Ensure paymentMethodId is passed correctly
    );

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
          {/* Description Field */}
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="description"
            >
              Description
            </label>
            <div className="border-b-2 border-b-pumpkin dark:border-b-darkPumpkin2 h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>

          {/* Authorization Dropdown */}
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="authorization"
            >
              Authorization
            </label>
            <div className="border-b-2 border-b-pumpkin dark:border-b-darkPumpkin2 h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={authorization}
                onChange={(e) => setAuthorization(e.target.value)}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

          <AuthButtons
            label="Update"
            textColor="text-white"
            isLoading={isLoading}
            onClick={handleFormSubmit} // Ensure it's triggering properly
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditPaymentMethodModal;
