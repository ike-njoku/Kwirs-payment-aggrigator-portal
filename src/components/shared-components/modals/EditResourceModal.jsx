"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditResourceModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  label,
  heading,
}) => {
  const [resourceName, setResourceName] = useState(index.name);
  const [resourceUrl, setResourceUrl] = useState(index.resourceURL);
  const [isLoading, setIsLoading] = useState(false);
  const [resourceType, setResourceType] = useState(
    index.resourceType || "Select resource type"
  );
  const handleFormSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    handleEditModal(index, { resourceName, resourceUrl, resourceType });
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
              Resource Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="Enter resource name"
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
              Resource URL
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="Eg. https://url.com"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="resourceUrl"
            >
              Resource Type
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="url"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                placeholder="Eg. https://url.com"
                required
              >
                <option value="1">Main menu</option>
                <option value="2">Sub menu</option>
              </select>
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

export default EditResourceModal;