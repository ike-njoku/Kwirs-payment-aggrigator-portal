"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditBankAccountModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  label,
  heading,
}) => {
  const [CreatedBy, setCreatedBy] = useState(index.CreatedBy);
  const [accountname, setaccountname] = useState(index.accountname);
  const [bankName, setbankName] = useState(index.bankName);
  const [accountNumber, setaccountNumber] = useState(index.accountNumber);
  const [agencyId, setagencyId] = useState(index.agencyId);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    handleEditModal(index, {
      CreatedBy,
      accountname,
      bankName,
      accountNumber,
      agencyId,
    });
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
              htmlFor="CreatedBy"
            >
              Created By
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={CreatedBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                placeholder="Enter  name"
                required
              />
            </div>
          </div>{" "}
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="accountname"
            >
              Account Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={accountname}
                onChange={(e) => setaccountname(e.target.value)}
                placeholder="Enter Account name"
                required
              />
            </div>
          </div>{" "}
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="bankName"
            >
              Bank Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={bankName}
                onChange={(e) => setbankName(e.target.value)}
                placeholder="Enter Bank name"
                required
              />
            </div>
          </div>{" "}
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="accountNumber"
            >
              Account Number
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={accountNumber}
                onChange={(e) => setaccountNumber(e.target.value)}
                placeholder="Enter Account Number"
                required
              />
            </div>
          </div>
          {/* Resource URL Input */}
          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="agencyId"
            >
              Agency Id
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={agencyId}
                onChange={(e) => setagencyId(e.target.value)}
                placeholder=" Agency Id"
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

export default EditBankAccountModal;
