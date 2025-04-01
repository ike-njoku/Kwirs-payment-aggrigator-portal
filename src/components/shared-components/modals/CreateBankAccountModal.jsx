"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import AgencySelect from "../../shared-components/AgencySelect";


const CreateTaxTypeModal = ({ handleCloseModal, handleCreateModal }) => {
    const CreatedBy = "Admin";
    const [accountname, setaccountname] = useState("Daeyo"); 
    const [bankName, setbankName] = useState("Shutter Bank");
    const [accountNumber, setaccountNumber] = useState("0984654322");
    const [agencyId, setagencyId] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !CreatedBy.trim() ||
      !accountname.trim() ||
      !bankName.trim() ||
      !accountNumber ||
      !agencyId.trim() 
    ) {
      alert("All fields are required!");
      setIsLoading(false);
      return;
    }

    handleCreateModal({
      CreatedBy: CreatedBy,
      accountname: accountname,
      bankName: bankName,
      accountNumber: accountNumber,
      agencyId: agencyId,
    });

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Bank Account
        </h3>

        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* CreatedBy Input */}
          <AgencySelect agencyId={agencyId} setAgencyId={setagencyId} />

          {/* Account Name */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
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
          </div>
          {/* Bank Name */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
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
          </div>
          {/*  Account Number */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Account Number
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={accountNumber}
                onChange={(e) => setaccountNumber(e.target.value)}
                placeholder="Enter  Account Number"
                required
              />
            </div>
          </div>

          {/* Agency Id */}
          {/* <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="agencyId"
            >
              Agency
            </label>

            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={agencyId}
                onChange={(e) => setagencyId(e.target.value)}
                placeholder="Select Agency "
                required
              >
                <option value="1">Test Agency</option>
                <option value="2">Sub menu</option>
              </select>
            </div>
          </div> */}

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

export default CreateTaxTypeModal;
