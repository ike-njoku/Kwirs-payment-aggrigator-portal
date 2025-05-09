"use client";
import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditVendorModal = ({
  handleCloseModal,
  vendorData, // This should contain the existing vendor data
  handleEditModal,
  isLoading
}) => {
  // Initialize state with existing vendor data
  const [formData, setFormData] = useState({
    vendorName: "",
    email: "",
    address: "",
    phone: ""
  });

  // Update form when vendorData changes
  useEffect(() => {
    if (vendorData) {
      setFormData({
        vendorName: vendorData.VendorsName || vendorData.vendorName || "",
        email: vendorData.VendorsEmail || vendorData.email || "",
        address: vendorData.VendorsAddress || vendorData.address || "",
        phone: vendorData.VendorsPhone || vendorData.phone || ""
      });
    }
  }, [vendorData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditModal(
      formData.vendorName,
      formData.email,
      formData.address,
      formData.phone
    );
  };

  if (!vendorData) return null;

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Edit Vendor (ID: {vendorData.vendorId || vendorData.VendorsId})
        </h3>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Vendor Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={formData.vendorName}
                onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                placeholder="Vendor Name"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Vendor Address
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Vendor Address"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Vendor Email
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Vendor Email"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Vendor Phone
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Vendor Phone"
                required
              />
            </div>
          </div>

          <AuthButtons
            label="Update Vendor"
            textColor="text-white"
            isLoading={isLoading}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditVendorModal;