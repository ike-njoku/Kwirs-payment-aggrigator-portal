"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import { toast } from "react-toastify";

const CreateDamages = ({
  handleCloseModal,
  handleCreateModal,
  isLoading,
}) => {
  const [items, setItems] = useState([]);
  const [storeBranches, setStoreBranches] = useState([]);
  const [formData, setFormData] = useState({
    ItemCode: "",
    damageid: "",
    Date: new Date().toISOString(),
    storeBranchId: "",
    createdBy: "Admin",
    description: "",
    qty: "",
    SIV: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Items
        const itemsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/ItemDetails/GetAll`
        );
        const itemsData = await itemsResponse.json();
        if (itemsData.StatusCode === 200) {
          setItems(itemsData.Data);
        } else {
          toast.error("Failed to fetch items");
        }

        // Fetch Store Branches
        const branchesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/GetAll`
        );
        const branchesData = await branchesResponse.json();
        if (branchesData.StatusCode === 200) {
          setStoreBranches(branchesData.Data);
        } else {
          toast.error("Failed to fetch store branches");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading data");
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.ItemCode) {
      toast.error("Please select an item");
      return;
    }
    if (!formData.storeBranchId) {
      toast.error("Please select a store branch");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.qty || isNaN(formData.qty) || formData.qty <= 0) {
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
      damageid: formData.damageid ? Number(formData.damageid) : 0 // Default to 0 if empty
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
          {/* Item Selection Dropdown */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Select Item
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700 appearance-none"
                name="ItemCode"
                value={formData.ItemCode}
                onChange={handleChange}
                required
              >
                <option value="">Select an item</option>
                {items.map((item) => (
                  <option key={item.itemCode} value={item.itemCode}>
                    {item.description} 
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Store Branch Selection Dropdown */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Select Store Branch
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700 appearance-none"
                name="storeBranchId"
                value={formData.storeBranchId}
                onChange={handleChange}
                required
              >
                <option value="">Select a store branch</option>
                {storeBranches.map((branch) => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.branchName} 
                  </option>
                ))}
              </select>
            </div>
          </div>

      

          {/* Description Field */}
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

          {/* Quantity Field */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Quantity
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="number"
                name="qty"
                min="0.01"
                step="0.01"
                value={formData.qty}
                onChange={handleChange}
                placeholder="Enter Quantity"
                required
              />
            </div>
          </div>

          {/* SIV Number Field */}
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