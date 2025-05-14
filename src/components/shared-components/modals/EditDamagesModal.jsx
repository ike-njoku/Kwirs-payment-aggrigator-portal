"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditDamagesModal = ({
  handleCloseModal,
  damageData,
  handleEditModal,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    itemCode: "",
    damageId: "",
    storeBranchId: "",
    description: "",
    quantity: "",
    sivNumber: ""
  });

  useEffect(() => {
    if (damageData) {
      console.log("Received damageData:", damageData);
      setFormData({
        itemCode: damageData.itemCode || damageData.ItemCode || "",
        damageId: damageData.damageId || damageData.damageid || "",
        storeBranchId: damageData.storeBranchId || damageData.storeId || "",
        description: damageData.Description || damageData.Description || "",
        quantity: damageData.quantity || damageData.qty || "",
        sivNumber: damageData.sivNumber || damageData.SIV || ""
      });
    }
  }, [damageData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate quantity is a positive number
    if (isNaN(formData.quantity) || formData.quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    handleEditModal({
      itemCode: formData.itemCode,
      damageId: formData.damageId,
      storeBranchId: Number(formData.storeBranchId),
      description: formData.description,
      quantity: Number(formData.quantity),
      sivNumber: formData.sivNumber,
      // These fields remain unchanged from original
      createdBy: damageData.createdBy || "Admin",
      date: damageData.date || new Date().toISOString()
    });
  };

  if (!damageData) {
    console.log("No damageData provided");
    return null;
  }

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Edit Damage Record (ID: {formData.damageId})
        </h3>
        <form className="w-full" onSubmit={handleSubmit}>
         
          <div className="w-full">
  <label className="text-base font-medium text-gray-700">
    Item Code
  </label>
  <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
    <input
      className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
      type="text"  // Changed to text to allow alphanumeric codes
      value={formData.itemCode}
      onChange={(e) => setFormData({...formData, itemCode: e.target.value})}
      placeholder="Enter Item Code"
      required
    />
  </div>
</div>

          {/* Read-only Damage ID */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Damage ID
            </label>
            <div className="border-b-2 border-b-gray-300 h-[45px] w-full rounded-md my-4 bg-gray-100 flex items-center px-3">
              <span className="text-gray-700">{formData.damageId}</span>
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
                placeholder="Enter Store Branch ID"
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
                placeholder="Enter Description"
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
                min="0.01"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                placeholder="Enter Quantity"
                required
              />
            </div>
          </div>

          {/* SIV Number */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              SIV Number
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={formData.sivNumber}
                onChange={(e) => setFormData({...formData, sivNumber: e.target.value})}
                placeholder="Enter SIV Number"
                required
              />
            </div>
          </div>

       

          <AuthButtons
            label="Update Damage Record"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditDamagesModal;