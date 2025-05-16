"use client";
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";


const EditCustomerModal = ({
  handleCloseModal,
  index,
  handleEditModal,
  heading,
}) => {
  const customerId = index.CustomerId;
  const [customerName, setcustomerName] = useState(index.CustomerName);
  const [address, setAddress] = useState(index.Address);
  const [phone, setPhone] = useState(index.phone);
  const [email, setEmail] = useState(index.email);
  const [meansofIdentification, setMeansOfIdentification] = useState(
    index.meansofId
  );
  const [IdentificationId, setIdentificationId] = useState(index.IdDetails);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    handleEditModal(index, {
      customerId,
      customerName,
      address,
      phone,
      email,
      meansofIdentification,
      IdentificationId,
    });

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      {customerId}
      <div className="w-full p-5">
        <h3 className="my-5 text-lg font-semibold pb-4 border-b border-b-gray-500 text-gray-700">
          {heading}
        </h3>
        <form className="w-full" onSubmit={handleFormSubmit}>
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Customer Name
            </label>
            <input
              className="w-full h-[45px] bg-gray-100 px-3 border-b-2 border-pumpkin focus:outline-none"
              type="text"
              value={customerName}
              onChange={(e) => setcustomerName(e.target.value)}
              placeholder="Enter Customer Name"
              required
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Address
            </label>
            <input
              className="w-full h-[45px] bg-gray-100 px-3 border-b-2 border-pumpkin focus:outline-none"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Address"
              required
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Phone</label>
            <input
              className="w-full h-[45px] bg-gray-100 px-3 border-b-2 border-pumpkin focus:outline-none"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Phone"
              required
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Email</label>
            <input
              className="w-full h-[45px] bg-gray-100 px-3 border-b-2 border-pumpkin focus:outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Means of Identification
            </label>
            <div className="border-b-2 border-b-pumpkin h-[45px] w-full rounded-md my-4">
              <select
                className="w-full h-full bg-gray-100 px-3 focus:outline-none text-gray-700"
                value={meansofIdentification}
                onChange={(e) => setMeansOfIdentification(e.target.value)}
                required
              >
                <option value="">Select Identification</option>
                <option value="NIN">NIN</option>
                <option value="Voter's Card">Voter's Card</option>
                <option value="Driver's License">Driver's License</option>
                <option value="Passport">Passport</option>
              </select>
            </div>
            {/* <input
              className="w-full h-[45px] bg-gray-100 px-3 border-b-2 border-pumpkin focus:outline-none"
              type="text"
              value={meansOfIdentification}
              onChange={(e) => setMeansOfIdentification(e.target.value)}
              placeholder="e.g. National ID"
              required
            /> */}
          </div>

          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">
              Identification ID
            </label>
            <input
              className="w-full h-[45px] bg-gray-100 px-3 border-b-2 border-pumpkin focus:outline-none"
              type="text"
              value={IdentificationId}
              onChange={(e) => setIdentificationId(e.target.value)}
              placeholder="e.g. ID Number"
              required
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

export default EditCustomerModal;
