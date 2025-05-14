"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import { toast } from "react-toastify";

const EditDamagesModal = ({
  handleCloseModal,
  damageData,
  handleEditModal,
  isLoading
}) => {
  const [items, setItems] = useState([]);
  const [storeBranches, setStoreBranches] = useState([]);
  const [formData, setFormData] = useState({
    itemCode: "",
    damageId: "",
    storeBranchId: "",
    description: "",
    quantity: "",
    sivNumber: ""
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

  useEffect(() => {
    if (damageData) {
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
      createdBy: damageData.createdBy || "Admin",
      date: damageData.date || new Date().toISOString()
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!damageData) return null;

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Edit Damage Record (ID: {formData.damageId})
        </h3>
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Item Selection Dropdown */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Select Item
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                required
              >
                <option value="">Select an item</option>
                {items.map(item => (
                  <option key={item.itemCode} value={item.itemCode}>
                    {item.description} 
                  </option>
                ))}
              </select>
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

          {/* Store Branch Selection Dropdown */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Select Store Branch
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                name="storeBranchId"
                value={formData.storeBranchId}
                onChange={handleChange}
                required
              >
                <option value="">Select a store branch</option>
                {storeBranches.map(branch => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.branchName} 
                  </option>
                ))}
              </select>
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
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                name="quantity"
                min="0.01"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
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
                name="sivNumber"
                value={formData.sivNumber}
                onChange={handleChange}
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