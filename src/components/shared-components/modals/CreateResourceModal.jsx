"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreateResourceModal = ({ handleCloseModal, handleCreateModal, parentResources = [] }) => {
  const [resourceName, setResourceName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [menuType, setMenuType] = useState("1"); 
  const [selectedParent, setSelectedParent] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!resourceName.trim() || !resourceUrl.trim()) {
      alert("Resource Name and URL are required!");
      return;
    }

    if (menuType === "2" && !selectedParent.trim()) {
      alert("Parent Resource is required for Sub Menus.");
      return;
    }

    handleCreateModal({ resourceName, resourceUrl, menuType, selectedParent });
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Resource
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">Resource Name</label>
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

            <label className="text-base font-medium text-gray-700">Resource URL</label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="Eg. # or https://url.com"
                required
              />
            </div>

            <label className="text-base font-medium text-gray-700">Menu Type</label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={menuType}
                onChange={(e) => setMenuType(e.target.value)}
                required
              >
                <option value="1">Main Menu</option>
                <option value="2">Sub Menu</option>
              </select>
            </div>

            {menuType === "2" && (
              <>
                <label className="text-base font-medium text-gray-700">Parent Resource</label>
                <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
                  <select
                    className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                    required
                  >
                    <option value="">Select Parent Resource</option>
                    {parentResources.map((resource) => (
                      <option key={resource.ResourceId} value={resource.ResourceId}>
                        {resource.ResourceName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <AuthButtons label="Create" textColor="text-white" />
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default CreateResourceModal;





