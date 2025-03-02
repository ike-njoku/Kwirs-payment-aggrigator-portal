"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  label,
  heading,
}) => {
  const [roleInput, setRoleInput] = useState(index.name);
  const [isLoading, setIsLoading] = useState(false);
  const handleFormSubmit = () => {
    setIsLoading(true);
    handleEditModal(index, roleInput);
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
              htmlFor="role"
            >
              {label}
            </label>

            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="Enter role name"
              />
            </div>

            <AuthButtons
              label="Update"
              textColor="text-white"
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditModal;
