"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditOutwardModal = ({
  handleCloseModal,
  outwardData, // Existing outward data
  handleEditModal, // This will follow your pattern
  isLoading
}) => {
  // Initialize state with existing outward data
  const [formData, setFormData] = useState({
    itemCode: "",
    storeBranchId: "",
    vendor: "",
    qty: "",
    description: ""
  });

  // Update form when outwardData changes
  useEffect(() => {
    if (outwardData) {
      setFormData({
        itemCode: outwardData.ItemCode || "",
        storeBranchId: outwardData.storeBranchId || "",
        vendor: outwardData.vendor || "",
        qty: outwardData.qty || "",
        description: outwardData.description || ""
      });
    }
  }, [outwardData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate quantity is a positive number
    if (isNaN(formData.qty) || formData.qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    // Following your pattern of passing individual parameters
    handleEditModal(
      outwardData.rOutwardId, // Can't be changed
      Number(formData.itemCode),
      Number(formData.storeBranchId),
      formData.description,
      Number(formData.vendor),
      Number(formData.qty)
    );
  };

  if (!outwardData) return null;

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Edit Outward (ID: {outwardData.rOutwardId})
        </h3>
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Read-only Outward ID */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Outward ID
            </label>
            <div className="border-b-2 border-b-gray-300 h-[45px] w-full rounded-md my-4 bg-gray-100 flex items-center px-3">
              <span className="text-gray-700">{outwardData.rOutwardId}</span>
            </div>
          </div>

          {/* Item Code */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Item Code
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                value={formData.itemCode}
                onChange={(e) => setFormData({...formData, itemCode: e.target.value})}
                placeholder="Item Code"
                required
              />
            </div>
          </div>

          {/* Store Branch ID */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Store Branch ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                value={formData.storeBranchId}
                onChange={(e) => setFormData({...formData, storeBranchId: e.target.value})}
                placeholder="Store Branch ID"
                required
              />
            </div>
          </div>

          {/* Vendor ID */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Vendor ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                value={formData.vendor}
                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                placeholder="Vendor ID"
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Quantity
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                min="1"
                value={formData.qty}
                onChange={(e) => setFormData({...formData, qty: e.target.value})}
                placeholder="Quantity"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Description
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description"
              />
            </div>
          </div>


          <AuthButtons
            label="Update Outward"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditOutwardModal;