"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import SelectItems from "../SelectItems";
import SelectStoreBranch from "../SelectStoreBranch";
import SelectCustomers from "../SelectCustomers";

const EditReturnInwardModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  heading,
}) => {
  const [createdBy, setCreatedBy] = useState(index.createdBy || "Admin");
  const [ItemCode, setItemCode] = useState(index.ItemCode);
  const [rInwardId, setrInwardId] = useState(index.rInwardId);
  const [storeBranchId, setstoreBranchId] = useState(index.Store);
  const [qty, setqty] = useState(index.qty);
  const [customerId, setcustomerId] = useState(index.CustomerName);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    handleEditModal(index, {
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
          {heading || "Edit Return Inward"}
        </h3>

        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* Item Code */}
          <SelectItems selectedItem={ItemCode} setSelectedItem={setItemCode} />

          {/* Store Branch */}
          <SelectStoreBranch
            branchId={storeBranchId}
            setBranchId={setstoreBranchId}
          />

          {/* Quantity */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="0"
              className="w-full h-[45px] my-4 px-3 bg-gray-100 text-gray-700 rounded-md border-b-2 border-b-pumpkin focus:outline-none"
              value={qty}
              onChange={(e) => setqty(e.target.value)}
              placeholder="Enter Quantity"
            />
          </div>

          {/* Customer */}
          <SelectCustomers
            selectedCustomer={customerId}
            setSelectedCustomer={setcustomerId}
          />

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

export default EditReturnInwardModal;
