"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreateRoleModel = ({
  handleCloseModal,
  handleCreateModal,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleFormSubmit = () => {
    handleCloseModal();
    handleCreateModal(inputValue);
  };
  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5 ">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Role
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="role"
            >
              Role Name
            </label>

            <div className="border-b-2 border-b-pumpkin dark:border-b-darkPumpkin2 h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter role name"
              />
            </div>

            <AuthButtons
              label="Create"
              textColor="text-white"
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </ModalLayout>
  );
};

export default CreateRoleModel;
