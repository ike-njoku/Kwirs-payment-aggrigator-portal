"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditPSSPModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  label,
  heading,
}) => {
  const [resourceName, setResourceName] = useState(index.CreatedBy);
  const [resourceUrl, setResourceUrl] = useState(index.psspCode);
  const [resourceDes, setResourceDes] = useState(index.Dsecription);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFormSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    handleEditModal(index, { resourceName, resourceUrl, resourceDes });
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
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="resourceName"
            >
              Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="Enter  name"
                required
              />
            </div>
          </div>

          {/* Resource URL Input */}
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="resourceUrl"
            >
              PSSP Code
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="PSSP Code"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="resourceUrl"
            >
              Description
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={resourceDes}
                onChange={(e) => setResourceDes(e.target.value)}
                placeholder="Description"
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

export default EditPSSPModal;
