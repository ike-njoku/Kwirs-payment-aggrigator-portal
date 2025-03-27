"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreatePSSPModal = ({ handleCloseModal, handleCreateModal }) => {
  const [createdBy, setCreatedBy] = useState("");
  const [psspCode, setPsspCode] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!createdBy.trim() || !psspCode.trim() || !description.trim()) {
      alert("All fields are required!");
      setIsLoading(false);
      return;
    }

    handleCreateModal({
      CreatedBy: createdBy,
      psspCode: psspCode,
      Description: description,
    });

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create PSSP
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* CreatedBy Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Created By
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                placeholder="Enter creator name"
                required
              />
            </div>
          </div>

          {/* psspCode Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              PSSP Code
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={psspCode}
                onChange={(e) => setPsspCode(e.target.value)}
                placeholder="Enter PSSP code"
                required
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Description
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                type="text"
                className="w-full h-[80px]- bg-gray-100 px-3 py-2 focus:outline-none text-gray-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
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

export default CreatePSSPModal;
