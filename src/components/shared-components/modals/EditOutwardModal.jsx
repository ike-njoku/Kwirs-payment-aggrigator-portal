"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";
import { toast } from "react-toastify";

const EditOutwardModal = ({
  handleCloseModal,
  outwardData,
  handleEditModal,
  isLoading
}) => {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [storeBranches, setStoreBranches] = useState([]);
  const [formData, setFormData] = useState({
    itemCode: "",
    storeBranchId: "",
    vendor: "",
    qty: "",
    description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Items
        const itemsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/ItemDetails/GetAll`
        );
        const itemsData = await itemsResponse.json();
        if (itemsData.StatusCode === 200) setItems(itemsData.Data);

        // Fetch Vendors
        const vendorsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/GetAll`
        );
        const vendorsData = await vendorsResponse.json();
        if (vendorsData.StatusCode === 200) setVendors(vendorsData.Data);

        // Fetch Store Branches
        const branchesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/GetAll`
        );
        const branchesData = await branchesResponse.json();
        if (branchesData.StatusCode === 200) setStoreBranches(branchesData.Data);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading data");
      }
    };

    fetchData();
  }, []);

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
    
    if (isNaN(formData.qty) || formData.qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    handleEditModal(
      outwardData.rOutwardId,
      Number(formData.itemCode),
      Number(formData.storeBranchId),
      formData.description,
      Number(formData.vendor),
      Number(formData.qty)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

          {/* Vendor Selection Dropdown */}
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Select Vendor
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
              >
                <option value="">Select a vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.vendorId} value={vendor.vendorId}>
                    {vendor.vendorName} 
                  </option>
                ))}
              </select>
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
                name="qty"
                min="1"
                value={formData.qty}
                onChange={handleChange}
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
                name="description"
                value={formData.description}
                onChange={handleChange}
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