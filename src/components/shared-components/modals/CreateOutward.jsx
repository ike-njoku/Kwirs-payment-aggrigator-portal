"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const CreateOutward = ({
  handleCloseModal,
  handleCreateModal,
  isLoading,
}) => {
  const [vendorId, setVendorId] = useState("");
    const [email, setVendorEmail] = useState("");
    const [phone, setVendorPhone] = useState("");
    const [Address, setVendorAddress] = useState("");
    const [vendorName, setVendorName] = useState("");

    const handleFormSubmit = (e) => {
      e.preventDefault();
      
      // Basic validation
      if (!vendorName.trim()) {
        toast.error("Vendor name is required");
        return;
      }
    
      handleCreateModal(
        vendorId,
        vendorName,
        email,
        Address,
        phone
      );
    };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          Create Vendor
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          {/* Description Field */}
          {/* <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="description"
            >
          Vendor Id
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="Enter Id"
              />
            </div>
          </div> */}


          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="description"
            >
          Vendor Name
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Enter Name"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="description"
            >
          Vendor Address
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={Address}
                onChange={(e) => setVendorAddress(e.target.value)}
                placeholder="Enter Address "
              />
            </div>
          </div>


          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="description"
            >
          Vendor Email
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={email}
                onChange={(e) => setVendorEmail(e.target.value)}
                placeholder="Enter Email"
              />
            </div>
          </div>
         

          <div className="w-full">
            <label
              className="text-base font-medium text-gray-700"
              htmlFor="description"
            >
          Vendor Phone Number
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <input
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                type="text"
                value={phone}
                onChange={(e) => setVendorPhone(e.target.value)}
                placeholder="Enter Id"
              />
            </div>
          </div>

       
          {/* Submit Button */}
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

export default CreateOutward;
