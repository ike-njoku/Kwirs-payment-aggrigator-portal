"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import SelectVendor from "../SelectVendor";
import SelectStoreBranch from "../SelectStoreBranch";



const CreateTaxTypeModal = ({ handleCloseModal, handleCreateModal }) => {
  const createdBy = "Admin";
  const [ItemCode, setItemCode] = useState("");
  const [rInwardId, setrInwardId] = useState("");
  const [storeBranchId, setstoreBranchId] = useState(" ");
  const [qty, setqty] = useState(" ");
  const [customerId, setcustomerId] = useState(" ");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !createdBy.trim() ||
      !ItemCode.trim() ||
      !rInwardId.trim() ||
      !storeBranchId.trim() ||
      !qty.trim() ||
      !customerId.trim()
    ) {
      alert("All fields are required!");
      setIsLoading(false);
      return;
    }

    handleCreateModal({
      createdBy,
      ItemCode,
      rInwardId,
      storeBranchId,
      qty,
      customerId,
    });

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Return Inward
        </h3>

        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* Item Code */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Item Code
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={ItemCode}
                onChange={(e) => setItemCode(e.target.value)}
                placeholder="Enter Item Code"
                required
              />
            </div>
          </div>

          {/* Return Outward ID */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Return Outward ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                type="text"
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={rInwardId}
                onChange={(e) => setrInwardId(e.target.value)}
                placeholder="Enter Return Outward ID"
                required
              />
            </div>
          </div>

          {/* storeBranchId Branch ID */}
          <SelectStoreBranch
            branchId={storeBranchId}
            setBranchId={setstoreBranchId}
          />

          {/* Quantity */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Quantity
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                type="number"
                min="0"
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={qty}
                onChange={(e) => setqty(e.target.value)}
                placeholder="Enter Quantity"
                required
              />
            </div>
          </div>

          {/* customer id */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Customer ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={customerId}
                onChange={(e) => setcustomerId(e.target.value)}
                placeholder="Enter Customer ID "
                required
              />
            </div>
          </div>


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
