"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import { SUB_MENU, MENU } from "../../../utils/constants";

const CreateResourceModal = ({ handleCloseModal, handleCreateModal }) => {
  const [resourceName, setResourceName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceType, setResourceType] = useState(1);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!resourceName.trim() || !resourceUrl.trim()) {
      alert("Both fields are required!");
      return;
    }

    handleCreateModal({ resourceName, resourceUrl, resourceType });
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    setResourceType(e.target.value);
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Resource
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          <div className="w-full">
            {/* Resource Name Input */}

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
                  value={resourceType}
                  onChange={handleInputChange}
                >
                  <option value="1">{MENU}</option>
                  <option value="2">{SUB_MENU}</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <AuthButtons label="Create" textColor="text-white" />
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default CreateResourceModal;
