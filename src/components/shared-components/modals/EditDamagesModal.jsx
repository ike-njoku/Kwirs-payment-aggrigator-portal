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
    ItemCode: "",
    damageid: "",
    storeBranchId: "",
    description: "",
    qty: "",
    SIV: ""
  });

  useEffect(() => {
    if (damageData) {
      console.log("Received damageData:", damageData); // Debug log
      setFormData({
        ItemCode: damageData.ItemCode || damageData.itemCode || damageData.ItemCode || "",
        damageid: damageData.damageid || damageData.damageId || "",
        storeBranchId: damageData.storeBranchId || damageData.storeId || "",
        description: damageData.description || damageData.Description || "",
        qty: damageData.qty || damageData.quantity || "",
        SIV: damageData.SIV || damageData.SIVNo || ""
      });
    }
  }, [damageData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditModal({
      ...formData,
      ItemCode: Number(formData.ItemCode),
      damageid: Number(formData.damageid),
      storeBranchId: Number(formData.storeBranchId),
      qty: Number(formData.qty),
      createdBy: "Admin",
      Date: new Date().toISOString()
    });
  };

  if (!damageData) {
    console.log("No damageData provided"); // Debug log
    return null;
  }


  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Edit Damage Record (ID: {damageData.damageid || damageData.damageId})
        </h3>
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Read-only fields */}
         {/* Read-only fields */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Item Code
            </label>
            <div className="border-b-2 border-b-gray-300 h-[45px] w-full rounded-md my-4 bg-gray-100">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={formData.ItemCode}
                readOnly
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Damage ID
            </label>
            <div className="border-b-2 border-b-gray-300 h-[45px] w-full rounded-md my-4 bg-gray-100">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={formData.damageid}
                readOnly
              />
            </div>
          </div>

          {/* Editable fields */}
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

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Quantity
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                value={formData.qty}
                onChange={(e) => setFormData({...formData, qty: e.target.value})}
                placeholder="Enter Quantity"
                required
                step="0.01" // Allows decimal values
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              SIV Number
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={formData.SIV}
                onChange={(e) => setFormData({...formData, SIV: e.target.value})}
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