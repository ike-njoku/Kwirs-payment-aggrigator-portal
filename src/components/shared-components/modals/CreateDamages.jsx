"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import { toast } from "react-toastify";

const CreateDamages = ({
  handleCloseModal,
  handleCreateModal,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    ItemCode: "",
    damageid: "",
    Date: new Date().toISOString(),
    storeBranchId: "",
    createdBy: "Admin", // Default value as per your payload
    description: "",
    qty: "",
    SIV: ""
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.qty || isNaN(formData.qty)) {
      toast.error("Valid quantity is required");
      return;
    }
    if (!formData.SIV.trim()) {
      toast.error("SIV number is required");
      return;
    }

    handleCreateModal({
      ...formData,
      storeBranchId: Number(formData.storeBranchId),
      qty: Number(formData.qty),
      ItemCode: Number(formData.ItemCode),
      damageid: Number(formData.damageid)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Add Damages
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Item Code
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                name="ItemCode"
                value={formData.ItemCode}
                onChange={handleChange}
                placeholder="Enter Item Code"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Damage ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                name="damageid"
                value={formData.damageid}
                onChange={handleChange}
                placeholder="Enter Damage ID"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Store Branch ID
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                name="storeBranchId"
                value={formData.storeBranchId}
                onChange={handleChange}
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
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                placeholder="Enter Quantity"
                required
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
                name="SIV"
                value={formData.SIV}
                onChange={handleChange}
                placeholder="Enter SIV Number"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <AuthButtons
            label="Create Damage Report"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default CreateDamages;