"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreatePaymentMethod = ({
  handleCloseModal,
  handleCreateModal,
  isLoading,
}) => {
  const [description, setDescription] = useState("");
  const [authorization, setAuthorization] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Ensure description is not empty
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }
    handleCloseModal();
    // Call the function to create the payment method
    handleCreateModal(description, authorization);

    // Reset form fields
    setDescription("");
    setAuthorization("true");
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Payment Method
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
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
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
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
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

export default CreatePaymentMethod;
