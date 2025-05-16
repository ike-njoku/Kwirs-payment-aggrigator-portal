"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditBankAccountModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  heading,
}) => {
  const [createdBy, setCreatedBy] = useState(index.createdBy);
  const [ItemCode, setItemCode] = useState(index.ItemCode);
  const [Store, setStore] = useState(index.Store);
  const [description, setdescription] = useState(index.description);
  const [qty, setqty] = useState(index.qty);
  const [rOutwardId, setrOutwardId] = useState(index.rOutwardId);
  const [vendorName, setvendorName] = useState(index.vendorName);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    handleEditModal(index, {
      createdBy,
      ItemCode,
      Store,
      description,
      qty,
      rOutwardId,
      vendorName,
    });

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          {heading}
        </h3>

        <form className="w-full" onSubmit={handleFormSubmit}>


          <div className="w-full">
            <label className="text-base font-medium text-gray-700">Store</label>
            <input
              type="text"
              className="w-full h-[45px] my-4 px-3 bg-gray-100 text-gray-700 rounded-md border-b-2 border-b-pumpkin focus:outline-none"
              value={Store}
              onChange={(e) => setStore(e.target.value)}
              placeholder="Enter store name"
            />
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              className="w-full h-[45px] my-4 px-3 bg-gray-100 text-gray-700 rounded-md border-b-2 border-b-pumpkin focus:outline-none"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              className="w-full h-[45px] my-4 px-3 bg-gray-100 text-gray-700 rounded-md border-b-2 border-b-pumpkin focus:outline-none"
              value={qty}
              onChange={(e) => setqty(Number(e.target.value))}
              placeholder="Enter quantity"
            />
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              rOutward ID
            </label>
            <input
              type="text"
              className="w-full h-[45px] my-4 px-3 bg-gray-100 text-gray-700 rounded-md border-b-2 border-b-pumpkin focus:outline-none"
              value={rOutwardId}
              onChange={(e) => setrOutwardId(e.target.value)}
              placeholder="Enter rOutward ID"
            />
          </div>

          <div className="w-full">
            <label className="text-base font-medium text-gray-700">
              Vendor Name
            </label>
            <input
              type="text"
              className="w-full h-[45px] my-4 px-3 bg-gray-100 text-gray-700 rounded-md border-b-2 border-b-pumpkin focus:outline-none"
              value={vendorName}
              onChange={(e) => setvendorName(e.target.value)}
              placeholder="Enter vendor name"
            />
          </div>

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

export default EditBankAccountModal;
